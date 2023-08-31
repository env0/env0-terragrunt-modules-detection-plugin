#!/usr/bin/env zx

const { ENV0_PR_SOURCE_BRANCH, ENV0_PR_TARGET_BRANCH} = process.env;

const sourceRef = ENV0_PR_SOURCE_BRANCH;
const targetRef = ENV0_PR_TARGET_BRANCH;

await detect();

async function detect() {
    if (!sourceRef || !targetRef) {
        console.log(`skipping - can't detect source or target refs. source [${sourceRef}] target [${targetRef}]`);
        return;
    }

    const { stdout: fileChangesRaw } = await $`git diff --name-only  ${sourceRef}..${targetRef}`;

    console.log(fileChangesRaw.trim().split('\n'));
}
