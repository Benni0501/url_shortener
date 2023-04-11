FROM node:alpine
WORKDIR /svr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8060
CMD ["node", "dist/index.js"]