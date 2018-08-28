FROM node:6.11.1

ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -p /srv/app
WORKDIR /srv/app

# Fix for "EXDEV: cross-device link not permitted", see https://github.com/npm/npm/issues/9863
RUN cd $(npm root -g)/npm && \
    npm install fs-extra && \
    sed -i -e s/graceful-fs/fs-extra/ -e s/fs\.rename/fs.move/ ./lib/utils/rename.js

ADD package.json /srv/app/
RUN npm install --production

ADD . /srv/app

RUN npm install && \
    npm run compile && \
    npm prune --production

ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80

CMD ["npm", "start"]

ARG version
RUN mkdir -p /srv/app/dist/public/version && \
    echo $version > /srv/app/dist/public/version/index.html
