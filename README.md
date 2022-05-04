# Monoreop starter kit

This is a bare-bones project outlining all the requirements and suggestions for setting up a monorepo with [`pnpm`](https://pnpm.io/) and (optionally) [`changesets`](https://github.com/changesets/changesets).

## Installation

Install `pnpm` globally:

```bash
$ # Install with Homebrew
$ brew install pnpm
$ # Alternatively, install with npm
$ npm install --global pnpm
```

## Project setup

As always, begin by adding a `package.json` to your project root (run `pnpm init` if you'd like to do this interactively).

Unlike `npm`, defining a [`package.json#engines`](package.json#L9) field will let you enforce supported runtime versions:

```json
{
  "engines": {
    "node": ">=16",
    "pnpm": ">=7"
  }
}
```

Combined with a [`preinstall`](package.json#L19) script, and adding npm/yarn lock files to [`.gitignore`](.gitignore#L4), you can enforce `pnpm` use over other alternatives:

```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

## Configuration

As with `npm`, general configuration is read from an [`.npmrc`](.npmrc) file. For multi-package configuration specifically, configuration is read from a [`pnpm-workspace.yaml`](pnpm-workspace.yaml) file:

```yaml
packages:
  - 'apps/**'
  - 'libraries/**'
  - 'tools/**'
  # Exclude packages in test directories
  - '!**/test/**'
```

## Workspaces

Support for working with multiple packages is made easier by using the `workspace:` protocol to explicitly link dependencies from the same repo:

```json
{
  "dependencies": {
    "some-lib": "workspace:*"
  },
  "devDependencies": {
    "some-config": "workspace:^"
  }
}
```

## Running

- Execute a package.json script by name (passing in additional arguments): `pnpm dev --ssl ~/certificates/some-app`
- Execute package.json scripts in all workspace packages: `pnpm test --recursive`
- Execute an installed dependency binary: `pnpm tsc`

### Filtering

When using workspaces, all command execution can be filtered to operate on one or more packages:

- By package name: `pnpm --filter some-app test`
- With dependency packages: `pnpm --filter some-app... test`
- With dependant packages: `pnpm --filter ...some-lib test`
- By location: `pnpm --filter libraries/* build`

## Publishing

Although pnpm supports multi-package repos, coordinating the release of multiple interlinked packages is not supported directly. Instead, we can use [`changesets`](https://github.com/changesets/changesets) to correctly handle publishing packages to the npm registry.

### Installation

Install the `changeset` cli as a dev dependency in the monorepo root, and initialise:

```bash
$ pnpm add --save-dev @changesets/cli && pnpm changeset init
```

### Workflow

1. Create PR branch with code changes
2. Run `pnpm changeset` to generate a changeset description file
3. Check changeset file into PR branch
4. (optional) Repeat
5. Merge PR to main and watch [GitHub action](.github/workflows/libraries.yml) create new release PR
6. (optional) Repeat with more PR's
7. Merge release PR to main and watch GitHub action publish packages to npm registry

## Deploying

Leverage [Docker](apps/some-app/Dockerfile) multi-stage builds and pnpm's central store to speed up builds.
