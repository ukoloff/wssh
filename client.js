var
  http = require('http'),
  url = require('url'),
  URL = 'http://localhost:4567',
  post

http.get(URL, Get)

function Get(res)
{
  console.log('STATUS: ' + res.statusCode)
  console.log('HEADERS: ' + JSON.stringify(res.headers))
  res.once('readable', function()
  {
    var z = url.parse(URL)
    z.method = 'POST'
    post = http.request(z, Post)
    post.write(this.read())
    this.on('readable', function()
    {
      console.log('GET', this.read().toString())
    })
  })
}

function Post(res)
{
  console.log('POST')
  post.write('Line 1\n')
}
