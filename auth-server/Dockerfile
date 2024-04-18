FROM node:20.11.0-slim

WORKDIR /auth-server

COPY . .

RUN npm install

EXPOSE 3080

CMD ["node", "app.js"]