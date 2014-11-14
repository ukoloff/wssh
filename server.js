require('http')
.createServer(Server)
.listen(4567)

function Server(req, res)
{
  res.setHeader('Content-Type', 'text/plain')
  res.writeHead(200)
  res.end('Hello World\n')
}
