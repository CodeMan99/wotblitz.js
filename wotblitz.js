var hosts = {
	wot: 'api.worldoftanks',
	wotb: 'api.wotblitz'
};
var request = require('./request.js');

exports.request = request;

Object.defineProperties(exports, {
	/**
	 * Language constants. Use the value in the request.
	 * @example
	 * wotblitz.language = wotblitz.LANGUAGES['English'];
	 */
	LANGUAGES: {
		enumerable: true,
		value: {
			'English': 'en',
			'Русский': 'ru',
			'Polski': 'pl',
			'Deutsch': 'de',
			'Français': 'fr',
			'Español': 'es',
			'简体中文': 'zh-cn',
			'Türkçe': 'tr',
			'Čeština': 'cs',
			'ไทย': 'th',
			'Tiếng Việt': 'vi',
			'한국어': 'ko'
		}
	},
	/**
	 * Top level domain constant for the Asian servers.
	 * @example
	 * wotblitz.region = wotblitz.REGION_ASIA;
	 */
	REGION_ASIA: {
		enumerable: true,
		value: '.asia'
	},
	/**
	 * Top level domain constant for the European servers.
	 * @example
	 * wotblitz.region = wotblitz.REGION_EU;
	 */
	REGION_EU: {
		enumerable: true,
		value: '.eu'
	},
	/**
	 * Top level domain constant for the North American servers.
	 * @example
	 * wotblitz.region = wotblitz.REGION_NA;
	 */
	REGION_NA: {
		enumerable: true,
		value: '.com'
	},
	/**
	 * Top level domain constant for the Russian servers.
	 * @example
	 * wotblitz.region = wotblitz.REGION_RU;
	 */
	REGION_RU: {
		enumerable: true,
		value: '.ru'
	},
	/**
	 * Convenience property to get/set the WarGaming developer key.
	 * Exists directly on the request module.
	 * @example
	 * wotblitz.application_id = 'wargamingdeveloperkey';
	 */
	application_id: {
		enumerable: true,
		get: function() {
			return request.application_id;
		},
		set: function(value) {
			request.application_id = value;
		}
	},
	/**
	 * Convenience property to get/set the response language.
	 * Exists directly on the request module.
	 */
	language: {
		enumerable: true,
		get: function() {
			return request.language;
		},
		set: function(value) {
			request.language = value;
		}
	},
	/**
	 * Convenience property to get/set the top level domain.
	 * Exists directly on the request module.
	 */
	region: {
		enumerable: true,
		get: function() {
			return request.region;
		},
		set: function(value) {
			request.region = value;
		}
	}
});

exports.auth = {
	/**
	 * Authenticates user based on Wargaming.net ID (OpenID)
	 *
	 * @param {string} redirect_uri this is where the user is sent after the login process
	 * @param {number} [nofollow=1] prevents automatic redirect to the login process
	 * @param {number} [expires_at] token will expire at this date or time delta in seconds
	 * @param {string} [display] layout for mobile applications, values can be "page" or "popup"
	 * @returns {Promise<Object>} resolves to object containing the URL for the login process
	 */
	login: function(redirect_uri, nofollow, expires_at, display) {
		return request({
			hostname: hosts.wot,
			path: '/wot/auth/login/'
		}, {
			display: display,
			expires_at: expires_at,
			nofollow: typeof nofollow !== 'undefined' ? nofollow : 1,
			redirect_uri: redirect_uri
		});
	},
	/**
	 * Access token extension
	 *
	 * @param {string} access_token user's authentication string
	 * @param {number} [expires_at] date or time span of expiration (default: 14 days)
	 * @returns {Promise<Object>} resolves to the new token and related information
	 */
	prolongate: function(access_token, expires_at) {
		return request({
			hostname: hosts.wot,
			path: '/wot/auth/prolongate/'
		}, {
			access_token: access_token,
			expires_at: expires_at || 14 * 24 * 60 * 60 // 14 days in seconds
		});
	},
	/**
	 * Invalidate a token
	 *
	 * @param {string} access_token user's authentication string
	 * @returns {Promise<Object>} resolves to a null value
	 */
	logout: function(access_token) {
		return request({
			hostname: hosts.wot,
			path: '/wot/auth/logout/'
		}, {
			access_token: access_token
		});
	}
};

