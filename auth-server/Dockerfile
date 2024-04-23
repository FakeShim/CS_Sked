FROM node:20.11.0-slim

WORKDIR /auth-server

COPY . .

COPY ./my.conf /etc/ssmtp/ssmtp.conf

RUN apt-get update
RUN apt-get install -y ssmtp

RUN npm install

EXPOSE 3080

CMD ["node", "app.js"]