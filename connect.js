//
// Simple HTTP CONNECT proxy to WSSHD
//
var
  fs = require('fs'),
  net = require('net'),
  ws = require('ws'),

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
  log("Client connected from", conn.remoteAddress+':'+conn.remotePort)
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

