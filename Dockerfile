FROM mhart/alpine-node
LABEL maintainer="laddernetwork"
LABEL description="This is a docker for ladder node"

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

EXPOSE 8888