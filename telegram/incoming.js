class Script {

  process_incoming_request({ request }) {
    // request.content.message.from.first_name
    // request.content.message.text

    // console is a global helper to improve debug
    console.log(request.content);
  if('edited_message' in request.content) {
    request.content.message = request.content.edited_message;
  }
    return {
      content: {
        username: request.content.message.from.first_name,
        icon_url: '/avatar/' + request.content.message.from.first_name + '.jpg' ,
        text: request.content.message.text
       }
    };

     return {
       error: {
         success: false,
         message: 'Error example'
       }
     };
  }
}

// class Script {
//     process_incoming_request({ request }) {
//         // UNCOMMENT THE BELOW LINE TO DEBUG IF NEEDED.
//         console.log(request.content);
//         if ('edited_message' in request.content) {
//             request.content.message = request.content.edited_message;
//         }
//         let who = request.content.message.from.username
//         let icon_url = '/avatar/' + request.content.message.from.username + '.jpg'
//         if(!who)  {
//           who = `${request.content.message.from.first_name} ${request.content.message.from.last_name}`
//           icon_url = `/avatar/${request.content.message.from.first_name}.jpg`
//         }
//         let body = request.content.message.text
//
//         if(!body) {
//           if(request.content.message.sticker.emoji) {
//             // It's a sticker
//             body = request.content.message.sticker.emoji
//         } else {
//            return {}
//           }
//         }
//
//         return {
//             content: {
//                 username: who,
//                 icon_url: icon_url,
//                 text: body
//             }
//         };
//     }
// }
