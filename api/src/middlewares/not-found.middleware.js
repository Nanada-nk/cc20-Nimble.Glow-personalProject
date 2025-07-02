const notFoundMiddleware = (req, res) => {
  res.status(404).json({ message: `request: not found ${req.method} ${req.url} on this server` })
}
export default notFoundMiddleware