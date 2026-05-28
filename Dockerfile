FROM node:20-alpine

WORKDIR /app

RUN npm install -g @expo/eas-cli expo-cli

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8081 19000 19001 19002

CMD ["npx", "expo", "start", "--tunnel"]
