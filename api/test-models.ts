
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('No API KEY');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Testing gemini-1.5-flash...');
    const result = await model.generateContent('Hello');
    console.log('Success:', result.response.text());
  } catch (error) {
    console.error('Error with gemini-1.5-flash:', error.message);
  }

  try {
    // There isn't a direct listModels method on the instance in newer SDKs cleanly exposed 
    // without using the ModelManager or similar, but let's try a known working model
    const model2 = genAI.getGenerativeModel({ model: 'gemini-pro' });
    console.log('Testing gemini-pro...');
    const result2 = await model2.generateContent('Hello');
    console.log('Success:', result2.response.text());
  } catch (error) {
    console.error('Error with gemini-pro:', error.message);
  }
}

listModels();

