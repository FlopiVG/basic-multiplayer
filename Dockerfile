FROM node:latest

RUN mkdir /usr/src/app
COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm i --silent

EXPOSE 8080 
CMD ["npm", "start"]
