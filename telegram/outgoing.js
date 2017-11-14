class Script {
  prepare_outgoing_request({ request }) {

    let match;

    // Change the URL and method of the request
    match = request.data.user_name.match(/rocket.cat/);
    if (match) {
      return {
        // url: request.url + '&parse_mode=Markdown' + '&text=' + '*' + request.data.user_name+ '*: _' + request.data.text + '_',
        //no get method so nothing will happen avoid looping of messages
      };
    } else {
      return {
        url: request.url + '&parse_mode=HTML' + '&text=' + '<b>' + unescape(encodeURIComponent(request.data.user_name))+ '</b>: ' + unescape(encodeURIComponent(request.data.text)),
        method: 'GET'
      };
    }
  }
}
