#!/usr/bin/env node

import simpleGit, { SimpleGit } from 'simple-git';
import { inspect } from 'util';
import { exec } from 'child_process';
const git: SimpleGit = simpleGit();

function camelize(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index): string => {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

async function run(): Promise<void> {
  console.log("Git Splat in", process.cwd());
  const log = await git.log();
  console.log(`Exporting ${log.total} commits...`);
  log.all.forEach((l, i): void => {
    const n = log.total - i;
    console.log(`Processing commit (${i + 1} / ${log.total}):`, l.message);
    const name = camelize(l.message.replace(/[^a-z0-9]/gmi, " ").replace(/\s+/g, " ").toLowerCase());
    const cmd = `git archive --format=zip --output=${n}-${name}.zip ${l.hash}`;
    exec(cmd, (error, stdout, stderr): void => {
      if (error) {
        console.error(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.warn(`stderr: ${stderr}`);
        return;
      }
    });
  });
}

run().catch((e): void => console.error(`Error: ${inspect(e)}`));