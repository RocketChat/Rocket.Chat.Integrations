/* exported Script */
/* globals console, _, s, HTTP, Store */

/** Global Helpers
 *
 * console - A normal console instance
 * _       - An underscore instance
 * s       - An underscore string instance
 * HTTP    - The Meteor HTTP object to do sync http calls
 */

class Script {
	constructor() {
		this.host = 'https://cloud.docker.com';
		this.user = ''; // fill up with your docker cloud user
		this.apiKey = ''; // fill up with your docker cloud api key

		this.commands = {
			changeTag: {
				description: 'NEW! Change a deployment tag and redeploy it: deploy changeTag <uuid>|<name> <latest>|<develop>|<version>',
				action: function(uuid, version) {
					if (!uuid || !version) {
						return this.commands.changeTag.help();
					}
					return this.requestConfirmation('changeTag ' + uuid + ' ' + version, () => {
						uuid = this.getUuid(uuid);

						var options = {
							data: {
								image: 'rocketchat/rocket.chat:' + version
							}
						};

						var result = this.run('PATCH', '/api/app/v1/service/' + uuid + '/', options);

						return {
							action: 'changeTag',
							auth: this.user + ':' + this.apiKey,
							method: 'POST',
							url: this.host + '/api/app/v1/service/' + uuid + '/redeploy/'
						};
					});
				},
				help: function() {
					return {
						message: {
							text: '`deploy changeTag <uuid>|<name> <latest>|<develop>|<version>`'
						}
					};
				}
			},
			detail: {
				description: 'Detail of a deployment: deploy detail <uuid>|<name>',
				action: function(uuid) {
					if (uuid == null) {
						return this.commands.detail.help();
					}
					uuid = this.getUuid(uuid);
					return {
						action: 'detail',
						auth: this.user + ':' + this.apiKey,
						method: 'GET',
						url: this.host + '/api/app/v1/service/' + uuid + '/'
					};
				},
				help: function() {
					return {
						message: {
							text: '`deploy detail <uuid>|<name>`'
						}
					};
				}
			},
			list: {
				description: 'List of deployments: deploy list [page number]',
				action: function(page) {
					var offset;
					if (page == null) {
						page = 1;
					}
					page--;
					if (page < 0) {
						page = 1;
					}
					offset = page * 25;

					return {
						page: page,
						action: 'list',
						auth: this.user + ':' + this.apiKey,
						method: 'GET',
						url: this.host + '/api/app/v1/service/?limit=25&offset=' + offset
					};
				},
				help: function() {
					return {
						message: {
							text: '`deploy list [page number]`'
						}
					};
				}
			},
			scaleDown: {
				description: 'Scale down a service: deploy scaleDown <uuid>|<name>',
				action: function(uuid) {
					if (!uuid) {
						return this.commands.scaleDown.help();
					}

					return this.requestConfirmation('scaleDown ' + uuid, () => {
						uuid = this.getUuid(uuid);

						var options = {
							data: {
								target_num_containers: 0
							}
						};

						var result = this.run('PATCH', '/api/app/v1/service/' + uuid + '/', options);

						return {
							action: 'scaleDown',
							auth: this.user + ':' + this.apiKey,
							method: 'POST',
							url: this.host + '/api/app/v1/service/' + uuid + '/scale/'
						};
					});
				},
				help: function() {
					return {
						text: '`deploy scaleDown <uuid>|<name>`'
					};
				}
			},
			scaleUp: {
				description: 'Scale up a service: deploy scaleUp <uuid>|<name>',
				action: function(uuid) {
					if (!uuid) {
						return this.commands.scaleUp.help();
					}

					return this.requestConfirmation('scaleUp ' + uuid, () => {
						uuid = this.getUuid(uuid);

						var options = {
							data: {
								target_num_containers: 1
							}
						};

						var result = this.run('PATCH', '/api/app/v1/service/' + uuid + '/', options);

						return {
							action: 'scaleUp',
							auth: this.user + ':' + this.apiKey,
							method: 'POST',
							url: this.host + '/api/app/v1/service/' + uuid + '/scale/'
						};
					});
				},
				help: function() {
					return {
						text: '`deploy scaleUp <uuid>|<name>`'
					};
				}
			},
			search: {
				description: 'Search a deployment by name: deploy search <name>',
				action: function(name, page) {
					return {
						page: page,
						action: 'search',
						auth: this.user + ':' + this.apiKey,
						method: 'GET',
						url: this.host + '/api/app/v1/service/?name__icontains=' + encodeURIComponent(name)
					};
				},
				help: function() {
					return {
						message: {
							text: '`deploy search <service name>`'
						}
					};
				}
			},
			start: {
				description: 'Start a service: deploy start <uuid>|<name>',
				action: function(uuid) {
					if (!uuid) {
						return this.commands.scaleUp.help();
					}

					return this.requestConfirmation('start ' + uuid, () => {
						uuid = this.getUuid(uuid);

						return {
							action: 'start',
							auth: this.user + ':' + this.apiKey,
							method: 'POST',
							url: this.host + '/api/app/v1/service/' + uuid + '/start/'
						};
					});
				},
				help: function() {
					return {
						text: '`deploy start <uuid>|<name>`'
					};
				}
			},
			stop: {
				description: 'Stop a service: deploy stop <uuid>|<name>',
				action: function(uuid) {
					if (!uuid) {
						return this.commands.scaleUp.help();
					}

					return this.requestConfirmation('stop ' + uuid, () => {
						uuid = this.getUuid(uuid);

						return {
							action: 'stop',
							auth: this.user + ':' + this.apiKey,
							method: 'POST',
							url: this.host + '/api/app/v1/service/' + uuid + '/stop/'
						};
					});
				},
				help: function() {
					return {
						text: '`deploy stop <uuid>|<name>`'
					};
				}
			},
			// terminate: {
			// 	description: 'NEW! Terminate a deployment: deploy terminate <uuid>|<name>',
			// 	action: function(uuid) {
			// 		// var deployments, name, ref2;
			// 		if (uuid == null) {
			// 			return this.commands.terminate.help();
			// 		}
			// 		// HTTP.call('http://rocketchat.konecty.com/');
			// 		// deployments = Konecty.find('Deployment', {
			// 		// 	conditions: [
			// 		// 		{
			// 		// 			term: 'deployUuid',
			// 		// 			operator: 'equals',
			// 		// 			value: uuid
			// 		// 		}
			// 		// 	]
			// 		// });
			// 		// if ((deployments != null ? (ref2 = deployments.data) != null ? ref2[0] : void 0 : void 0) != null) {
			// 		// 	Konecty.update(deployments.data[0], 'Deployment', {
			// 		// 		deployStatus: 'Terminating'
			// 		// 	});
			// 		// }
			// 		// name = deployments.data[0].domain.replace(/http[s]?:\/\/(.*)\.rocket\.chat/, '$1');
			// 		// return {
			// 		// 	text: 'Service _' + name + '_ is terminating'
			// 		// };
			// 		return {
			// 			text: 'terminate of deployments'
			// 		};

			// 		// HTTP.call('http://rocketchat.konecty.com/');
			// 		// deployments = Konecty.find('Deployment', {
			// 		// 	conditions: [
			// 		// 		{
			// 		// 			term: 'deployUuid',
			// 		// 			operator: 'equals',
			// 		// 			value: uuid
			// 		// 		}
			// 		// 	]
			// 		// });
			// 		// if ((deployments != null ? (ref2 = deployments.data) != null ? ref2[0] : void 0 : void 0) != null) {
			// 		// 	Konecty.update(deployments.data[0], 'Deployment', {
			// 		// 		deployStatus: 'Terminating'
			// 		// 	});
			// 		// }
			// 		// name = deployments.data[0].domain.replace(/http[s]?:\/\/(.*)\.rocket\.chat/, '$1');
			// 		// return {
			// 		// 	text: 'Service _' + name + '_ is terminating'
			// 		// };
			// 		// return {
			// 		// 	text: 'terminate of deployments'
			// 		// };
			// 	},
			// 	help: function() {
			// 		return {
			// 			text: '`deploy terminate <uuid>|<name>`'
			// 		};
			// 	}
			// },
			update: {
				description: 'Update a running deployment: deploy update <uuid>|<name>',
				action: function(uuid) {
					if (uuid == null) {
						return this.commands.update.help();
					}

					return this.requestConfirmation('update ' + uuid, () => {
						uuid = this.getUuid(uuid);
						return {
							action: 'update',
							auth: this.user + ':' + this.apiKey,
							method: 'POST',
							url: this.host + '/api/app/v1/service/' + uuid + '/redeploy/'
						};
					});
				},
				help: function() {
					return {
						message: {
							text: '`deploy update <uuid>|<name>`'
						}
					};
				}
			}
		};
	}

