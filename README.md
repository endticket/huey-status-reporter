Huey-status-reporter
===================


Hey! This is the Readme of the  websocket status reporter for [Huey](https://github.com/coleifer/huey).


What can this do?
-------------
This project makes it possible, to subscribe for given jobs from your very own frontend over websocket, and get instant notification about the jobs status. Or even subscribe for every huey task ever executed, it could be used for some status dashboard somehow later on :)

Example client
-------------
example client is available in the repository, it's called wstest.html, it's very barebone, but works

Setup?
-------------
+ git clone
+ npm install
+ copy example-config.js to config.js and customize for your environment
+ run bin/huey-reporter config.js
+ profit :)

Docker?
-------------
Yes!
Just run
+ docker run --env HUEY_LISTENER_REDIS_HOST=your.redis.host endticket/huey-reporter

Environment variables
-------------
 + HUEY_LISTENER_REDIS_HOST
 + HUEY_LISTENER_REDIS_PORT
 + ALLOWED_ORIGINS

Authors
-------------
* [deathowl](https://github.com/deathowl)


LICENSE
-------------

Licensed under WTFPL. Take it, use it.