FROM node:20.12.0

WORKDIR /app

#npm install 을 위해, package.json과 package-lock.json을 먼저 copy해둠
COPY package.json yarn.lock ./

RUN yarn

COPY . /app

EXPOSE 2000

CMD ["node", "deploy-command.js", "&&", "yarn", "start"]
