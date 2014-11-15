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
  ('POST'==req.method? Post : Get)(req, res)
}

function Get(req, res)
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

function Post(req, res)
{
  console.log('POST')
  req.once('readable', function()
  {
    var s, x = this.read().toString().replace(/^\s+|\s+$/g, '')
    if(s=sessions[x])
    {
      delete sessions[x]
      clearTimeout(s.t)
      s.r.write('Hi there!\n')
      res.writeHead(200)
      res.write('POST data...')
    }
    else
      res.writeHead(404)
  })
}
