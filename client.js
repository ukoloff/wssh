var
  http = require('http'),
  url = require('url'),
  URL = 'http://localhost:4567',
  post

http.get(URL, Get)

function Get(res)
{
  res.once('readable', function()
  {
    var z = url.parse(URL)
    z.method = 'POST'
    post = http.request(z)
    post.write(this.read())
    this.pipe(process.stdout)
    process.stdin.pipe(post)
  })
}