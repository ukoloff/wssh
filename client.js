var
  websocket = require('websocket-stream'),
  ws = websocket('ws://localhost:4567/ssh')

process.stdin
.pipe(ws)
.pipe(process.stdout)
