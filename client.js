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
    post.write('Line 1\nLine 2\nLine 3\n')
    this.pipe(process.stdout)
  })
}
