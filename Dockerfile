###############################################################################
###############################################################################
##                      _______ _____ ______ _____                           ##
##                     |__   __/ ____|  ____|  __ \                          ##
##                        | | | (___ | |__  | |  | |                         ##
##                        | |  \___ \|  __| | |  | |                         ##
##                        | |  ____) | |____| |__| |                         ##
##                        |_| |_____/|______|_____/                          ##
##                                                                           ##
## description     : Dockerfile for TsED Application                         ##
## author          : Kynt                                                    ##
## date            : 2021-12-14                                              ##
## version         : 0.0                                                     ##
##                                                                           ##
###############################################################################
###############################################################################
# Building application
FROM node:14.17-stretch-slim AS build
# Create app directory
WORKDIR /build
# Install app dependencies
COPY package*.json ./
RUN yarn install 
# Bundle app source
COPY . .
RUN yarn build

# Publish application to production
FROM node:14.17-stretch-slim AS publish
# Expose port
EXPOSE 80
# Environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
# Create app directory
WORKDIR /node
# Copy package.json
COPY package*.json ./
# Copy publish
COPY --from=build /build/dist ./dist
COPY --from=build /build/node_modules ./node_modules
# Run service
CMD ["node", "dist/index"]