/**
 * Test suite for Dream Textures MCP Server
 * Tests MCP protocol communication and Blender bridge
 */

import { spawn } from 'child_process';
import axios from 'axios';

const BLENDER_API_URL = 'http://127.0.0.1:5555';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color: string, prefix: string, message: string) {
  console.log(`${color}${prefix}${colors.reset} ${message}`);
}

function success(message: string) {
  log(colors.green, '✓', message);
}

function error(message: string) {
  log(colors.red, '✗', message);
}

function info(message: string) {
  log(colors.blue, 'ℹ', message);
}

function warn(message: string) {
  log(colors.yellow, '⚠', message);
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: Check if Blender bridge is running
async function testBlenderBridge() {
  console.log('\n' + '='.repeat(60));
  info('Test 1: Blender Bridge Health Check');
  console.log('='.repeat(60));

  try {
    const response = await axios.get(`${BLENDER_API_URL}/health`, { timeout: 5000 });

    if (response.data.status === 'healthy') {
      success('Blender bridge is running');
      info(`  Blender version: ${response.data.blender_version}`);
      info(`  Dream Textures: ${response.data.dream_textures_enabled ? 'Enabled' : 'Disabled'}`);
      info(`  Python version: ${response.data.python_version}`);

      if (!response.data.dream_textures_enabled) {
        warn('  Dream Textures addon is not enabled in Blender!');
        warn('  Enable it in: Edit > Preferences > Add-ons > Dream Textures');
        return false;
      }
      return true;
    } else {
      error('Blender bridge returned unhealthy status');
      return false;
    }
  } catch (err: any) {
    error('Blender bridge is not responding');
    if (err.code === 'ECONNREFUSED') {
      warn('  Connection refused - is Blender running?');
      warn('  Start with: blender --background --python blender_bridge.py');
    } else {
      warn(`  Error: ${err.message}`);
    }
    return false;
  }
}

// Test 2: Test MCP server startup
async function testMCPServerStartup() {
  console.log('\n' + '='.repeat(60));
  info('Test 2: MCP Server Startup');
  console.log('='.repeat(60));

  return new Promise<boolean>((resolve) => {
    const mcpProcess = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let startupTimeout: NodeJS.Timeout;
    let hasStarted = false;

    mcpProcess.stderr.on('data', (data) => {
      const message = data.toString();
      if (message.includes('Dream Textures MCP server running')) {
        hasStarted = true;
        success('MCP server started successfully');
        clearTimeout(startupTimeout);
        mcpProcess.kill();
        resolve(true);
      }
    });

    mcpProcess.on('error', (err) => {
      error(`Failed to start MCP server: ${err.message}`);
      clearTimeout(startupTimeout);
      resolve(false);
    });

    startupTimeout = setTimeout(() => {
      if (!hasStarted) {
        error('MCP server failed to start within 5 seconds');
        mcpProcess.kill();
        resolve(false);
      }
    }, 5000);
  });
}

// Test 3: Test MCP communication (list tools)
async function testMCPTools() {
  console.log('\n' + '='.repeat(60));
  info('Test 3: MCP Tools Discovery');
  console.log('='.repeat(60));

  return new Promise<boolean>((resolve) => {
    const mcpProcess = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    mcpProcess.stderr.on('data', (data) => {
      const message = data.toString();
      if (message.includes('running')) {
        // Server started, send list_tools request
        const request = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list',
          params: {},
        };

        mcpProcess.stdin.write(JSON.stringify(request) + '\n');
      }
    });

    let responseBuffer = '';
    mcpProcess.stdout.on('data', (data) => {
      responseBuffer += data.toString();

      try {
        const response = JSON.parse(responseBuffer);
        if (response.result && response.result.tools) {
          success(`Found ${response.result.tools.length} tools:`);
          response.result.tools.forEach((tool: any, idx: number) => {
            info(`  ${idx + 1}. ${tool.name} - ${tool.description.substring(0, 60)}...`);
          });

          // Verify expected tools
          const expectedTools = [
            'generate_pbr_texture',
            'generate_single_map',
            'refine_texture',
            'check_blender_status'
          ];

          const toolNames = response.result.tools.map((t: any) => t.name);
          const allPresent = expectedTools.every(name => toolNames.includes(name));

          if (allPresent) {
            success('All expected tools are present');
            mcpProcess.kill();
            resolve(true);
          } else {
            const missing = expectedTools.filter(name => !toolNames.includes(name));
            error(`Missing tools: ${missing.join(', ')}`);
            mcpProcess.kill();
            resolve(false);
          }
        }
      } catch (err) {
        // Not complete JSON yet, keep buffering
      }
    });

    setTimeout(() => {
      error('Tool discovery timed out');
      mcpProcess.kill();
      resolve(false);
    }, 10000);
  });
}

