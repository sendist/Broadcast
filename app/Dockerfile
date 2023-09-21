FROM node:18
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
RUN cd src/client && npm i
EXPOSE 3000
CMD ["npm", "run", "build-serve"]
