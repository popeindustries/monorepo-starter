#################################
# base
################################
FROM node:16.14.2-bullseye-slim as base

# Install pnpm
RUN npm install -g pnpm@7

#################################
# package-cache
################################
FROM base as package-cache

WORKDIR /tmp/pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/some-app/package.json ./apps/some-app/package.json
COPY apps/some-app/pnpm-lock.yaml ./apps/some-app/pnpm-lock.yaml
COPY tools ./tools/
COPY libraries ./libraries/

# set pnpm store-dir and tell pnpm where to store installed dependencies
# update .npmrc with auth token
# install dependencies through pnpm
# remove npm auth token from .npmrc
RUN --mount=type=secret,id=NPM_TOKEN \
  NPM_TOKEN=$(cat /run/secrets/NPM_TOKEN) && \
  echo "cache-dir=/tmp/pnpm/.pnpm-cache" >> .npmrc && \
  echo "store-dir=/tmp/pnpm/.pnpm-store" >> .npmrc && \
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> .npmrc && \
  CI=1 pnpm --frozen-lockfile --loglevel=error install && \
  sed -i '$d' .npmrc

#################################
# copy sources
################################
# This step needs to run with --build-arg BUILDKIT_INLINE_CACHE=1
# @see https://docs.docker.com/engine/reference/commandline/build/#specifying-external-cache-sources
FROM package-cache as copy-sources

# This layer will have a high probability of being re-recreated when runnning
# docker build since it will include our source code that will most probably
# include code changes from our PR's.
WORKDIR /app

# copy required files from host machine
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY tools ./tools/
COPY libraries ./libraries/
COPY apps/some-app/ ./apps/some-app/

# install dependencies from /tpm/pnpm
RUN \
  echo "cache-dir=/tmp/pnpm/.pnpm-cache" >> .npmrc && \
  echo "store-dir=/tmp/pnpm/.pnpm-store" >> .npmrc && \
  CI=1 pnpm --frozen-lockfile --offline --loglevel=error install

#################################
# test
################################
FROM copy-sources as test

# run unit tests
RUN pnpm --filter some-app run test

#################################
# build
################################
FROM test as build

# build the app
RUN NODE_ENV=production pnpm --filter some-app run build

#################################
# prune dev dependencies
################################
FROM build as prod-deps

WORKDIR /app

# install prod-only dependencies in flat node_modules
RUN pnpm --frozen-lockfile --offline \
  --prod --shamefully-hoist --loglevel=error \
  --filter @nrk/tizen-smart-tv install

#################################
# prod image
################################
FROM base as prod

WORKDIR /app/apps/some-app
COPY --from=prod-deps /app/apps/some-app/node_modules/ ./node_modules
COPY --from=prod-deps /app/apps/some-app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=8080

# Start application
EXPOSE 8080
CMD ["node", "index.js"]