// Test 4: Test check_blender_status tool
async function testBlenderStatusTool() {
  console.log('\n' + '='.repeat(60));
  info('Test 4: check_blender_status Tool');
  console.log('='.repeat(60));

  return new Promise<boolean>((resolve) => {
    const mcpProcess = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    mcpProcess.stderr.on('data', (data) => {
      const message = data.toString();
      if (message.includes('running')) {
        const request = {
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/call',
          params: {
            name: 'check_blender_status',
            arguments: {},
          },
        };

        mcpProcess.stdin.write(JSON.stringify(request) + '\n');
      }
    });

    let responseBuffer = '';
    mcpProcess.stdout.on('data', (data) => {
      responseBuffer += data.toString();

      try {
        const response = JSON.parse(responseBuffer);
        if (response.result) {
          const content = response.result.content[0].text;
          const status = JSON.parse(content);

          if (status.status === 'healthy' || status.status === 'offline') {
            success('check_blender_status tool works');
            info(`  Status: ${status.status}`);
            if (status.blender_version) {
              info(`  Blender: ${status.blender_version}`);
            }
            if (status.error) {
              warn(`  Note: ${status.message}`);
            }
            mcpProcess.kill();
            resolve(true);
          } else {
            error('Unexpected status response');
            mcpProcess.kill();
            resolve(false);
          }
        }
      } catch (err) {
        // Not complete JSON yet
      }
    });

    setTimeout(() => {
      error('Blender status check timed out');
      mcpProcess.kill();
      resolve(false);
    }, 10000);
  });
}

// Test 5: Validate tool schemas
async function testToolSchemas() {
  console.log('\n' + '='.repeat(60));
  info('Test 5: Tool Schema Validation');
  console.log('='.repeat(60));

  return new Promise<boolean>((resolve) => {
    const mcpProcess = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    mcpProcess.stderr.on('data', (data) => {
      const message = data.toString();
      if (message.includes('running')) {
        const request = {
          jsonrpc: '2.0',
          id: 3,
          method: 'tools/list',
          params: {},
        };

        mcpProcess.stdin.write(JSON.stringify(request) + '\n');
      }
    });

    let responseBuffer = '';
    mcpProcess.stdout.on('data', (data) => {
      responseBuffer += data.toString();

      try {
        const response = JSON.parse(responseBuffer);
        if (response.result && response.result.tools) {
          let allValid = true;

          response.result.tools.forEach((tool: any) => {
            // Validate schema structure
            if (!tool.inputSchema || !tool.inputSchema.type || !tool.inputSchema.properties) {
              error(`${tool.name}: Missing or invalid inputSchema`);
              allValid = false;
            } else {
              success(`${tool.name}: Schema valid`);

              // Check for required fields
              const required = tool.inputSchema.required || [];
              info(`  Required params: ${required.length > 0 ? required.join(', ') : 'none'}`);

              // Check property types
              const props = Object.keys(tool.inputSchema.properties);
              info(`  Total params: ${props.length}`);
            }
          });

          mcpProcess.kill();
          resolve(allValid);
        }
      } catch (err) {
        // Not complete JSON yet
      }
    });

    setTimeout(() => {
      error('Schema validation timed out');
      mcpProcess.kill();
      resolve(false);
    }, 10000);
  });
}

