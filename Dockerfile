FROM mhart/alpine-node:14 as builder
ENV NODE_ENV="production"

# Copy app's source code to the /app directory
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npx pnpm add -g pnpm
RUN pnpm install

COPY . /app

FROM mhart/alpine-node:14
ENV NODE_ENV="production"
COPY --from=builder /app /app
WORKDIR /app
ENV PORT 5000
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
