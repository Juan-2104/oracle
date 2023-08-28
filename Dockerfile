FROM node:18-bookworm-slim
WORKDIR /usr/bei
COPY package.json .
RUN npm install --quite
COPY . .
CMD ["npm", "start"]