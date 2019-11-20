# How to Install Polls

Go to Administration : Integrations and add a new Outgoing Webhook Integration

Event Trigger: `Message Sent`

Enabled: `true`

Channel: Set the channels (comma separated) you want this enabled in

Trigger Words: `!poll`

URLs: `https://dev.null`

Post as: `rocket.cat`

Alias: `Rocket Poll`

Avatar: URL: `https://cdn2.iconfinder.com/data/icons/Siena/256/poll%20green.png`

Script Enabled: `true`

Script: (paste the script from `outgoing.js` into this field)

Usage:

Your poll must start with `!poll`, and the question is delimited at the first `?`, `/` or `:`


	!poll Can you choose? Option 1 / Option 2

	!poll Make a choice : First option / Second option

	!poll We must choose / Now / Never
