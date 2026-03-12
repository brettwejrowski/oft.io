FROM node:20-alpine

WORKDIR /app

# Copy workspace root manifest
COPY package.json yarn.lock* ./

# Copy workspace package manifests (needed for yarn workspaces to link them)
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

# Install all workspace dependencies from the root
RUN yarn install

# Copy source files
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

WORKDIR /app/apps/web

EXPOSE 5173
CMD ["yarn", "dev", "--host", "0.0.0.0"]
