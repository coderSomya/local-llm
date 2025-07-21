import express from 'express';
import axios from 'axios';
import fs from 'fs';
import os from 'os';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { logToDisk } from '../utils/logging.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_PATH = path.join(__dirname, '../logs/log.jsonl');
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://192.168.1.2:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5'; 

app.use(express.json());
app.use(cors());

// POST /generate
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid prompt' });
  }
  try {
    // using Ollama local API
    const ollamaRes = await axios.post(OLLAMA_URL, {
      model: OLLAMA_MODEL,
      prompt,
      stream: false
    });
    const response = ollamaRes.data.response || '';
    const logEntry = { timestamp: new Date().toISOString(), prompt, response };
    logToDisk(logEntry);
    res.json({ response });
  } catch (err) {
    const errorMsg = err.response?.data || err.message || 'Unknown error';
    logToDisk({ timestamp: new Date().toISOString(), prompt, error: errorMsg });
    res.status(500).json({ error: 'Failed to generate response', details: errorMsg });
  }
});

// GET /status
app.get('/status', (req, res) => {
  const memory = process.memoryUsage();
  const uptime = process.uptime();

  res.json({
    memory: {
      rss: memory.rss,
      heapTotal: memory.heapTotal,
      heapUsed: memory.heapUsed,
      external: memory.external
    },
    uptime,
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length
  });
});

app.listen(PORT, () => {
  console.log(`MiniVault API running on http://localhost:${PORT}`);
}); 