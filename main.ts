import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const repositoryDir = resolve(process.env.MAKEFUN_BOT_DIR ?? '/bot');
const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
const source = resolve(repositoryDir, 'VIDEO.json');
const destination = resolve(outputDir, 'VIDEO.json');

try {
  const video = JSON.parse(await readFile(source, 'utf8'));
  const url = video?.url;
  if (typeof url !== 'string' || !url.startsWith('https://') ||
      (!url.includes('youtube.com/') && !url.includes('youtu.be/'))) {
    throw new Error('VIDEO.json must contain a "url" that starts with https:// and contains youtube.com/ or youtu.be/');
  }

  await mkdir(outputDir, { recursive: true });
  await copyFile(source, destination);
  console.log(`Copied YouTube URL: ${url}`);
} catch (error) {
  const code = (error as NodeJS.ErrnoException).code;
  if (code === 'ENOENT' && source) {
    console.error(`Required VIDEO.json was not found at ${source}`);
  } else {
    console.error(`Could not copy VIDEO.json from ${source} to ${destination}: ${(error as Error).message}`);
  }
  process.exitCode = 1;
}