	/**
	 * @params {object} request
	 */
	prepare_outgoing_request({ request }) {
		var split = request.data.text.match(/('[^']*'|[^ ]*)(?:\s+|$)/g);
		if (split != null) {
			split = split.slice(1, -1);
		}
		var command = s.trim(split[0]);
		var params = split.slice(1);
		var response = '';
		if (this.commands[command] != null) {
			if (((params != null ? params[0] : void 0) != null) && params[0] === 'help') {
				return this.commands[command].help.call(this);
			} else {
				return this.commands[command].action.apply(this, params);
			}
		} else {
			response = {
				message: {
					text: '```\nPlease choose a command:\n\n'
				}
			};
			var maxLength = Math.max.apply(null, _.map(_.keys(this.commands), function(l) {
				return l.length;
			}));
			Object.keys(this.commands).forEach((command) => {
				response.message.text += s.pad(command, maxLength + 2, ' ', 'right') + this.commands[command].description + '\n';
			});
			response.message.text += '```';
		}
		return response;
	}

	/**
	 * @params {object} request, response
	 */
	process_outgoing_response({ request, response }) {
		switch (request.action) {
			case 'changeTag':
				return {
					content: {
						text: 'Service *' + response.content.name + '* was updated and is redeploying'
					}
				};
			case 'search':
			case 'list':
				var list = response.content;

				var entries = [];
				var longestName = 0;
				if (list && list.objects) {
					list.objects.forEach(function(object) {
						entries.push({
							name: object.name,
							uuid: object.uuid,
							state: object.state
						});
						if (longestName < object.name.length) {
							return longestName = object.name.length;
						}
					});
				}
				var limit = list.meta.limit * (request.page + 1);
				if (limit > list.meta.total_count) {
					limit = list.meta.total_count;
				}
				var text = 'List of deployments. Showing ' + (list.meta.offset + 1) + '-' + limit + ' of ' + list.meta.total_count;

				text += '\n```\n';
				entries.forEach(function(entry) {
					return text += s.pad(entry.name, longestName + 2, ' ', 'right') + entry.uuid + ' (' + entry.state + ')\n';
				});
				text += '```\n';
				if (list && list.meta && list.meta.next) {
					text += 'and more...';
				}

				return {
					content: {
						text: text
					}
				};

			case 'detail':
				if (!response || !response.content) {
					return {
						content: {
							text: 'Not found'
						}
					};
				}
				var omitKeys = ['link_variables', 'container_envvars', 'calculated_envvars'];
				return {
					content: {
						text: 'Detail of deployment: ' + response.content.name + '\n' + '``` ' + JSON.stringify(_.omit(response.content, omitKeys), null, '  ') + ' ```'
					}
				};

			case 'update':
				return {
					content: {
						text: 'Service *' + response.content.name + '* is updating'
					}
				};

			case 'scaleUp':
				return {
					content: {
						text: 'Scaling up service *' + response.content.name + '*'
					}
				};

			case 'scaleDown':
				return {
					content: {
						text: 'Scaling down service *' + response.content.name + '*'
					}
				};
		}
	}

	run(method, url, options) {
		options = _.extend({
			auth: this.user + ':' + this.apiKey
		}, options);
		return HTTP(method, this.host + url, options);
	}

	requestConfirmation(value, action) {
		if (Store.get('commandConfirmation') != null) {
			if (Store.get('commandConfirmation') === value) {
				Store.set('commandConfirmation', null);
				return action();
			} else {
				Store.set('commandConfirmation', null);
				return {
					message: {
						text: 'ERROR! Command not executed, please try again.'
					}
				};
			}
		} else {
			Store.set('commandConfirmation', value);
			return {
				message: {
					text: 'Please, send the command again to confirm it\'s execution.'
				}
			};
		}
	}

	getUuid(nameOrUuid) {
		var response = this.run('GET', '/api/app/v1/service/?name=' + encodeURIComponent(nameOrUuid));

		if (response && response.result && response.result.data && response.result.data.objects && response.result.data.objects.length > 0) {
			return response.result.data.objects[0].uuid;
		}

		return nameOrUuid;
	}
}

