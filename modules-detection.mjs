#!/usr/bin/env zx

await $`ls`
await $`printenv`


if (process.env.ENV0_DEPLOYMENT_TYPE === 'deploy') {
    console.log('I am here');
} else {
    console.log('Not here');
}
