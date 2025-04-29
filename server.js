const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname } = parsedUrl

    // Set proper MIME types for JavaScript files
    if (pathname.endsWith(".js") || pathname.endsWith(".mjs")) {
      res.setHeader("Content-Type", "application/javascript; charset=utf-8")
    } else if (pathname.endsWith(".ts") || pathname.endsWith(".tsx")) {
      res.setHeader("Content-Type", "application/javascript; charset=utf-8")
    }

    // Set X-Content-Type-Options header to prevent MIME type sniffing
    res.setHeader("X-Content-Type-Options", "nosniff")

    handle(req, res, parsedUrl)
  }).listen(3000, (err) => {
    if (err) throw err
    console.log("> Ready on http://localhost:3000")
  })
})
