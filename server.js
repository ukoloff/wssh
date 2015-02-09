var
  fs = require('fs'),
  net = require('net'),
  yaml = require('js-yaml'),
  ws = require('ws').Server,
  websocket = require('websocket-stream'),

  opt = cmdLine()

if(!opt.listen)
  opt.listen = 4567

log('Listening for websocket connections on port '+opt.listen+'...')
pidSave()

new ws({port: opt.listen})
.on('connection', function(ws)
{
  fs.readFile(__dirname+'/hosts.yml', Hosts)

  function Hosts(err, yml)
  {
    if(err)
    {
      Err(err)
      return
    }
    try
    {
      net.connect(22, findHost(ws.upgradeReq.url, yml))
      .on('error', Err)
      .on('connect', Start)
    }
    catch(e)
    {
      Err(e)
    }
  }

  function Err(e)
  {
    ws.send('Oops:'+e)
    ws.close()
  }

  function Start()
  {
    this.pipe(websocket(ws)).pipe(this)
  }
})

function findHost(url, yml)
{
  // Load YAML
  yml = yaml.safeLoad(yml)
  // Clean URL
  url = String(url)
  .split(/[^-.\w]+/)
  .filter(id)
  .filter(goodHost)
  .reverse()[0]
  var host
  if(url in yml)
  {
    host = yml[url]
    if(!host) throw Error('Invalid host')
    return true===host ? url : host
  }
  for(pat in yml)
  {
    var m
    if(!(m=/^\/(.*)\/(i?)$/.exec(pat))) continue
    if(!(new RegExp(m[1], m[2]).test(url))) continue
    m = yml[pat]
    if(!m) throw Error('Invalid host')
    host = true===m ? url : m
  }
  if(!host) throw Error('Invalid host')
  return host
}

function id(x)
{
  return x
}

function goodHost(h)
{
  return !h.match(/^[-_.]|[-_.]$/)
}

function cmdLine()
{
  var z = require('node-getopt').create([
    ['l', 'listen=X', 'Listen to port'],
    ['d', 'daemon', 'Run daemonized'],
    ['h', 'help', 'Show this help'],
    ['v', 'version', 'Show version'],
  ])
  .bindHelp()
  .on('version', showVer)
  .on('daemon', daemonize)
  var opt = z.parseSystem()

  if(!opt.argv.length)
    return opt.options

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
  out = fs.openSync(__dirname+'/log/wsshd.log', 'a'),
  opts = options.listen ? ['--listen='+options.listen] : []
  require('child_process').spawn(
    process.argv[0],
    [__filename].concat(opts),
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
    f = __dirname+'/tmp/pids/wsshd.pid'

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
      ['['+d.toISOString().replace('T', ' ').replace(/[.].*/, '')+d.toTimeString().split(/\s+/)[1].replace(/^\w+/, '')+']']
      .concat([].slice.call(arguments)))
}
