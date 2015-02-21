//
// Simple HTTP CONNECT proxy to WSSHD
//
var
  fs = require('fs'),
  net = require('net'),
  webSocket = require('ws'),

  opt = cmdLine()

if(!opt.listen)
  opt.listen = 3122

log('Running on port', opt.listen, 'sending to', opt.uri)

pidSave()

net.createServer(Req)
.listen(opt.listen, On)

function On()
{
  log('HTTP proxy started')
}

function Req(conn)
{
  var
    nhdr = 0, hdrs, body, host, ws

  log("Client connected from", conn.remoteAddress+':'+conn.remotePort)

  conn
  .on('readable', cRead)
  .on('end', cClose)
  .on('error', cError)

  function cRead()
  {
    var x
    while(null!=(x=this.read()))
      body ? wssh(x) : headers(x)
  }

  function cClose()
  {
    log('Client disconnected')
    closeWs()
  }

  function cError(e)
  {
    log('Client error', e)
    closeWs()
  }

  function closeWs()
  {
    if(ws)
      ws.close()
  }

  function wssh(data)
  {
    if(data.length)
      ws.send(data)
  }

  function headers(data)
  {
    hdrs = hdrs ? Buffer.concat([hdrs, data]) : data
    while(splitHdrs()){}
  }

  function splitHdrs()
  {
    for(var cr, L=hdrs.length, i=0; i<L; i++)
      if(10==hdrs[i])
      {
        L = hdrs
        hdrs = hdrs.slice(i+1)
        header(L.slice(0, i-(cr ? 1 : 0)).toString())
        return true
      }
      else
        cr = 13==hdrs[i]
  }

  function header(s)
  {
    if(!nhdr++)
      connect(s)
    else if(!s)
      wssh_connect()
  }

  function connect(s)
  {
    var m=/^connect\s+([-.\w]+):22(?:\s|$)/i.exec(s)
    if(m)
      return host=m[1]
    conn.end("HTTP/1.0 500 Bad request\r\n\r\n")
  }

  function wssh_connect()
  {
    var uri = opt.uri+'/'+host
    log("Redirect to", uri)
    body = hdrs
    hdrs = new Buffer(0)
    conn.write("HTTP/1.0 200 Ok\r\n\r\n")
    ws = new webSocket(uri)
    ws
    .on('open', wsOpen)
    .on('message', wsMsg)
    .on('close', wsClose)
    .on('error', wsError)
  }

  function wsOpen()
  {
    log("Connected to WSSHD")
    wssh(body)
    body = true
  }

  function wsMsg(data)
  {
    conn.write(data)
  }

  function wsClose()
  {
    log("Websocket closed")
    conn.end()
  }

  function wsError(e)
  {
    log("Websocket error", e)
    conn.end()
    ws.close()
  }
}

function cmdLine()
{
  var z = require('node-getopt').create([
    ['l', 'listen=port', 'Listen to port'],
    ['d', 'daemon', 'Run daemonized'],
    ['h', 'help', 'Show this help'],
    ['v', 'version', 'Show version'],
  ])
  .bindHelp()
  .on('version', showVer)
  .on('daemon', daemonize)
  var opt = z.parseSystem()

  if(1==opt.argv.length)
  {
    opt.options.uri = opt.argv[0]
    return opt.options
  }

  z.showHelp()
  process.exit()
}

function showVer()
{
  console.log(require('./package').version)
  process.exit()
}

function daemonize(argv, options)
{
  log('Going on in background...')
  out = fs.openSync(__dirname+'/log/connect.log', 'a'),
  opts = options.listen ? ['--listen', options.listen] : []
  require('child_process').spawn(
    process.argv[0],
    [__filename].concat(opts).concat(argv),
    {
      detached: true,
      stdio: ['ignore', out, out]
    }
  )
  .unref()
  process.exit()
}

function pidSave()
{
  var
    f = __dirname+'/tmp/pids/connect.pid'

  fs.writeFile(f, process.pid)

  process
  .on('exit', clear)
  .on('SIGINT', ctrlC)

  function clear()
  {
    log('Exiting')
    fs.unlinkSync(f)
  }

  function ctrlC()
  {
    process.exit()
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

