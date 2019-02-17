FROM node:11.3-slim

WORKDIR /app

ENV EXPRESS_PORT 3000
EXPOSE 3000

COPY package.json package.json
RUN npm install

COPY . .
RUN npm run build

CMD ["node", "dist/"]

USER node