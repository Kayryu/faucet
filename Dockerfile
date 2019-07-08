FROM mhart/alpine-node
LABEL maintainer="laddernetwork"
LABEL description="This is a docker for ladder node"

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

RUN [ "sh", "-c", "yarn run go" ]

EXPOSE 8888