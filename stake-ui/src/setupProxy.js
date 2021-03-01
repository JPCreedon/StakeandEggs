const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function (app) {
  // app.use(
  //   createProxyMiddleware("/api", {
  //     target: "http://localhost:8000",
  //     secure: false
  //   })
  // )
  app.use(
    createProxyMiddleware("/chain", {
      target: "http://localhost:8899",
      secure: false,
      pathRewrite: { "^/chain": "/" }
    })
  )
  // app.use(
  //   createProxyMiddleware("/ws", {
  //     target: "http://localhost:8081",
  //     secure: false,
  //     // pathRewrite: { "^/ws": "/" },
  //     ws: true,
  //     changeOrigin: true,
  //     logLevel: 'debug'
  //   })
  // )
}