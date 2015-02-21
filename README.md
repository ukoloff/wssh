# wssh

Try to proxy SSH connection through Websocket (to use with nginx).

First attemp was using pair of requests (GET+POST), but nginx appeared to always buffering
user request (server response can be send back unbuffered). So it is impractical :-(

So, next step was to use Websocket proxying, which is
[available](http://nginx.org/en/docs/http/websocket.html)
in nginx since v1.3.13.

## Data flow

Normal SSH session is very simple:

  * SSH Client
  * TCP Connection
  * SSH Server, listening on TCP port 22

WSSH session is:

  * SSH Client with -o ProxyCommand='node client.js WSSH-URI'
  * client.js listening to its stdin
  * Websocket (HTTP/HTTPS) connection to nginx
  * nginx [configured](nginx/ssh) to redirect connection to WSSH server
  * Another Websocket connection from nginx to WSSH server
  * WSSH server, listening to dedicated TCP port (4567 by default)
  * Normal TCP connection
  * Normal SSH Server, listening on TCP port 22

And nginx stage can be omited in development/testing scenarios.

In some scenarios this path can be even longer:

  * SSH Client, capable to connect via HTTP proxy (eg PuTTY/PLink)
  * TCP connection to local proxy
  * connect.js listening to dedicated port (3122 by default)
  * Websocket (HTTP/HTTPS) connection to nginx
  * nginx [configured](nginx/ssh) to redirect connection to WSSH server
  * Another Websocket connection from nginx to WSSH server
  * WSSH server, listening to dedicated TCP port (4567 by default)
  * Normal TCP connection
  * Normal SSH Server, listening on TCP port 22

## Windows bugs

Node.js has some strange bug when working with MS Windows STDIN.
Therefore client.js cannot be used as local proxy command for PuTTY/PLink.

So, on MS Windows, one should use connect.js and PuTTY/PLink via HTTP proxy
(localhost:3122 by default).

## See also

  * [Ruby port](https://github.com/ukoloff/em-wssh)
  * [Python version](https://github.com/progrium/wssh)

## Credits

  * [nginx](http://nginx.org/)
  * [Node.js](http://nodejs.org/)
  * [ws](https://github.com/websockets/ws)
  * [PuTTY](http://www.chiark.greenend.org.uk/~sgtatham/putty/)
