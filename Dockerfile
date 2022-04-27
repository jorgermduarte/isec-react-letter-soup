#node official alpine image
FROM node:16.4.2:alpine

# set working directory
WORKDIR /app

COPY package.json ./app
COPY ./src ./app

# run npm install in our local machine
RUN npm install --silent