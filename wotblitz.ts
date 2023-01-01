import Request from './request.js';

type RequestConstructorParams = ConstructorParameters<typeof Request>;
type ExecuteRequest = Request['execute'];

type AccountAPI = {
	list: (search: any, type: any, limit: any, fields: any) => Promise<any>;
	info: (account_id: any, access_token: any, extra: any, fields: any) => Promise<any>;
	achievements: (account_id: any, fields: any) => Promise<any>;
	tankstats: (account_id: any, tank_id: any, fields: any) => Promise<any>;
};

type AuthAPI = {
	login: (redirect_uri: any, nofollow: any, expires_at: any, display: any) => Promise<any>;
	prolongate: (access_token: any, expires_at: any) => Promise<any>;
	logout: (access_token: any) => Promise<any>;
};

type ClanMessagesAPI = {
	messages: (access_token: any, message_id: any, filters: any, fields: any) => Promise<any>;
	create: (access_token: any, title: any, text: any, type: any, importance: any, expires_at: any) => Promise<any>;
	delete: (access_token: any, message_id: any) => Promise<any>;
	like: (access_token: any, message_id: any, action: any) => Promise<any>;
	likes: (access_token: any, message_id: any, fields: any) => Promise<any>;
	update: (access_token: any, message_id: any, title: any, text: any, type: any, importance: any, expires_at: any) => Promise<any>;
};

type ClansAPI = {
	list: (search: any, page_no: any, limit: any, fields: any) => Promise<any>;
	info: (clan_id: any, extra: any, fields: any) => Promise<any>;
	accountinfo: (account_id: any, extra: any, feilds: any) => Promise<any>;
	glossary: (fields: any) => Promise<any>;
};

type EncyclopediaAPI = {
	vehicles: (tank_id: any, nation: any, fields: any) => Promise<any>;
	vehicleprofile: (tank_id: any, profile_id: any, modules: any, fields: any) => Promise<any>;
	modules: (module_id: any, fields: any) => Promise<any>;
	provisions: (tank_id: any, provision_id: any, type: any, fields: any) => Promise<any>;
	info: (fields: any) => Promise<any>;
	achievements: (fields: any) => Promise<any>;
	crewskills: (skill_id: any, vehicle_type: any, fields: any) => Promise<any>;
	vehicleprofiles: (tank_id: any, order_by: any, fields: any) => Promise<any>;
};

type ServersAPI = {
	info: (game: any, fields: any) => Promise<any>;
};

type TanksAPI = {
	stats: (account_id: any, access_token: any, tank_id: any, in_garage: any, fields: any) => Promise<any>;
	achievements: (account_id: any, access_token: any, tank_id: any, in_garage: any, fields: any) => Promise<any>;
};

type TournamentsAPI = {
	list: (options: any, fields: any) => Promise<any>;
	info: (tournament_id: any, fields: any) => Promise<any>;
	teams: (tournament_id: any, options: any, fields: any) => Promise<any>;
	stages: (tournament_id: any, options: any, fields: any) => Promise<any>;
	matches: (tournament_id: any, stage_id: any, options: any, fields: any) => Promise<any>;
	standings: (tournament_id: any, options: any, fields: any) => Promise<any>;
	tables: (tournament_id: any, stage_id: any, options: any, fields: any) => Promise<any>;
};

type wotblitz = {
	account: AccountAPI;
	auth: AuthAPI;
	clanmessages: ClanMessagesAPI;
	clans: ClansAPI;
	encyclopedia: EncyclopediaAPI;
	servers: ServersAPI;
	tanks: TanksAPI;
	tournaments: TournamentsAPI;

	request: Request;
	application_id: string;
	language: string;
	region: string;
};

const hosts = {
	wot: 'api.worldoftanks',
	wotb: 'api.wotblitz'
} as const;

