const express = require('express')
const next = require('next')
const LRUCache = require('lru-cache')
const { nativeTransfer } = require('./polka')
const { CoinCache, IPState} = require('./cache')
const config = require('../backend.config')

const port = parseInt(process.env.PORT, 10) || 8888
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let coinCache = new CoinCache(4, 3600);

app.prepare()
    .then(() => {
        const server = express()

        server.get('/', async (req, res) => {
            renderAndCache(req, res, '/', { ...req.query })
        })

        server.get('/coin', async (req, res) => {
            let ip = req.ip;
            let address = req.query.address;
            let checkResult = coinCache.check(ip);
            if (checkResult == IPState.Locked) {
                res.send({ message : "Reach maximum count in specified time, Please retry after one hour." })
                return;
            } else {
                coinCache.put(ip);
                let ret = await nativeTransfer(config.key, address, 2000000);
                console.log(ret);
                res.send({ message : ret })
            }
        })

        // let next.js deal with them
        server.get('*', async (req, res) => {
            return handle(req, res)
        })

        server.listen(port, (err) => {
            if (err) throw err
            console.log(`> Ready on http://localhost:${port}`)
        })
    })

const ssrCache = new LRUCache({
        max: 1000, // cache item count
        maxAge: 1000 * 60 * 60, // 1 hour
    })

const getCacheKey = req => `${req.url}`

async function renderAndCache(req, res, pagePath, queryParams) {
    const key = getCacheKey(req)
    if (ssrCache.has(key)) {
        res.setHeader('x-cache', 'HIT')
        res.send(ssrCache.get(key))
        return
    }

    try {
        const html = await app.renderToHTML(req, res, pagePath, queryParams)

        // Something is wrong with the request, let's skip the cache
        if (res.statusCode !== 200) {
            res.send(html)
            return
        }

        // Let's cache this page
        ssrCache.set(key, html)

        res.setHeader('x-cache', 'MISS')
        res.send(html)
    } catch (err) {
        app.renderError(err, req, res, pagePath, queryParams)
    }
}
