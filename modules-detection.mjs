#!/usr/bin/env zx

const { ENV0_PR_SOURCE_BRANCH, ENV0_PR_TARGET_BRANCH, ENV0_TEMPLATE_PATH } = process.env;

const sourceRef = ENV0_PR_SOURCE_BRANCH;
const targetRef = ENV0_PR_TARGET_BRANCH;
const workingDir = ENV0_TEMPLATE_PATH || ''

await detect();

async function detect() {
    if (!sourceRef || !targetRef) {
        console.log(`Skipping - can't detect source or target refs. source [${sourceRef}] target [${targetRef}]`);
        return;
    }

    const { stdout: fileChangesRaw } = await $`git diff --name-only  ${sourceRef}..${targetRef}`;

    const fileChanges = fileChangesRaw.trim().split('\n');
    const filteredFileChanges = fileChanges.filter(file => file.startsWith(workingDir));
    const folderChanges = filteredFileChanges.map(file => path.dirname(file).replace(path.join(workingDir, '/'), ''));

    console.log('Detect next folders changed:', folderChanges);

    await $`echo ENV0_TERRAGRUNT_RUN_ALL_INCLUDE_DIRS=${folderChanges.join(',')} >> $ENV0_ENV`;
}
