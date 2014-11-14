var
  s = require('split')
  z = s(Line)

process.stdin
.pipe(z)
.pipe(process.stdout)

z.queue('Hi there!\n')

function Line(s)
{
  return s.split('').reverse().join('')+'\n'
}
