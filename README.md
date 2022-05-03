# Monoreop starter kit

This is a bare-bones project outlining all the requirements and suggestions for setting up a monorepo with [pnpm](https://pnpm.io/) and (optionally) [changesets](https://github.com/changesets/changesets).

## Installation

Install `pnpm` globally:

```bash
$ # Install pnpm with Homebrew
$ brew install pnpm
$ # Install pnpm with npm
$ npm install --global pnpm
```

## Project setup

As always, begin by adding a `package.json` to your project root (run `pnpm init` if you'd like to do this interactively).

Unlike `npm`, defining a `package.json#engines` field will let you enforce supported runtime versions:

```json
{
  "engines": {
    "node": ">=16",
    "pnpm": ">=7"
  }
}
```

Combined with a `preinstall` script, and adding npm/yarn lock files to `.gitignore`, you can enforce `pnpm` use over other alternatives:

```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

## Configuration
