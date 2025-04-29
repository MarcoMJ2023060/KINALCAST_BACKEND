FROM node:20

WORKDIR /Backend

COPY package.json package-lock.json ./

RUN npm install

COPY . . 

EXPOSE 3001

CMD [ "npm", "start" ]

