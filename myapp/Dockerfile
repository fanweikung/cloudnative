# Need python for node_module appmetrics/node-gyp
# FROM registry.access.redhat.com/ubi8/nodejs-14:latest
FROM node:14

# WORKDIR "/app"
WORKDIR "/opt/app-root/src"

# Copy package.json and package-lock.json
# COPY package*.json ./

# Bundle app source and install dependencies
# COPY . /app

# COPY . /opt/app-root/src
COPY . .

# Install npm production packages 
RUN npm install --production

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["npm", "start"]