require('http')
.createServer(Server)
.listen(4567)

var
  sessions={}

noCache = {
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache'
}

function Server(req, res)
{
  var i, r
  for(i = 10; i>0; i--)
    if((r = /\d{3,}/.exec(Math.random())) && !sessions[r = r[0]])
    {
      sessions[r] =
      {
        r: res,
        t: setTimeout(function()
        {
          delete sessions[r]
          res.end()
        }, 5000)
      }
      res.writeHead(200, noCache)
      res.write(r+'\n')
      return
    }
  res.writeHead(500)
  res.end('Cannot create session!')
}
