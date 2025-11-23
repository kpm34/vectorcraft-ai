/**
 * Dream Textures MCP Server
 * Exposes Blender Dream Textures plugin as MCP tools
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const BLENDER_API_URL = process.env.BLENDER_API_URL || 'http://127.0.0.1:5555';

interface PBRTextures {
  albedo?: string;
  normal?: string;
  roughness?: string;
  metallic?: string;
  ao?: string;
}

class DreamTexturesMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'dream-textures-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'generate_pbr_texture',
          description: 'Generate complete PBR texture set using Dream Textures AI',
          inputSchema: {
            type: 'object',
            properties: {
              prompt: {
                type: 'string',
                description: 'Text description of the material (e.g., "brushed steel with scratches")',
              },
              resolution: {
                type: 'number',
                description: 'Texture resolution (512, 1024, 2048, 4096)',
                enum: [512, 1024, 2048, 4096],
                default: 1024,
              },
              maps: {
                type: 'array',
                description: 'Which PBR maps to generate',
                items: {
                  type: 'string',
                  enum: ['albedo', 'normal', 'roughness', 'metallic', 'ao'],
                },
                default: ['albedo', 'normal', 'roughness', 'metallic'],
              },
              seed: {
                type: 'number',
                description: 'Random seed for reproducibility (-1 for random)',
                default: -1,
              },
              steps: {
                type: 'number',
                description: 'Number of diffusion steps (more = better quality, slower)',
                default: 20,
              },
            },
            required: ['prompt'],
          },
        },
        {
          name: 'generate_single_map',
          description: 'Generate a single PBR texture map',
          inputSchema: {
            type: 'object',
            properties: {
              prompt: {
                type: 'string',
                description: 'Material description',
              },
              map_type: {
                type: 'string',
                description: 'Type of map to generate',
                enum: ['albedo', 'normal', 'roughness', 'metallic', 'ao'],
              },
              resolution: {
                type: 'number',
                enum: [512, 1024, 2048, 4096],
                default: 1024,
              },
              seed: {
                type: 'number',
                default: -1,
              },
              steps: {
                type: 'number',
                default: 20,
              },
            },
            required: ['prompt', 'map_type'],
          },
        },
        {
          name: 'refine_texture',
          description: 'Refine existing texture using img2img (add details, variations)',
          inputSchema: {
            type: 'object',
            properties: {
              base_texture: {
                type: 'string',
                description: 'Base64 encoded PNG of texture to refine',
              },
              prompt: {
                type: 'string',
                description: 'Description of modifications (e.g., "add scratches and wear")',
              },
              strength: {
                type: 'number',
                description: 'How much to change the image (0-1, lower = subtle)',
                default: 0.5,
                minimum: 0,
                maximum: 1,
              },
              resolution: {
                type: 'number',
                enum: [512, 1024, 2048],
                default: 1024,
              },
              steps: {
                type: 'number',
                default: 20,
              },
            },
            required: ['base_texture', 'prompt'],
          },
        },
        {
          name: 'check_blender_status',
          description: 'Check if Blender and Dream Textures are running and ready',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generate_pbr_texture':
            return await this.generatePBRTexture(args as any);

          case 'generate_single_map':
            return await this.generateSingleMap(args as any);

          case 'refine_texture':
            return await this.refineTexture(args as any);

          case 'check_blender_status':
            return await this.checkBlenderStatus();

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async generatePBRTexture(args: {
    prompt: string;
    resolution?: number;
    maps?: string[];
    seed?: number;
    steps?: number;
  }) {
    const response = await axios.post(`${BLENDER_API_URL}/generate-pbr-set`, {
      prompt: args.prompt,
      resolution: args.resolution || 1024,
      maps: args.maps || ['albedo', 'normal', 'roughness', 'metallic'],
      seed: args.seed ?? -1,
      steps: args.steps || 20,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Generation failed');
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            prompt: response.data.prompt,
            resolution: response.data.resolution,
            maps: response.data.maps,
            message: `Generated PBR texture set: ${Object.keys(response.data.maps).join(', ')}`,
          }, null, 2),
        },
      ],
    };
  }

  private async generateSingleMap(args: {
    prompt: string;
    map_type: string;
    resolution?: number;
    seed?: number;
    steps?: number;
  }) {
    const response = await axios.post(`${BLENDER_API_URL}/generate-texture`, {
      prompt: args.prompt,
      map_type: args.map_type,
      resolution: args.resolution || 1024,
      seed: args.seed ?? -1,
      steps: args.steps || 20,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Generation failed');
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            map_type: response.data.map_type,
            image: response.data.image,
            resolution: response.data.resolution,
            prompt_used: response.data.prompt_used,
          }, null, 2),
        },
      ],
    };
  }

  private async refineTexture(args: {
    base_texture: string;
    prompt: string;
    strength?: number;
    resolution?: number;
    steps?: number;
  }) {
    const response = await axios.post(`${BLENDER_API_URL}/refine-texture`, {
      base_texture: args.base_texture,
      prompt: args.prompt,
      strength: args.strength ?? 0.5,
      resolution: args.resolution || 1024,
      steps: args.steps || 20,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Refinement failed');
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            image: response.data.image,
            message: 'Texture refined successfully',
          }, null, 2),
        },
      ],
    };
  }

  private async checkBlenderStatus() {
    try {
      const response = await axios.get(`${BLENDER_API_URL}/health`);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: response.data.status,
              blender_version: response.data.blender_version,
              dream_textures_enabled: response.data.dream_textures_enabled,
              python_version: response.data.python_version,
              api_url: BLENDER_API_URL,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'offline',
              error: error instanceof Error ? error.message : String(error),
              message: 'Blender API is not responding. Make sure Blender is running with the bridge script.',
            }, null, 2),
          },
        ],
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Dream Textures MCP server running on stdio');
  }
}

const server = new DreamTexturesMCPServer();
server.run().catch(console.error);
