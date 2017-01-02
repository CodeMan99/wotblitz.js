var fetch = require('node-fetch');
var querystring = require('querystring');
var util = require('util');

module.exports = Request;

function Request(application_id, region, language) {
	this.appId = application_id;

	/**
	 * Store preferred default region.
	 *
	 * @type {string}
	 */
	this.region = region || '.com';

	/**
	 * Store preferred default language.
	 *
	 * @type {string}
	 */
	this.language = language || 'en';
}

/**
 * Accessor to store a WarGaming developer application_id.
 *
 * When unset the getter will read "APPLICATION_ID" from the environment.
 *
 * @type {string}
 */
Object.defineProperty(Request.prototype, 'application_id', {
	configurable: true,
	enumerable: true,
	get: function() {
		if (!this.appId) this.appId = process.env.APPLICATION_ID;
		if (!this.appId) throw new Error('wotblitz/request: no APPLICATION_ID set in the environment');

		return this.appId;
	},
	set: function(value) {
		this.appId = value;
	}
});

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
Request.prototype.execute = function(options, body) {
	// assign defaults
	options = Object.assign({
		language: this.language,
		method: 'POST',
		region: this.region
	}, options);

	try {
		body.application_id = this.application_id;
	} catch (e) {
		return Promise.reject(e);
	}

	body.language = options.language;

	var url = 'https:\/\/' + options.hostname + options.region + options.path;

	if (options.method !== 'GET') {
		options = {
			body: querystring.stringify(body),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
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
};
