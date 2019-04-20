# Use minimal base image
FROM node:lts-alpine

RUN yarn global add pm2

# Add actual app
ADD . /
RUN yarn install
RUN yarn build

WORKDIR /

CMD [ "pm2-docker", "bin/www" ]

EXPOSE 3000
