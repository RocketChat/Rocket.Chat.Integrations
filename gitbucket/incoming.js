/* exported Script */
/* globals console, _, s */

/** Global Helpers
 *
 * console - A normal console instance
 * _       - An underscore instance
 * s       - An underscore string instance
 */

const NOTIF_COLOR = '#6498CC';
const IGNORE_CONFIDENTIAL = true;
const IGNORE_UNKNOWN_EVENTS = false;
const IGNORE_ERROR_MESSAGES = false;
const USE_ROCKETCHAT_AVATAR = false;
const DEFAULT_AVATAR = null; // <- null means use the avatar from settings if no other is available
const refParser = (ref) => ref.replace(/^refs\/(?:tags|heads)\/(.+)$/, '$1');

class Script {
  /**
   * @params {object} request
   */
  process_incoming_request({ request }) {
    // request.url.hash
    // request.url.search
    // request.url.query
    // request.url.pathname
    // request.url.path
    // request.url_raw
    // request.url_params
    // request.headers
    // request.user._id
    // request.user.name
    // request.user.username
    // request.content_raw
    // request.content

    // console is a global helper to improve debug
    //console.log(request.headers);
    //console.log(request.content);

    const event = request.headers['x-github-event'];
    switch (event) {
        case 'push':
        return {
            content:{
                text: `${request.content.pusher.name} pushed ${request.content.commits.length} commit(s) to branch [${refParser(request.content.ref)}](${request.content.compare}) in [${request.content.repository.name}](${request.content.repository.html_url})`
            }
        };
        
        case 'pull_request':
        return {
            content:{
                text: `${request.content.pull_request.user.login} ${request.content.action} PR [#${request.content.pull_request.number}](${request.content.pull_request.html_url}) in [${request.content.repository.name}](${request.content.repository.html_url})`
            }
        };

        case 'issues':
        return {
            content:{
                text: `${request.content.issue.user.login} ${request.content.action} issue [#${request.content.issue.number}](${request.content.issue.html_url}) in [${request.content.repository.name}](${request.content.repository.html_url})`
            }
        };

        case 'issue_comment':
        return {
            content:{
                text: `${request.content.comment.user.login} added comment [#${request.content.comment.id}](${request.content.comment.html_url}) to [#${request.content.issue.number}](${request.content.issue.html_url}) in [${request.content.repository.name}](${request.content.repository.html_url})`
            }
        };

        default:
    }
    
    return {
      content:{
        text: request.content.text
        // "attachments": [{
        //   "color": "#FF0000",
        //   "author_name": "Rocket.Cat",
        //   "author_link": "https://open.rocket.chat/direct/rocket.cat",
        //   "author_icon": "https://open.rocket.chat/avatar/rocket.cat.jpg",
        //   "title": "Rocket.Chat",
        //   "title_link": "https://rocket.chat",
        //   "text": "Rocket.Chat, the best open source chat",
        //   "fields": [{
        //     "title": "Priority",
        //     "value": "High",
        //     "short": false
        //   }],
        //   "image_url": "https://rocket.chat/images/mockup.png",
        //   "thumb_url": "https://rocket.chat/images/mockup.png"
        // }]
       }
    };

    // return {
    //   error: {
    //     success: false,
    //     message: 'Error example'
    //   }
    // };
  }
  
