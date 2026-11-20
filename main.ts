import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const repositoryDir = resolve(process.env.MAKEFUN_BOT_DIR ?? '/bot');
const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
const source = resolve(repositoryDir, 'VIDEO.json');
const destination = resolve(outputDir, 'VIDEO.json');

try {
  await mkdir(outputDir, { recursive: true });
  await copyFile(source, destination);
} catch (error) {
  const code = (error as NodeJS.ErrnoException).code;
  if (code === 'ENOENT' && source) {
    console.error(`Required VIDEO.json was not found at ${source}`);
  } else {
    console.error(`Could not copy VIDEO.json from ${source} to ${destination}: ${(error as Error).message}`);
  }
  process.exitCode = 1;
}
