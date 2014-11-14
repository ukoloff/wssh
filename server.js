require('http')
.createServer(Server)
.listen(4567)

function Server(req, res)
{
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('X-Ticket', 12345)
  res.writeHead(200)

  // Write the headers to the socker
  res.socket.write(res._header);
  // Mark the headers as sent
  res._headerSent = true;

  setTimeout(function()
  {
    res.end('Hello World\n')
  }, 3000)
}
