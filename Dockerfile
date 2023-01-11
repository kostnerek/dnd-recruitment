FROM node:16
USER node
RUN mkdir /home/node/code


COPY ./package.json /home/node/code/
WORKDIR /home/node/code
COPY --chown=node:node ./package*.json /home/node/code/
RUN npm install
COPY --chown=node:node . .
RUN npm install @types/bcrypt
RUN npm rebuild bcrypt --build-from-source

CMD ["npm", "start", "--allow-root", "--unsafe-perm=true"]