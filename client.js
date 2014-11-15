var
  http = require('http'),
  url = require('url'),
  URL = 'http://localhost:4567'


http.get(URL, Get)

function Get(res)
{
  console.log('STATUS: ' + res.statusCode)
  console.log('HEADERS: ' + JSON.stringify(res.headers))
  res.once('readable', function()
  {
    var z = url.parse(URL)
    z.method = 'POST'
    var q = http.request(z, Post)
    q.write(this.read())
  })
  // res.pipe(process.stdout)
}

function Post(res)
{
  console.log('POST')
}