// Test 6: Error handling (invalid tool name)
async function testErrorHandling() {
  console.log('\n' + '='.repeat(60));
  info('Test 6: Error Handling');
  console.log('='.repeat(60));

  return new Promise<boolean>((resolve) => {
    const mcpProcess = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    mcpProcess.stderr.on('data', (data) => {
      const message = data.toString();
      if (message.includes('running')) {
        const request = {
          jsonrpc: '2.0',
          id: 4,
          method: 'tools/call',
          params: {
            name: 'nonexistent_tool',
            arguments: {},
          },
        };

        mcpProcess.stdin.write(JSON.stringify(request) + '\n');
      }
    });

    let responseBuffer = '';
    mcpProcess.stdout.on('data', (data) => {
      responseBuffer += data.toString();

      try {
        const response = JSON.parse(responseBuffer);
        if (response.result && response.result.isError) {
          success('Error handling works correctly');
          info(`  Error message: ${response.result.content[0].text.substring(0, 60)}...`);
          mcpProcess.kill();
          resolve(true);
        } else if (response.error) {
          success('MCP SDK error handling works');
          mcpProcess.kill();
          resolve(true);
        }
      } catch (err) {
        // Not complete JSON yet
      }
    });

    setTimeout(() => {
      error('Error handling test timed out');
      mcpProcess.kill();
      resolve(false);
    }, 10000);
  });
}

// Main test runner
async function runTests() {
  console.log('\n' + '━'.repeat(60));
  console.log(colors.cyan + '  Dream Textures MCP Server Test Suite' + colors.reset);
  console.log('━'.repeat(60));

  const results: { name: string; passed: boolean }[] = [];

  // Test 1: Blender Bridge
  const test1 = await testBlenderBridge();
  results.push({ name: 'Blender Bridge Health', passed: test1 });

  if (!test1) {
    warn('\nSkipping remaining tests - Blender bridge is not available');
    warn('To run full tests:');
    warn('  1. Start Blender: blender --background --python blender_bridge.py');
    warn('  2. Wait for "Running on http://127.0.0.1:5555"');
    warn('  3. Re-run this test suite');
  }

  // Test 2: MCP Server Startup
  const test2 = await testMCPServerStartup();
  results.push({ name: 'MCP Server Startup', passed: test2 });

  // Test 3: Tool Discovery
  const test3 = await testMCPTools();
  results.push({ name: 'MCP Tools Discovery', passed: test3 });

  // Test 4: Blender Status Tool
  const test4 = await testBlenderStatusTool();
  results.push({ name: 'check_blender_status Tool', passed: test4 });

  // Test 5: Schema Validation
  const test5 = await testToolSchemas();
  results.push({ name: 'Tool Schema Validation', passed: test5 });

  // Test 6: Error Handling
  const test6 = await testErrorHandling();
  results.push({ name: 'Error Handling', passed: test6 });

  // Summary
  console.log('\n' + '━'.repeat(60));
  console.log(colors.cyan + '  Test Summary' + colors.reset);
  console.log('━'.repeat(60));

  const passed = results.filter(r => r.passed).length;
  const total = results.length;

  results.forEach(result => {
    if (result.passed) {
      success(result.name);
    } else {
      error(result.name);
    }
  });

  console.log('\n' + '─'.repeat(60));
  const percentage = Math.round((passed / total) * 100);
  const summaryColor = percentage === 100 ? colors.green : percentage >= 50 ? colors.yellow : colors.red;
  console.log(`${summaryColor}  ${passed}/${total} tests passed (${percentage}%)${colors.reset}`);
  console.log('─'.repeat(60) + '\n');

  process.exit(passed === total ? 0 : 1);
}

runTests().catch(console.error);
