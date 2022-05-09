#node official alpine image
FROM node:16

# set working directory
WORKDIR app

COPY package*.json ./
COPY . .

# run npm install in our local machine
RUN npm install --silent

EXPOSE ${PORT}
