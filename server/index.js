const express = require('express')
const next = require('next')
const LRUCache = require('lru-cache')
const { nativeTransfer } = require('./polka')
const config = require('../config')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
    .then(() => {
        const server = express()

        server.get('/', async (req, res) => {
            console.log('cache')
            renderAndCache(req, res, '/', { ...req.query })
        })

        server.get('/coin', async (req, res) => {
            console.log();
            const key = '0x311f2d29d68cc7ae6101c3d989f89bb0698c280ddf5ce3a0321f914bda553257';
            let ret = nativeTransfer(key, req.query.address, 2000000);
            // can use `req` to control ip access
            res.send({ ok: 'succeed' })
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
