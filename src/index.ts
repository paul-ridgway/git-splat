import simpleGit, { SimpleGit } from 'simple-git';
const git: SimpleGit = simpleGit();

async function run() {
  console.log(await git.log());
}

run();