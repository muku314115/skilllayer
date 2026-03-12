import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(join(__dirname, '../dist')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'SkillLayer', version: '1.0.0' });
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`SkillLayer running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});
