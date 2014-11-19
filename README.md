ssh-thru-nginx
==============

Try to proxy SSH connection through nginx

First attemp was using pair of requests (GET+POST), but nginx appeared to always buffering
user request (server response can be send back unbuffered). So it is impractical :-(
