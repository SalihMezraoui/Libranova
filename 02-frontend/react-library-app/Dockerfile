FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

ENV BROWSER=none

EXPOSE 3000

CMD ["npm", "start"]
