var
  websocket = require('websocket-stream'),
  ws = websocket('ws://localhost/ssh')

process.stdin
.pipe(ws)
.pipe(process.stdout)