exports.servers = {
	/**
	 * Get the number of online for each server of a given game(s)
	 *
	 * @param {string|string[]} [game] id or ids, values "wot", "wotb", "wowp"
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to object describing server counts
	 */
	info: function(game, fields) {
		return request({
			hostname: hosts.wot,
			path: '/wgn/servers/info/'
		}, {
			fields: fields ? fields.toString() : '',
			game: game ? game.toString() : ''
		});
	}
};

exports.account = {
	/**
	 * Search for a player.
	 *
	 * @param {string} search value to match usernames
	 * @param {string} [type] how to match, "startswith" or "exact"
	 * @param {number} [limit] maximum number of entries to match
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object[]> resolves to an array of matching accounts
	 */
	list: function(search, type, limit, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/account/list/'
		}, {
			fields: fields ? fields.toString() : '',
			limit: limit,
			search: search,
			type: type
		});
	},
	/**
	 * Describe the given player(s).
	 *
	 * @param {string|string[]} account_id WarGaming assigned id or ids
	 * @param {string} [access_token] user's authentication string
	 * @param {string|string[]} [extra] additional data available, value "private.grouped_contacts"
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to object include account dates and statistics
	 */
	info: function(account_id, access_token, extra, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/account/info/'
		}, {
			account_id: account_id.toString(),
			access_token: access_token,
			extra: extra ? extra.toString() : '',
			fields: fields ? fields.toString() : ''
		});
	},
	/**
	 * Player(s) achievement list.
	 *
	 * @param {string|string[]} account_id WarGaming assigned id or ids
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to object with achievement details
	 */
	achievements: function(account_id, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/account/achievements/'
		}, {
			account_id: account_id.toString(),
			fields: fields ? fields.toString() : ''
		});
	},
	/**
	 * Vehicle statistics for the given player(s).
	 *
	 * @param {string|string[]} account_id WarGaming assigned id or ids
	 * @param {string} tank_id vehicle id
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to the player(s) stats for the given vehicles
	 */
	tankstats: function(account_id, tank_id, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/account/tankstats/'
		}, {
			account_id: account_id.toString(),
			tank_id: tank_id,
			fields: fields ? fields.toString() : ''
		});
	}
};

exports.clans = {
	/**
	 * Search for a clan by name or tag.
	 *
	 * @param {string} search the text to match by
	 * @param {number} [page_no] which page to return, starting at 1
	 * @param {number} [limit] max count of entries
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object[]>} resolves to a list of short clan descriptions
	 */
	list: function(search, page_no, limit, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/clans/list/'
		}, {
			search: search,
			page_no: page_no,
			limit: limit,
			fields: fields ? fields.toString() : ''
		});
	},
	/**
	 * Clan(s) details.
	 *
	 * @param {number|number[]} clan_id id(s) of the clans to return
	 * @param {string|string[]} [extra] additional fields to request, value "members"
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to description of the clan(s)
	 */
	info: function(clan_id, extra, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/clans/info/'
		}, {
			clan_id: clan_id.toString(),
			extra: extra ? extra.toString() : '',
			fields: fields ? fields.toString() : ''
		});
	},
	/**
	 * Player account(s) clan descriptor.
	 *
	 * @param {number|number[]} account_id the player(s) to request
	 * @param {string|string[]} [extra] additional response fields, value "clan"
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolve to descriptor of player accounts in regard to their clan
	 */
	accountinfo: function(account_id, extra, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/clans/accountinfo/'
		}, {
			account_id: account_id.toString(),
			extra: extra ? extra.toString() : '',
			fields: fields ? fields.toString() : ''
		});
	},
	/**
	 * Meta information about clans.
	 *
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to clan terminology definitions
	 */
	glossary: function(fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/clans/glossary/'
		}, {
			fields: fields ? fields.toString() : ''
		});
	}
};

