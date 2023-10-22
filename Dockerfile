# # syntax = docker/dockerfile:1

# # Adjust NODE_VERSION as desired
# ARG NODE_VERSION=18.16.0
# FROM node:${NODE_VERSION}-slim as base

# LABEL fly_launch_runtime="NodeJS"

# # NodeJS app lives here
# WORKDIR /

# # Set production environment
# ENV NODE_ENV=production


# # Throw-away build stage to reduce size of final image
# FROM base as build

# # Install packages needed to build node modules
# RUN apt-get update -qq && \
#     apt-get install -y python-is-python3 pkg-config build-essential 

# # Install node modules
# COPY --link package.json package-lock.json .
# RUN npm install --production=false

# # Copy application code
# COPY --link . .

# # Remove development dependencies
# RUN npm prune --production


# # Final stage for app image
# FROM base

# # Copy built application
# COPY --from=build / /

# # Start the server by default, this can be overwritten at runtime
# CMD [ "npm", "run", "start" ]
FROM node

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

CMD [ "npm", "start" ]