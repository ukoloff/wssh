require('http')
.get('http://localhost:4567', Client)

function Client(res)
{
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.pipe(process.stdout)
}
