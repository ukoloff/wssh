var
  http = require('http')

http.get('http://localhost:4567', Get)

function Get(res)
{
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.pipe(process.stdout)
}
