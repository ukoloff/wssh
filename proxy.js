if(process.argv.length!=3)
{
  var
    path = require('path')

  console.info('Websocket netcat.')
  console.info(
    'Usage:',
    path.basename(process.argv[0]),
    path.basename(__filename),
    'ws[s]://host[:port]/uri'
  )
  process.exit(1)
}

var
  ws = require('ws'),
  net = require('net')

net.createServer(Req)
.listen(8022, On)

function On()
{
  log('Proxy started')
}

function Req(conn)
{
  var
    buf = [],
    chain = new ws(process.argv[2])

  log('Client connected')

  chain
  .on('open', wsOpen)
  .on('message', wsMsg)
  .on('close', wsClose)
  .on('error', wsError)

  conn
  .on('readable', cRead)
  .on('end', cClose)
  .on('error', cError)

  function wsOpen()
  {
    log('Websocket connected')
    buf.forEach(function(data){chain.send(data)})
    buf = null
  }

  function wsMsg(data)
  {
    log('Websocket send', data)
    conn.write(data)
  }

  function wsClose()
  {
    log('Websocket closed')
    conn.end()
  }

  function wsError(e)
  {
    log('Websocket error', e)
    chain.close()
    conn.end()
  }

  function cRead()
  {
    var x
    while(null!=(x=this.read()))
    {
      log('Client sent', x)
      if(buf)
        buf.push(x)
      else
        chain.send(x)
    }
  }

  function cClose()
  {
    log('Client disconnected')
    conn.end()
  }

  function cError(e)
  {
    log('Client error', e)
    conn.end()
    chain.close()
  }

}

function log()
{
  var
    d = new Date()
    console.info.apply(
      console,
      ['['+d.toISOString().replace('T', ' ').replace(/Z$/, '')
          +d.toTimeString().split(/\s+/)[1].replace(/^\w+/, ' ')+']']
      .concat([].slice.call(arguments)))
}
