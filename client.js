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
    this.on('readable', function()
    {
      console.log('GET', this.read())
    })
  })
}

function Post(res)
{
  console.log('POST')
}
