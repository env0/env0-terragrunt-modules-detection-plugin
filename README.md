# env0 terragrunt modules detection
This env0 plugin will allow you to trigger only terragrunt modules that were changed in the current Pull Request.

**Currently, the plugin only support [Pr Plan](https://docs.env0.com/docs/plan-on-pull-request) and it will detect all modules change for specific PR.**

## Inputs
The plugin doesn't require any inputs.

## Example Usage

```yaml
version: 2
deploy:
  steps:
    terraformPlan:
      before:
        - name: Terragrunt Modules Detection
          use: https://github.com/env0/env0-terragrunt-modules-detection-plugin

```
