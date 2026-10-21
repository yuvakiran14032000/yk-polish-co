import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const sites=process.env.YK_BUILD_TARGET==='sites';
const cli=sites?'./run-framework.mjs':'../node_modules/next/dist/bin/next';
const result=spawnSync(process.execPath,[fileURLToPath(new URL(cli,import.meta.url)),'build'],{stdio:'inherit',env:process.env});
if(result.error)throw result.error;
process.exit(result.status??1);
