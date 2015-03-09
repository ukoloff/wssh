//
// Simple stunnel for Websockets
//
net = require('net')
ssl = require('tls')

if(3!=process.argv.length) help()

var Host = process.argv[2]

net.createServer(Req)
.listen(3123, On)

var
  Count=0,
  _log=log

function help()
{
  path = require('path')
  log('Usage:', path.basename(__filename), 'host')
  process.exit()
}

function On()
{
  log("Listening", this.address())
}

function Req(conn)
{
  var
    No=++Count, hs=[], prolog, body, tls

  function log()
  {
    _log.apply(this, ['<'+No+'>'].concat([].slice.call(arguments)))
  }

  log("Client connected from", conn.remoteAddress+':'+conn.remotePort)

  conn
  .on('readable', cRead)
  .on('end', cClose)
  .on('error', cError)

  function cRead()
  {
    var x
    while(null!=(x=this.read()))
      body ? queue(x) : headers(x)
  }

  function cClose()
  {
    log('Client disconnected')
    bye()
  }

  function cError(e)
  {
    log('Client error', e)
    bye()
  }

  function bye()
  {
    conn.end()
    if(tls) tls.end()
  }

  function queue(data)
  {
    if(Array.isArray(body))
      body.push(data)
    else
      send(data)
  }

  function headers(data)
  {
    prolog = prolog ? Buffer.concat([prolog, data]) : data
    while(splitHdrs()){}
  }

  function splitHdrs()
  {
    for(var cr, L=prolog.length, i=0; i<L; i++)
      if(10==prolog[i])
      {
        L = prolog
        prolog = prolog.slice(i+1)
        header(L.slice(0, i-(cr ? 1 : 0)).toString())
        return true
      }
      else
        cr = 13==prolog[i]
  }

  function header(line)
  {
    if(!line.length)
      tlsConnect()
    else
      hs.push(line)
  }

  function tlsConnect()
  {
    body=[prolog]
    prolog=new Buffer(0)
    patchHeaders()
    tls = ssl.connect({
      servername: Host,
      host: Host,
      port: 443
    })
    tls
      .on('secureConnect', tConnect)
      .on('readable', tData)
      .on('end', tEnd)
      .on('error', tError)
  }

  function patchHeaders()
  {
    if(!hs.length) return
    var verb = hs.shift()
    hs=['Host', 'Origin']
      .map(hostHeader)
      .concat(hs.filter(filterHeader))
    hs.unshift(verb)
  }

  function send(data)
  {
    if(data.length)
      tls.write(data)
  }

  function tConnect()
  {
    log('TLS connected', 'Auth='+this.authorized,'CN='+this.getPeerCertificate().subject.CN)
    send(hs.join('\r\n')+'\r\n\r\n')
    body.forEach(send)
    body = true
  }

  function tData()
  {
    var x
    while(null!=(x=this.read()))
      if(x.length) conn.write(x)
  }

  function tError(err)
  {
    log('TLS error', err)
    bye()
  }

  function tEnd()
  {
    log('TLS closed')
    bye()
  }
}

function hostHeader(s)
{
  return s+': '+Host
}

function filterHeader(s)
{
  return !/^(?:host|origin):/i.test(s)
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
