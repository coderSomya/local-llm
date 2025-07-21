#!/usr/bin/env node
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000/generate';

async function main() {
  const prompt = process.argv.slice(2).join(' ');
  if (!prompt) {
    console.error('npm run cli <your prompt>');
    process.exit(1);
  }
  try {
    const res = await axios.post(API_URL, { prompt });
    console.log(res.data.response);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
    process.exit(1);
  }
}

main(); 