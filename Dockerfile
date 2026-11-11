FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=frontend-builder /app/dist ./dist
COPY server ./server

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server/index.mjs"]
