class Script {
	formatDate(date) {
		return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/' +
				(date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '/' +
				date.getFullYear() + ' ' +
				(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' +
				(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
				(date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	}
	/**
	 * @params {object} request
	 */
	process_incoming_request({ request }) {

		// console is a global helper to improve debug
		console.log(request.content);
		var data = request.content;

		var msg = {
			content: {
				/*username: 'Konecty'*/
				attachments: []
			}
		};

		if (request.content.user && request.content.user.username) {
			msg.content.channel = '@' + request.content.user.username;
		}

		var attachment = {};

		msg.content.text = '*' + data.documentName + '* with code *' + data.code + '*';

		if (data.action === 'create') {
			attachment.color = 'good';
			msg.content.text += ' was *created* at _' + this.formatDate(new Date(data._updatedAt)) + '_ by _' + data._updatedBy.name + ' - (' + data._updatedBy.group.name + ')_';
		} else if (data.action === 'update') {
			attachment.color = 'warning';
			msg.content.text += ' was *updated* at _' + this.formatDate(new Date(data._updatedAt)) + '_ by _' + data._updatedBy.name + ' - (' + data._updatedBy.group.name + ')_';
		} else if (data.action === 'delete') {
			attachment.color = 'danger';
			msg.content.text += ' was *removed* at _' + this.formatDate(new Date(data._updatedAt)) + '_ by _' + data._updatedBy.name + ' - (' + data._updatedBy.group.name + ')_';
		}

		attachment.fields = [];

		var totalData = data.data.length;
		for (var i = 0; i < totalData; i++) {
			attachment.fields.push({
				title: data.data[i].field,
				value: data.data[i].value,
				singleline: true
			});
		}

		msg.content.attachments.push(attachment);

		return msg;
	}
}
