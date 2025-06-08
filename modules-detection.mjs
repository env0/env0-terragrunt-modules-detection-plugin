#!/usr/bin/env zx

const {ENV0_PR_SOURCE_BRANCH, ENV0_PR_TARGET_BRANCH, ENV0_TEMPLATE_PATH} = process.env;

const sourceBranch = ENV0_PR_SOURCE_BRANCH;
const targetBranch = ENV0_PR_TARGET_BRANCH;
const workingDir = ENV0_TEMPLATE_PATH || ''

await detect();

async function detect() {
    if (!sourceBranch || !targetBranch) {
        console.log(`Skipping - can't detect source or target branch. Source [${sourceBranch}] target [${targetBranch}]`);
        return;
    }

    await $`git fetch origin ${targetBranch + ':refs/remotes/origin/' + targetBranch}`;

    await $`git branch -a`;

    const {stdout: fileChangesRaw} = await $`git diff --name-only ${sourceBranch}..${'remotes/origin/' + targetBranch}`;

    const fileChanges = fileChangesRaw.trim().split('\n');
    const filteredFileChanges = fileChanges.filter(file => file.startsWith(workingDir));
    const folderChanges = filteredFileChanges.map(mapFileToModule);
    const uniqFolderChanges = uniq(folderChanges);

    console.log('Detected next modules changed:', uniqFolderChanges);

    await $`echo ENV0_TERRAGRUNT_RUN_ALL_INCLUDE_DIRS=${uniqFolderChanges.join(',')} >> $ENV0_ENV`;
}

function mapFileToModule(file) {
    const fileWithoutWorkingDirPath = workingDir ? file.replace(path.join(workingDir, '/'), '') : file;

    return path.dirname(fileWithoutWorkingDirPath);
}

function uniq(items) {
    return [...new Set(items)];
}
