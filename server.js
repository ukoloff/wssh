require('http')
.createServer(Server)
.listen(4567)

function Server(req, res)
{
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('X-Ticket', 12345)
  res.writeHead(200)
  setTimeout(function()
  {
    res.end('Hello World\n')
  }, 1000)
}