exports.encyclopedia = {
	/**
	 * List of vehicle information
	 *
	 * @param {number|number[]} [tank_id] limit to this vehicle id(s) only
	 * @param {string|string[]} [nation] limit to vehicle in this tech tree(s)
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to description of requested vehicles
	 */
	vehicles: function(tank_id, nation, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/encyclopedia/vehicles/'
		}, {
			tank_id: tank_id ? tank_id.toString() : '',
			nation: nation ? nation.toString() : '',
			fields: fields ? fields.toString() : ''
		});
	},
	/**
	 * Characteristics with different vehicle modules installed.
	 *
	 * @param {string} tank_id vehicle to select
	 * @param {string} [profile_id] 
	 * @param {Object} [modules]
	 * @param {number} [modules.engine_id]
	 * @param {number} [modules.gun_id]
	 * @param {number} [modules.suspension_id]
	 * @param {number} [modules.turret_id]
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to exact vehicle information
	 */
	vehicleprofile: function(tank_id, profile_id, modules, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/encyclopedia/vehicleprofile/'
		}, Object.assign({
			tank_id: tank_id,
			fields: fields ? fields.toString() : ''
		}, modules || {
			profile_id: profile_id
		}));
	},
	/**
	 * Information on any engine, suspension, gun, or turret.
	 *
	 * @params {number|number[]} [module_id] id of any vehicle's module
	 * @params {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to description of each module
	 */
	modules: function(module_id, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/encyclopedia/modules/'
		}, {
			module_id: module_id ? module_id.toString() : '',
			fields: fields ? fields.toString() : ''
		});
	},
	/**
	 * Available equipment and provisions.
	 *
	 * @param {number|number[]} [tank_id] select provisions for the given tank(s)
	 * @param {number|number[]} [provision_id] item id
	 * @param {string} [type] provision type, value "optionalDevice" or "equipment"
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to description of each provision
	 */
	provisions: function(tank_id, provision_id, type, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/encyclopedia/provisions/'
		}, {
			tank_id: tank_id ? tank_id.toString() : '',
			provision_id: provision_id ? provision_id.toString() : '',
			type: type,
			fields: fields ? fields.toString() : ''
		});
	},
	/**
	 * Meta description of the tankopedia.
	 *
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to the description
	 */
	info: function(fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/encyclopedia/info/'
		}, {
			fields: fields ? fields.toString() : ''
		});
	},
	/**
	 * Description of in game awards.
	 *
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to the description
	 */
	achievements: function(fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/encyclopedia/achievements/'
		}, {
			fields: fields ? fields.toString() : ''
		});
	},
	/**
	 * Description of crew skills.
	 *
	 * @params {string|string[]} [skill_id] name of skill(s) to request
	 * @params {string|string[]} [vehicle_type] select skill category
	 * @params {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to the description
	 */
	crewskills: function(skill_id, vehicle_type, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/encyclopedia/crewskills/'
		}, {
			skill_id: skill_id ? skill_id.toString() : '',
			vehicle_type: vehicle_type ? vehicle_type.toString() : '',
			fields: fields ? fields.toString() : ''
		});
	},
	/**
	 * List of all possible module combinations for the given vehicle(s).
	 *
	 * @param {number|number[]} tank_id the vehicle(s) to select
	 * @param {string} [order_by] result order, values "price_credit" or "-price_credit"
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to a series of profile_id and meta information
	 */
	vehicleprofiles: function(tank_id, order_by, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/encyclopedia/vehicleprofiles/'
		}, {
			tank_id: tank_id.toString(),
			order_by: order_by,
			fields: fields ? fields.toString() : ''
		});
	}
};

exports.tanks = {
	/**
	 * General statistics for each vehicle of the player.
	 *
	 * @param {number} account_id which player to request
	 * @param {string} [access_token] user's authentication string
	 * @param {number|number[]} [tank_id] select only this vehicle(s)
	 * @param {string} [in_garage] filter to vehicle in ("1") or not in ("0") the garage (requires auth)
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to stats of the vehicle(s) achieved by the player
	 */
	stats: function(account_id, access_token, tank_id, in_garage, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/tanks/stats/'
		}, {
			account_id: account_id,
			access_token: access_token,
			tank_id: tank_id ? tank_id.toString() : '',
			in_garage: in_garage,
			fields: fields ? fields.toString() : ''
		});
	},
	/**
	 * Achievements earned for each vehicle of the player.
	 *
	 * @param {number} account_id which player to request
	 * @param {string} [access_token] user's authentication string
	 * @param {number|number[]} [tank_id] select only this vehicle(s)
	 * @param {string} [in_garage] filter to vehicle in ("1") or not in ("0") the garage (requires auth)
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to awards earn on each vehicle
	 */
	achievements: function(account_id, access_token, tank_id, in_garage, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/tanks/achievements/'
		}, {
			account_id: account_id,
			access_token: access_token,
			tank_id: tank_id ? tank_id.toString() : '',
			in_garage: in_garage,
			fields: fields ? fields.toString() : ''
		});
	}
};

