FROM node:latest


ENV NODE_ENV=production

WORKDIR /usr/app
COPY . .
RUN npm install --production
RUN npm install express
RUN npm install web-push
RUN npm install pg
RUN npm install dotenv
EXPOSE 8080
CMD [ "node", "./assets/js/main.js" ]

#doc
# EXPOSE 8080

#CMD ["nginx", "-g", "daemon off;"]
