FROM node:latest


ENV NODE_ENV=production

RUN npm install --production

RUN npm install web-push --save
EXPOSE 8080

CMD [ "node", "/assets/js/main.js" ]

#doc
# EXPOSE 8080

#CMD ["nginx", "-g", "daemon off;"]
