FROM FROM node:latest


ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .
RUN npm install web-push --save
EXPOSE 8080

CMD [ "node", "index.js" ]

#doc
# EXPOSE 8080

#CMD ["nginx", "-g", "daemon off;"]
