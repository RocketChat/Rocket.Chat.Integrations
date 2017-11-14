/* exported Script */
/* globals console, _, s, HTTP */

/*
 * EXAMPLE MESSAGE

/poll "question?" "option 1" "option 2"

 */

/** Global Helpers
 *
 * console - A normal console instance
 * _       - An underscore instance
 * s       - An underscore string instance
 * HTTP    - The Meteor HTTP object to do sync http calls
 */

class Script {
  /**
   * @params {object} request
   */
  prepare_outgoing_request({ request }) {
    // request.params            {object}
    // request.method            {string}
    // request.url               {string}
    // request.auth              {string}
    // request.headers           {object}
    // request.data.token        {string}
    // request.data.channel_id   {string}
    // request.data.channel_name {string}
    // request.data.timestamp    {date}
    // request.data.user_id      {string}
    // request.data.user_name    {string}
    // request.data.text         {string}
    // request.data.trigger_word {string}

    const emojis = [
      ':zero:',
      ':one:',
      ':two:',
      ':three:',
      ':four:',
      ':five:',
      ':six:',
      ':seven:',
      ':eight:',
      ':nine:',
      ':ten:'
    ];

    let match;

    // Change the URL and method of the request
    match = request.data.text.match(/((["'])(?:(?=(\\?))\3.)*?\2)/g);

    let title = '';
    let options = [];

    match.forEach((item, i) => {
      item = item.replace(/(^['"]|['"]$)/g, '');
      if (i === 0) {
        title = item;
      } else {
        options.push(emojis[(options.length + 1)] + ' ' + item);
      }
    });

    return {
        message: {
          text: '_Please vote using reactions_',
          attachments: [
            {
              color: '#0000DD',
              title: title,
              text: options.join('\n')
            }
          ]
        }
      };
  }

  /**
   * @params {object} request, response
   */
  process_outgoing_response({ request, response }) {
  }
}
