FROM node:20.11.0-slim

WORKDIR /api

COPY . .

RUN npm install

EXPOSE 443

CMD ["node", "app.js"]