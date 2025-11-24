
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function convertToSvg() {
  const imagePath = '/Users/kashyapmaheshwari/Blender-Workspace/projects/vectorcraft-ai/cli/tiger_print_pattern_albedo.png';
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('No API KEY found');
    process.exit(1);
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  const response = await fetch('http://localhost:3001/api/vector/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      image: base64Image,
      mimeType: 'image/png',
      mode: 'illustration',
      maxColors: 4
    })
  });

  const data = await response.json();
  
  if (data.svg) {
    fs.writeFileSync('/Users/kashyapmaheshwari/Blender-Workspace/projects/vectorcraft-ai/cli/tiger_print.svg', data.svg);
    console.log('SVG saved to tiger_print.svg');
  } else {
    console.error('Failed:', data);
  }
}

// Load env vars (simple implementation for test script)
const envFile = fs.readFileSync('/Users/kashyapmaheshwari/Blender-Workspace/projects/vectorcraft-ai/api/.env', 'utf8');
const envLine = envFile.split('\n').find(line => line.startsWith('GEMINI_API_KEY='));
if (envLine) {
  process.env.GEMINI_API_KEY = envLine.split('=')[1];
}

convertToSvg();
