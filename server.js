require('http')
.createServer(Server)
.listen(4567)

noCache = {
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache'
}

function Server(req, res)
{
  res.setHeader('Content-Type', 'text/plain')
  res.writeHead(200, noCache)

  // Write the headers to the socker
  res._writeRaw(res._header);
  // Mark the headers as sent
  res._headerSent = true;

  setTimeout(function()
  {
    res.end('Hello World\n')
  }, 3000)
}
