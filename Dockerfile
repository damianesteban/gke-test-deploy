FROM mhart/alpine-node:14 as builder
ENV NODE_ENV="production"

# Copy app's source code to the /app directory
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yaml ./
COPY . /app

# The application's directory will be the working directory

RUN yarn set version berry
# Install Node.js dependencies defined in '/app/package.json'
RUN yarn --pure-lockfile --non-interactive

FROM mhart/alpine-node:14
ENV NODE_ENV="production"
COPY --from=builder /app /app
WORKDIR /app
ENV PORT 5000
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
