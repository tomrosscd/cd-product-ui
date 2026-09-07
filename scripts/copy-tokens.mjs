import { copyFile } from 'node:fs/promises'
await copyFile('src/styles/tokens.css', 'dist/tokens.css')
