FROM node:latest


ENV NODE_ENV=production

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm init --yes
RUN npm install --production

RUN npm install web-push --save
RUN npm install 

CMD [ "node", "./assets/js/main.js" ]
EXPOSE 8080
#doc
# EXPOSE 8080

#CMD ["nginx", "-g", "daemon off;"]
