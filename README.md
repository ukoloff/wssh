# wssh

Try to proxy SSH connection through Websocket (to use with nginx).

First attemp was using pair of requests (GET+POST), but nginx appeared to always buffering
user request (server response can be send back unbuffered). So it is impractical :-(

So, next step was to use Websocket proxying, which is
[available](http://nginx.org/en/docs/http/websocket.html)
in nginx since v1.3.13.

## See also

  * [wssh.py](https://github.com/progrium/wssh)

## Credits

  * [Node.js](http://nodejs.org/)
  * [ws](https://github.com/websockets/ws)
