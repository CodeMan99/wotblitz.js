var appId;
var fetch = require('node-fetch');
var querystring = require('querystring');
var util = require('util');

module.exports = request;

/**
 * Accessor to store a WarGaming developer application_id.
 *
 * When unset the getter will read "APPLICATION_ID" from the environment.
 *
 * @type {string}
 */
Object.defineProperty(request, 'application_id', {
	configurable: true,
	enumerable: true,
	get: function() {
		if (!appId) appId = process.env.APPLICATION_ID;
		if (!appId) throw new Error('wotblitz/request: no APPLICATION_ID set in the environment');
		return appId;
	},
	set: function(value) {
		appId = value;
	}
});

/**
 * Store preferred default region.
 *
 * @type {string}
 */
request.region = '.com';

/**
 * Store preferred default language.
 *
 * @type {string}
 */
request.language = 'en';

/**
 * WarGaming.net API request tool.
 *
 * @param {Object} options
 * @param {string} options.hostname base host not including the TLD (example: "api.wotblitz")
 * @param {string} [options.language=en] the response language, according to WarGaming.
 * @param {string} [options.method=POST] the request method, normally "GET" or "POST"
 * @param {string} options.path the request path part (example: "/wgn/servers/info/")
 * @param {string} [options.region=.com] the region's top level domain part
 * @param {Object} body use to specify the parameters of the route
 * @returns {Promise<Object>} resolves to the "data" property of the request
 * @see {@link https://developers.wargaming.net/documentation/guide/getting-started/|WarGaming.net Developer Room}
 */
function request(options, body) {
	// assign defaults
	options = Object.assign({
		language: request.language,
		method: 'POST',
		region: request.region
	}, options);

	try {
		body.application_id = request.application_id;
	} catch (e) {
		return Promise.reject(e);
	}

	body.language = options.language;

	var options;
	var url = 'https:\/\/' + options.hostname + options.region + options.path;

	if (options.method != 'GET') {
		options = {
			body: querystring.stringify(body),
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: options.method
		};
	} else {
		url += '?' + querystring.stringify(body);
	}

	return fetch(url, options).then(response => {
		return response.json();
	}).then(result => {
		switch (result.status) {
		case 'ok':
			return result.data;
		case 'error':
			var e = result.error;
			var message = util.format('%d %s: %s=%j', e.code, e.message, e.field, e.value);

			return Promise.reject(new Error(message));
		default:
			return null;
		}
	});
}
