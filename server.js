require('http')
.createServer(Server)
.listen(4567)

function Server(req, res)
{
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}
