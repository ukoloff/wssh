var
  s = require('split')

module.exports = function()
{
  return s(Line)
}

function Line(s)
{
  return s.split('').reverse().join('')+'\n'
}
