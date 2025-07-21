import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_PATH = path.join(__dirname, '../logs/log.jsonl');

export function logToDisk(entry) {
  const line = JSON.stringify(entry) + '\n';
  fs.appendFile(LOG_PATH, line, err => {
    if (err) console.error('Failed to log:', err);
  });
}