FROM node:6.1-slim

ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -p /srv/app
WORKDIR /srv/app

ADD package.json /srv/app/
RUN npm install --production

ADD . /srv/app

RUN npm install && \
    npm run compile && \
    npm prune --production

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]

ARG version
RUN mkdir -p /srv/app/dist/public/version && \
    echo $version > /srv/app/dist/public/version/index.html
