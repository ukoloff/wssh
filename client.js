var
  ws = require('ws'),
  client = new ws('ws://localhost:4567/ssh')

client.on('open', function()
{
  process.stdin.on('readable', function(){ client.send(this.read()) })
  client.on('message', function(data){ process.stdout.write(data) })
})
