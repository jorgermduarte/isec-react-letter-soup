#node official alpine image
FROM node:16

# set working directory
WORKDIR app

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE ${PORT}