exports.clanmessages = {
	/**
	 * The text and meta data of all conversation.
	 *
	 * @param {string} access_token user's authentication string
	 * @param {number} [message_id] a specific message
	 * @param {Object} [filters] options
	 * @param {number} [filters.page_no] which page
	 * @param {number} [filters.limit] how many per page
	 * @param {string|string[]} [filters.order_by] which field(s) to order the response (too many values to list)
	 * @param {number|date} [filters.expires_before] only messages before this date (unix or ISO)
	 * @param {number|data} [filters.expires_after] only messages on or after this date (unix or ISO)
	 * @param {string} [filters.importance] only messages with this level, values "important" or "standard"
	 * @param {string} [filters.status] only messages with this status, values "active" or "deleted"
	 * @param {string} [filters.type] only messages of this type, values "general", "training", "meeting", or "battle"
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to a message board object
	 */
	messages: function(access_token, message_id, filters, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/clanmessages/messages/'
		}, Object.assign({
			access_token: access_token,
			message_id: message_id,
			fields: fields ? fields.toString() : ''
		}, filters, {
			order_by: filters && filters.order_by ? filters.order_by.toString() : ''
		}));
	},
	/**
	 * Post a new message.
	 *
	 * @param {string} access_token user's authentication string
	 * @param {string} title message topic
	 * @param {string} text message body
	 * @param {string} type message category, values "general", "training", "meeting", or "battle"
	 * @param {string} importance values "important" or "standard"
	 * @param {string} expires_at invalidation date
	 * @returns {Promise<Object>} resolves to the `message_id`
	 */
	create: function(access_token, title, text, type, importance, expires_at) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/clanmessages/create/'
		}, {
			access_token: access_token,
			expires_at: expires_at,
			importance: importance,
			text: text,
			title: title,
			type: type
		});
	},
	/**
	 * Remove a message.
	 *
	 * @param {string} access_token user's authentication string
	 * @param {number} message_id exactly this message
	 * @returns {Promise<Object>} resolves to an empty object
	 */
	'delete': function(access_token, message_id) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/clanmessages/delete/'
		}, {
			access_token: access_token,
			message_id: message_id
		});
	},
	/**
	 * Set like value on a message.
	 *
	 * @param {string} access_token user's authentication string
	 * @param {number} message_id exactly this message
	 * @param {string} action literally "add" or "remove"
	 * @returns {Promise<Object>} resolves to an empty object
	 */
	like: function(access_token, message_id, action) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/clanmessages/like/'
		}, {
			access_token,
			action: action,
			message_id: message_id
		});
	},
	/**
	 * All likes on a message.
	 *
	 * @params {string} access_token user's authentication string
	 * @params {number} message_id exactly this message
	 * @params {string|string[]} [fields] response selection
	 * @returns {Promise<Object[]>} resolves to list of by whom and when a like was added
	 */
	likes: function(access_token, message_id, fields) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/clanmessages/likes/'
		}, {
			access_token: access_token,
			message_id: message_id,
			fields: fields ? fields.toString() : ''
		});
	},
	/**
	 * Change an existing message.
	 *
	 * @param {string} access_token user's authentication string
	 * @params {number} message_id exactly this message
	 * @param {string} [title] message topic
	 * @param {string} [text] message body
	 * @param {string} [type] message category, values "general", "training", "meeting", or "battle"
	 * @param {string} [importance] values "important" or "standard"
	 * @param {string} [expires_at] invalidation date
	 * @returns {Promise<Object>} resolves to the `message_id`
	 */
	update: function(access_token, message_id, title, text, type, importance, expires_at) {
		return request({
			hostname: hosts.wotb,
			path: '/wotb/clanmessages/update/'
		}, {
			access_token: access_token,
			expires_at: expires_at,
			importance: importance,
			message_id: message_id,
			text: text,
			title: title,
			type: type
		});
	}
};
