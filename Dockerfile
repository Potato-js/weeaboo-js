FROM node:latest

# Create the bot's directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install

COPY .env /usr/src/bot/.env

COPY . /usr/src/bot

RUN npm install dotenv

# Start the bot.
CMD ["node", "src/index.js"]