let account: (request: ExecuteRequest) => AccountAPI;
let auth: (request: ExecuteRequest) => AuthAPI;
let clanmessages: (request: ExecuteRequest) => ClanMessagesAPI;
let clans: (request: ExecuteRequest) => ClansAPI;
let encyclopedia: (request: ExecuteRequest) => EncyclopediaAPI;
let servers: (request: ExecuteRequest) => ServersAPI;
let tanks: (request: ExecuteRequest) => TanksAPI;
let tournaments: (request: ExecuteRequest) => TournamentsAPI;

const create: (...args: RequestConstructorParams) => wotblitz = (application_id, region, language) => {
	var request = new Request(application_id, region, language);
	var execute = Request.prototype.execute.bind(request);
	var wotblitz = {
		account: account(execute),
		auth: auth(execute),
		clanmessages: clanmessages(execute),
		clans: clans(execute),
		encyclopedia: encyclopedia(execute),
		servers: servers(execute),
		tanks: tanks(execute),
		tournaments: tournaments(execute),

		request,

		get application_id() {
			return request.application_id;
		},

		set application_id(value) {
			request.application_id = value;
		},

		get language() {
			return request.language;
		},

		set language(value) {
			request.language = value;
		},

		get region() {
			return request.region;
		},

		set region(value) {
			request.region = value;
		},
	};

	Object.defineProperty(wotblitz, 'request', {enumerable: false});

	return wotblitz;
}

Object.defineProperties(create, {
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
	}
});

account = request => ({
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
		if (!search) return Promise.reject(new Error('wotblitz.account.list: search is required'));

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
		if (!account_id) return Promise.reject(new Error('wotblitz.account.info: account_id is required'));

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
		if (!account_id) return Promise.reject(new Error('wotblitz.account.achievements: account_id is required'));

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
		if (!account_id) return Promise.reject(new Error('wotblitz.account.tankstats: account_id is required'));
		if (!tank_id) return Promise.reject(new Error('wotblitz.account.tankstats: tank_id is required'));

		return request({
			hostname: hosts.wotb,
			path: '/wotb/account/tankstats/'
		}, {
			account_id: account_id.toString(),
			tank_id: tank_id,
			fields: fields ? fields.toString() : ''
		});
	}
});

