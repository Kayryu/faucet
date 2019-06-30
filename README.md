
## Develop

run with express mode.
``
yarn

yarn run go
``

## Usage

run with docker.
```
docker pull kazee/ladder-faucet.

docker run -itd -p 9955:9955 -name ladder-faucet kazee/ladder-faucet

docker exec -it ladder-faucet /bin/sh
```

## Config

1. open `frontend.config.js` file, set your server location.
2. open `backend.config.js` file, set your node url and key.