# ReplyGif

## Overview 
This is a slash-style-command for <a href='https://rocket.chat'>Rocket.Chat</a> which replies with a GIF from <a href='http://replygif.net/'>ReplyGif</a> based on your input into your message.

## Usage
Send a message with the content `!replygif <tags>` and this integration will add a message with an attached GIF randomized by the tags you use in your message. 

## Installation

### Configure Rocket.Chat
Add an "Outgoing Webhook" to your Rocket-Chat Instance (see <a href="https://rocket.chat/docs/administrator-guides/integrations/">Rocket.Chat Documentation</a>)

On the webhook config screen, set the following values:

##### Trigger Words
Set the trigger words on which the command should be fired e.g. `!replygif`.

##### URLs
In this field you must enter: `http://replygif.net/api`

##### Script Enabled
This value must be `true`

##### Script
Now insert the complete code of the file [integration.js](integration.js) into this field.

#### Save changes
Click on "SAVE CHANGES" and you're done.