auth = request => ({
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
		if (!redirect_uri) return Promise.reject(new Error('wotblitz.auth.login: redirect_uri is required'));

		return request({
			hostname: hosts.wot,
			path: '/wot/auth/login/'
		}, {
			display: display,
			expires_at: expires_at,
			nofollow: typeof nofollow === 'undefined' || nofollow ? 1 : 0,
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
		if (!access_token) return Promise.reject(new Error('wotblitz.auth.prolongate: access_token is required'));

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
		if (!access_token) return Promise.reject(new Error('wotblitz.auth.logout: access_token is required'));

		return request({
			hostname: hosts.wot,
			path: '/wot/auth/logout/'
		}, {
			access_token: access_token
		});
	}
});

clanmessages = request => ({
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
	 * @param {number|date} [filters.expires_after] only messages on or after this date (unix or ISO)
	 * @param {string} [filters.importance] only messages with this level, values "important" or "standard"
	 * @param {string} [filters.status] only messages with this status, values "active" or "deleted"
	 * @param {string} [filters.type] only messages of this type, values "general", "training", "meeting", or "battle"
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to a message board object
	 */
	messages: function(access_token, message_id, filters, fields) {
		if (!access_token) return Promise.reject(new Error('wotblitz.clanmessages.messages: access_token is required'));

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
		if (!expires_at) return Promise.reject(new Error('wotblitz.clanmessages.create: all arguments are required'));

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
		if (!message_id) return Promise.reject(new Error('wotblitz.clanmessages.delete: all arguments are required'));

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
		if (!action) return Promise.reject(new Error('wotblitz.clanmessages.like: all arguments are required'));

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
		if (!access_token) return Promise.reject(new Error('wotblitz.clanmessages.likes: access_token is required'));
		if (!message_id) return Promise.reject(new Error('wotblitz.clanmessages.likes: message_id is required'));

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
		if (!access_token) return Promise.reject(new Error('wotblitz.clanmessages.update: access_token is required'));
		if (!message_id) return Promise.reject(new Error('wotblitz.clanmessages.update: message_id is required'));

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
});

clans = request => ({
	/**
	 * List of clans with minimal details.
	 *
	 * @param {string} [search] filter by clan name or tag
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
		if (!clan_id) return Promise.reject(new Error('wotblitz.clans.info: clan_id is required'));

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
		if (!account_id) return Promise.reject(new Error('wotblitz.clans.accountinfo: account_id is required'));

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
});

encyclopedia = request => ({
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
	 * @param {string} [profile_id] shorthand returned by the "vehicleprofiles" route
	 * @param {Object} [modules] specify modules individually (overrides profile_id)
	 * @param {number} [modules.engine_id] which engine module to select
	 * @param {number} [modules.gun_id] which gun module to select
	 * @param {number} [modules.suspension_id] which suspension module to select
	 * @param {number} [modules.turret_id] which turret module to select
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>} resolves to exact vehicle information
	 */
	vehicleprofile: function(tank_id, profile_id, modules, fields) {
		if (!tank_id) return Promise.reject(new Error('wotblitz.encyclopedia.vehicleprofile: tank_id is required'));

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
		if (!tank_id) return Promise.reject(new Error('wotblitz.encyclopedia.vehicleprofiles: tank_id is required'));

		return request({
			hostname: hosts.wotb,
			path: '/wotb/encyclopedia/vehicleprofiles/'
		}, {
			tank_id: tank_id.toString(),
			order_by: order_by,
			fields: fields ? fields.toString() : ''
		});
	}
});

servers = request => ({
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
});

tanks = request => ({
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
		if (!account_id) return Promise.reject(new Error('wotblitz.tanks.stats: account_id is required'));

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
		if (!account_id) return Promise.reject(new Error('wotblitz.tanks.achievements: account_id is required'));

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
});

tournaments = request => ({
	/**
	 * List of all tournaments.
	 *
	 * @param {Object} [options]
	 * @param {string} [options.search]
	 * @param {string|string[]} [options.status]
	 * @param {number} [options.page_no]
	 * @param {number} [options.limit]
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>}
	 */
	list: function(options, fields) {
		options = Object.assign({
			search: null,
			status: null,
			page_no: null,
			limit: null
		}, options, {
			fields: fields ? fields.toString() : ''
		});

		if (Array.isArray(options.status)) options.status = options.status.toString();

		return request({
			hostname: hosts.wotb,
			path: '/wotb/tournaments/list/'
		}, options);
	},
	/**
	 * @param {number|number[]} tournament_id
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>}
	 */
	info: function(tournament_id, fields) {
		if (!tournament_id) return Promise.reject(new Error('wotblitz.tournaments.info: tournament_id is required'));

		return request({
			hostname: hosts.wotb,
			path: '/wotb/tournaments/info/'
		}, {
			tournament_id: tournament_id.toString(),
			fields: fields ? fields.toString() : ''
		});
	},
	/**
	 * @param {number} tournament_id
	 * @param {Object} [options]
	 * @param {number|number[]} [options.account_id]
	 * @param {number|number[]} [options.clan_id]
	 * @param {number|number[]} [options.team_id]
	 * @param {string|string[]} [options.status]
	 * @param {string} [options.search]
	 * @param {number} [options.page_no]
	 * @param {number} [options.limit]
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>}
	 */
	teams: function(tournament_id, options, fields) {
		if (!tournament_id) return Promise.reject(new Error('wotblitz.tournaments.teams: tournament_id is required'));

		options = Object.assign({
			account_id: null,
			clan_id: null,
			team_id: null,
			status: null,
			search: null,
			page_no: null,
			limit: null
		}, options, {
			tournament_id: tournament_id,
			fields: fields ? fields.toString() : ''
		});

		if (Array.isArray(options.account_id)) options.account_id = options.account_id.toString();
		if (Array.isArray(options.clan_id)) options.clan_id = options.clan_id.toString();
		if (Array.isArray(options.team_id)) options.team_id = options.team_id.toString();
		if (Array.isArray(options.status)) options.status = options.status.toString();

		return request({
			hostname: hosts.wotb,
			path: '/wotb/tournaments/teams/'
		}, options);
	},
	/**
	 * @param {number} tournament_id
	 * @param {Object} [options]
	 * @param {number} [options.page_no]
	 * @param {number} [options.limit]
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>}
	 */
	stages: function(tournament_id, options, fields) {
		if (!tournament_id) return Promise.reject(new Error('wotblitz.tournaments.stages: tournament_id is required'));

		options = Object.assign({
			page_no: null,
			limit: null
		}, options, {
			tournament_id: tournament_id,
			fields: fields ? fields.toString() : ''
		});

		return request({
			hostname: hosts.wotb,
			path: '/wotb/tournaments/stages/'
		}, options);
	},
	/**
	 * @param {number} tournament_id
	 * @param {number} stage_id
	 * @param {Object} [options]
	 * @param {number|number[]} [options.team_id]
	 * @param {number|number[]} [options.group_id]
	 * @param {number|number[]} [options.round_number]
	 * @param {number} [options.page_no]
	 * @param {number} [options.limit]
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>}
	 */
	matches: function(tournament_id, stage_id, options, fields) {
		if (!tournament_id) return Promise.reject(new Error('wotblitz.tournaments.matches: tournament_id is required'));
		if (!stage_id) return Promise.reject(new Error('wotblitz.tournaments.matches: stage_id is required'));

		options = Object.assign({
			team_id: null,
			group_id: null,
			round_number: null,
			page_no: null,
			limit: null
		}, options, {
			tournament_id: tournament_id,
			stage_id: stage_id,
			fields: fields ? fields.toString() : ''
		});

		if (Array.isArray(options.team_id)) options.team_id = options.team_id.toString();
		if (Array.isArray(options.group_id)) options.group_id = options.group_id.toString();
		if (Array.isArray(options.round_number)) options.round_number = options.round_number.toString();

		return request({
			hostname: hosts.wotb,
			path: '/wotb/tournaments/matches/'
		}, options);
	},
	/**
	 * @param {number} tournament_id
	 * @param {Object} [options]
	 * @param {number|number[]} [options.team_id]
	 * @param {number} [options.from_position]
	 * @param {number} [options.to_position]
	 * @param {number} [options.page_no]
	 * @param {number} [options.limit]
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>}
	 */
	standings: function(tournament_id, options, fields) {
		if (!tournament_id) return Promise.reject(new Error('wotblitz.tournaments.standings: tournament_id is required'));

		options = Object.assign({
			team_id: null,
			from_position: null,
			to_position: null,
			page_no: null,
			limit: null
		}, options, {
			tournament_id: tournament_id,
			fields: fields ? fields.toString() : ''
		});

		if (Array.isArray(options.team_id)) options.team_id = options.team_id.toString();

		return request({
			hostname: hosts.wotb,
			path: '/wotb/tournaments/standings/'
		}, options);
	},
	/**
	 * @param {number} tournament_id
	 * @param {number} stage_id
	 * @param {Object} [options]
	 * @param {number|number[]} [options.group_id]
	 * @param {number} [options.page_no]
	 * @param {number} [options.limit]
	 * @param {string|string[]} [fields] response selection
	 * @returns {Promise<Object>}
	 */
	tables: function(tournament_id, stage_id, options, fields) {
		if (!tournament_id) return Promise.reject(new Error('wotblitz.tournaments.tables: tournament_id is required'));
		if (!stage_id) return Promise.reject(new Error('wotblitz.tournaments.tables: stage_id is required'));

		options = Object.assign({
			group_id: null,
			page_no: null,
			limit: null
		}, options, {
			tournament_id: tournament_id,
			stage_id: stage_id,
			fields: fields ? fields.toString() : ''
		});

		if (Array.isArray(options.group_id)) options.group_id = options.group_id.toString();

		return request({
			hostname: hosts.wotb,
			path: '/wotb/tournaments/tables/'
		}, options);
	}
});

export = create;
