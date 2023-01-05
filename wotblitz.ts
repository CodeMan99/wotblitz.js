/* eslint-disable no-unused-vars */
import Request from './request.js';

type RequestConstructorParams = ConstructorParameters<typeof Request>;
type ExecuteRequest = Request['execute'];

type AuthenticationRequired<T> = T | null;

type AccountId = string | number;
type AccessToken = string;
type Field = string;
type TankId = string | number;

type AccountStatistics = {
	spotted: number;
	max_frags_tank_id: number;
	hits: number;
	max_xp: number;
	max_xp_tank_id: number;
	wins: number;
	losses: number;
	capture_points: number;
	battles: number;
	damage_dealt: number;
	max_frags: number;
	shots: number;
	frags8p: number;
	xp: number;
	win_and_survived: number;
	survived_battles: number;
	dropped_capture_points: number;
};

type AccountAPI = {
	list: (
		search: string,
		type?: 'startswith' | 'exact' | null,
		limit?: number | null,
		fields?: Field | Field[]
	) => Promise<Array<{nickname: string; account_id: number}>>;

	info: (
		account_id: AccountId | AccountId[],
		access_token?: AccessToken | null,
		extra?: 'private.grouped_contacts' | null,
		fields?: Field | Field[]
	) => Promise<Record<AccountId, {
		statistics: {
			clan: AccountStatistics;
			all: AccountStatistics;
			frags: AuthenticationRequired<Record<TankId, number>>;
		};
		account_id: number;
		created_at: number;
		updated_at: number;
		private: AuthenticationRequired<{
			restrictions: {
				chat_ban_time: number | null;
			};
			grouped_contacts: {
				ungrouped: number[];
				// TODO: this type is a guess, not sure WarGaming actually implemented this
				groups: Record<string, AccountId>;
				blocked: number[];
			};
			gold: number;
			free_xp: number;
			ban_time: number | null;
			is_premium: boolean;
			credits: number;
			premium_expires_at: number;
			battle_life_time: number;
			ban_info: string | null;
		}>;
		last_battle_time: number;
		nickname: string;
	}>>;

	achievements: (
		account_id: AccountId | AccountId[],
		fields?: Field | Field[]
	) => Promise<Record<AccountId, {
		achievments: Record<string, number>;
		max_series: Record<string, number>;
	}>>;

	tankstats: (
		account_id: AccountId | AccountId[],
		tank_id: TankId,
		fields?: Field | Field[]
	) => Promise<Record<AccountId, {
		all: {
			spotted: number;
			hits: number;
			frags: number;
			max_xp: number;
			wins: number;
			losses: number;
			capture_points: number;
			battles: number;
			damage_dealt: number;
			damage_received: number;
			max_frags: number;
			shots: number;
			frags8p: number;
			xp: number;
			win_and_survived: number;
			survived_battles: number;
			dropped_capture_points: number;
		};
		last_battle_time: number;
		account_id: number;
		mark_of_mastery: number;
		battle_life_time: number;
		tank_id: number;
	}>>;
};

type AuthAPI = {
	login: (
		redirect_uri: string,
		nofollow?: 0 | 1,
		expires_at?: number,
		display?: 'page' | 'popup'
	) => Promise<{
		location: string;
	}>;

	prolongate: (
		access_token: AccessToken,
		expires_at: number
	) => Promise<{
		access_token: AccessToken;
		account_id: number;
		expires_at: number;
	}>;

	logout: (access_token: AccessToken) => Promise<{}>;
};

type ClanMessageOrderBy =
	'importance' | 'created_at' | 'updated_at' | 'type';
type InvertOrderBy<T extends string> = `-${T}`;
type MessageType =
	'general' | 'training' | 'meeting' | 'battle';
type MessageImportance = 'important' | 'standard';

type ClanMessagesAPI = {
	messages: (
		access_token: AccessToken,
		message_id?: number,
		filters?: {
			page_no?: number;
			limit?: number;
			order_by?: ClanMessageOrderBy | InvertOrderBy<ClanMessageOrderBy>;
			expires_before?: number | Date;
			expires_after?: number | Date;
			importance?: MessageImportance;
			status?: 'active' | 'deleted';
			type?: MessageType;
		},
		fields?: Field | Field[]
	) => Promise<Array<{
		author_id: number;
		clan_id: number;
		editor_id: number;
		expires_at: number;
		importance: MessageImportance;
		likes: number;
		message: string;
		message_id: number;
		title: string;
		type: MessageType;
		updated_at: number;
	}>>;

	create: (
		access_token: AccessToken,
		title: string,
		text: string,
		type: MessageType,
		importance: MessageImportance,
		expires_at: number
	) => Promise<{message_id: number}>;

	delete: (
		access_token: AccessToken,
		message_id: number
	) => Promise<{}>;

	like: (
		access_token: AccessToken,
		message_id: number,
		action: 'add' | 'remove'
	) => Promise<{}>;

	likes: (
		access_token: AccessToken,
		message_id: number,
		fields?: Field | Field[]
	) => Promise<Array<{
		account_id: number;
		liked_at: number;
	}>>;

	update: (
		access_token: AccessToken,
		message_id: number,
		title?: string,
		text?: string,
		type?: MessageType,
		importance?: MessageImportance,
		expires_at?: number
	) => Promise<{message_id: number}>;
};

type ClanId = number | string;
type ClanRole = 'private' | 'commander' | 'executive_officer';

type ClansAPI = {
	list: (
		search?: string,
		page_no?: number,
		limit?: number,
		fields?: Field | Field[]
	) => Promise<Array<{
		members_count: number;
		created_at: number;
		clan_id: number;
		tag: string;
		name: string;
	}>>;

	info: (
		clan_id: ClanId | ClanId[],
		extra?: 'members' | 'members'[] | null,
		fields?: Field | Field[]
	) => Promise<Record<ClanId, {
		recruiting_options: {
			vehicles_level: number;
			wins_ratio: number;
			average_battles_per_day: number;
			battles: number;
			average_damage: number;
		};
		members_count: number;
		name: string;
		creator_name: string;
		clan_id: number;
		created_at: number;
		updated_at: number;
		leader_name: string;
		members_ids: number[];
		members?: Record<AccountId, {
			role: ClanRole;
			joined_at: number;
			account_id: number;
			account_name: string;
		}>;
		recruiting_policy: string;
		tag: string;
		is_clan_disbanded: boolean;
		old_name: string | null;
		emblem_set_id: number;
		creator_id: number;
		motto: string;
		renamed_at: number | null;
		old_tag: string | null;
		leader_id: number;
		description: string;
	}>>;

	accountinfo: (
		account_id: AccountId | AccountId[],
		extra?: 'clan' | 'clan'[] | null,
		feilds?: Field | Field[]
	) => Promise<Record<AccountId, {
		clan?: {
			members_count: 20;
			name: string;
			created_at: number;
			tag: string;
			clan_id: number;
			emblem_set_id: number;
		};
		account_id: number;
		joined_at: number;
		clan_id: number;
		role: ClanRole;
		account_name: string;
	}>>;

	glossary: (fields?: Field | Field[]) => Promise<{
		clan_roles: Record<ClanRole, string>;
		settings: {
			max_members_count: number;
		}
	}>;
};

type VehicleModuleId = number | string;
type VehicleModuleType =
	| 'vehicleChassis'
	| 'vehicleTurret'
	| 'vehicleGun'
	| 'vehicleEngine';
type ShellType =
	| 'ARMOR_PIERCING'
	| 'ARMOR_PIERCING_CR'
	| 'HIGH_EXPLOSIVE'
	| 'HOLLOW_CHARGE';
type VehicleModule = {
	name: string;
	module_id: number;
	type: VehicleModuleType;
	next_modules: number[] | null;
	next_tanks: number[] | null;
	is_default: boolean;
	price_xp: number;
	price_credit: number;
};
type VehicleArmor = {
	front: number;
	sides: number;
	rear: number;
};
type VehicleProfileId = `${number}-${number}-${number}-${number}`;
type ModuleEngine = {
	fire_chance: number;
	name: string;
	power: number;
	tier: number;
	weight: number;
};
type ModuleGun = {
	aim_time: number;
	caliber: number;
	clip_capacity: number;
	clip_reload_time: number;
	dispersion: number;
	fire_rate: number;
	move_down_arc: number;
	move_up_arc: number;
	name: string;
	reload_time: number;
	tier: number;
	traverse_speed: number;
	weight: number;
};
type ModuleSuspension = {
	load_limit: number;
	name: string;
	tier: number;
	traverse_speed: number;
	weight: number;
};
type ModuleTurret = {
	hp: number;
	name: string;
	tier: number;
	traverse_left_arc: number;
	traverse_right_arc: number;
	traverse_speed: number;
	view_range: number;
	weight: number;
};
type ModuleCommon = {
	module_id: number;
	name: string;
	nation: string;
	tanks: number[];
	tier: number;
	weight: number;
};
type Module<T, P extends keyof T> = ModuleCommon & Pick<T, P>;
type VehicleProfile = {
	profile_id: VehicleProfileId;
	engine_id: number;
	gun_id: number;
	suspension_id: number;
	turret_id: number;
	is_default: boolean;
	armor: {
		hull: VehicleArmor;
		turret: VehicleArmor;
	};
	engine: ModuleEngine;
	gun: ModuleGun;
	shells: Array<{
		type: ShellType;
		penetation: number;
		damage: number;
	}>;
	suspension: ModuleSuspension;
	turret: ModuleTurret;
	battle_level_range_max: number;
	battle_level_range_min: number;
	firepower: number;
	hp: number;
	hull_hp: number;
	hull_weight: number;
	maneuverability: number;
	max_ammo: number;
	max_weight: number;
	protection: number;
	shot_efficiency: number;
	signal_range: number | null;
	speed_backward: number;
	speed_forward: number;
	weight: number;
};
type VehicleType =
	| 'AT-SPG'
	| 'heavyTank'
	| 'lightTank'
	| 'mediumTank';

type EncyclopediaAPI = {
	vehicles: (
		tank_id?: TankId | TankId[] | null,
		nation?: string | string[] | null,
		fields?: Field | Field[]
	) => Promise<Record<TankId, {
		name: string;
		description: string;
		nation: string;
		tier: number;
		tank_id: number;
		type: VehicleType;
		is_premium: boolean;
		images: {
			preview: string;
			normal: string;
		};
		cost: {
			price_credit: number;
			price_gold: number;
		};
		engines: number[];
		guns: number[];
		suspensions: number[];
		turrets: number[];
		prices_xp: Record<TankId, number> | null;
		next_tanks: Record<TankId, number> | null;
		modules_tree: Record<VehicleModuleId, VehicleModule>;
		default_profile: VehicleProfile;
	}>>;

	vehicleprofile: (
		tank_id: TankId,
		profile_id?: VehicleProfileId,
		modules?: {
			engine_id?: number;
			gun_id?: number;
			suspension_id?: number;
			turret_id?: number;
		},
		fields?: Field | Field[]
	) => Promise<Record<TankId, VehicleProfile>>;

	// TODO this stub is incomplete, missing 'nation' & 'type' arguments
	modules: (
		module_id?: number | Array<number> | null,
		fields?: Field | Field[]
	) => Promise<{
		engines: Array<Module<ModuleEngine, 'power' | 'fire_chance'>>;
		guns: Array<Module<ModuleGun, 'dispersion' | 'aim_time'> & {
			shells: Array<{
				type: ShellType;
				penetration: number;
				damage: number;
			}>;
		}>;
		suspensions: Array<Module<ModuleSuspension, 'load_limit' | 'traverse_speed'>>;
		turrets: Array<Module<ModuleTurret, 'view_range' | 'hp' | 'traverse_left_arc' | 'traverse_right_arc'> & {
			armor: VehicleArmor;
		}>;
	}>;

	provisions: (
		tank_id?: TankId | TankId[] | null,
		provision_id?: number | number[] | null,
		type?: 'optionalDevice' | 'equipment' | null,
		fields?: Field | Field[]
	) => Promise<Record<string, {
		price_gold: number;
		provision_id: number;
		price_credit: number;
		tanks: number[];
		name_i18n: string;
		type: 'optionalDevice' | 'equipment';
		description_i18n: string;
	}>>;

	info: (
		fields?: Field | Field[]
	) => Promise<{
		achievement_sections: Record<string, {
			name: string;
			order: number;
		}>;
		tanks_updated_at: number;
		languages: Record<string, string>;
		vehicle_types: Record<VehicleType, string>;
		vehicle_nations: Record<string, string>;
		game_version: string;
	}>;

	achievements: (
		fields?: Field | Field[]
	) => Promise<Record<string, {
		achievment_id: string;
		name: string;
		image: string | null;
		image_big: string | null;
		section: string;
		options: Array<{
			name: string;
			image: string;
			image_big: string;
			description: string;
		}> | null;
		order: number | null;
		condition: string;
		description: string;
	}>>;

	// TODO return type, this route is returning "504 Source not Available"
	crewskills: (
		skill_id?: string | string[] | null,
		vehicle_type?: string | string[] | null,
		fields?: Field | Field[]
	) => Promise<any>;

	// NOTE - this route does not return all fields of the VehicleProfile.
	vehicleprofiles: (
		tank_id: TankId | TankId[],
		order_by?: 'price_credit' | '-price_credit',
		fields?: Field | Field[]
	) => Promise<Record<TankId, Array<VehicleProfile & {
		tank_id: number;
		price_credit: number;
		price_xp: number;
	}>>>;
};

type GameServerName =
	| 'wot'
	| 'wotb'
	| 'wows';

type ServerInfo = {
	players_online: number;
	server: string;
};

type ServersAPI = {
	info: (
		game?: GameServerName | GameServerName[] | null,
		fields?: Field | Field[]
	) => Promise<Record<GameServerName, ServerInfo[]>>;
};

type TanksAPI = {
	stats: (
		account_id: AccountId,
		access_token?: AccessToken | null,
		tank_id?: TankId | TankId[] | null,
		in_garage?: '1' | '0' | null,
		fields?: Field | Field[]
	) => Promise<Record<AccountId, {
		all: {
			spotted: number;
			hits: number;
			frags: number;
			max_xp: number;
			wins: number;
			losses: number;
			capture_points: number;
			battles: number;
			damage_dealt: number;
			damage_received: number;
			max_frags: number;
			shots: number;
			frags8p: number;
			xp: number;
			win_and_survived: number;
			survived_battles: number;
			dropped_capture_points: number;
		};
		last_battle_time: number;
		account_id: number;
		max_xp: number;
		in_garage_updated: number;
		max_frags: number;
		frags: AuthenticationRequired<Record<TankId, number>>;
		mark_of_mastery: number;
		battle_life_time: number;
		in_garage: AuthenticationRequired<boolean>;
		tank_id: number;
	}>>;

	achievements: (
		account_id: AccountId,
		access_token?: AccessToken | null,
		tank_id?: TankId | TankId[] | null,
		in_garage?: '1' | '0' | null,
		fields?: Field | Field[]
	) => Promise<Record<AccountId, Array<{
		achievements: Record<string, number>;
		max_series: Record<string, number>;
		account_id: number;
		tank_id: number;
	}>>>;
};

type TournamentId = number | string;
type TournamentStatus =
	| 'upcoming'
	| 'registration_started'
	| 'registration_finished'
	| 'running'
	| 'finished'
	| 'complete';
type TournamentCurrency =
	| 'credits'
	| 'gold'
	| 'Free XP';
type TournamentTeamStatus =
	| 'forming'
	| 'confirmed'
	| 'disqualified';

type TournamentsAPI = {
	list: (
		options?: {
			// TODO drop `null` from these unions
			search?: string | null;
			status?: TournamentStatus | TournamentStatus[] | null;
			page_no?: number | null;
			limit?: number | null;
		} | null,
		fields?: Field | Field[]
	) => Promise<Array<{
		tournament_id: number;
		fee: {
			currency: TournamentCurrency | null;
			amount: number | null;
		};
		award: {
			currency: TournamentCurrency | null;
			amount: number | null;
		};
		winner_award: {
			currency: TournamentCurrency | null;
			amount: number | null;
		};
		description: string;
		end_at: number;
		logo: {
			preview: string;
			original: string;
		};
		matches_start_at: number | null;
		registration_end_at: number;
		registration_start_at: number;
		start_at: number;
		status: TournamentStatus;
		title: string;
	}>>;

	info: (
		tournament_id: TournamentId | TournamentId[],
		fields?: Field | Field[]
	) => Promise<Record<TournamentId, {
		tournament_id: number;
		fee: {
			currency: TournamentCurrency | null;
			amount: number | null;
		};
		award: {
			currency: TournamentCurrency | null;
			amount: number | null;
		};
		winner_award: {
			currency: TournamentCurrency | null;
			amount: number | null;
		};
		description: string;
		end_at: number;
		logo: {
			preview: string;
			original: string;
		};
		matches_start_at: number | null;
		max_players_count: number;
		media_links: Array<{
			id: string;
			image: string;
			kind: string;
			url: string;
		}> | null;
		min_players_count: number;
		other_rules: string | null;
		prize_description: string | null;
		registration_end_at: number;
		registration_starts_at: number;
		rules: string;
		start_at: number;
		status: TournamentStatus;
		teams: {
			max: number;
			confirmed: number | null;
			total: number;
			min: number | null;
		};
		title: string;
	}>>;

	teams: (
		tournament_id: TournamentId,
		options?: {
			// TODO drop `null` from these unions
			account_id?: AccountId | AccountId[] | null;
			clan_id?: ClanId | ClanId[] | null;
			team_id?: number | string | number[] | string[] | null;
			status?: TournamentTeamStatus | TournamentTeamStatus[] | null;
			search?: string | null;
			page_no?: number | null;
			limit?: number | null;
		} | null,
		fields?: Field | Field[]
	) => Promise<Array<{
		clan_id: number;
		team_id: number;
		tournament_id: number;
		status: TournamentTeamStatus;
		title: string;
		players: Array<{
			account_id: number;
			image: string | null;
			name: string;
			role: 'owner' | null;
		}>;
	}>>;

	stages: (
		tournament_id: TournamentId,
		options?: {
			// TODO drop `null` from these unions
			page_no?: number | null;
			limit?: number | null;
		} | null,
		fields?: Field | Field[]
	) => Promise<any>;

	matches: (
		tournament_id: TournamentId,
		stage_id: number,
		options?: {
			// TODO drop `null` from these unions
			team_id?: number | string | number[] | string[] | null;
			group_id?: number | string | number[] | string[] | null;
			round_number?: number | string | number[] | string[] | null;
			page_no?: number | null;
			limit?: number | null;
		} | null,
		fields?: Field | Field[]
	) => Promise<any>;

	standings: (
		tournament_id: TournamentId,
		options?: {
			// TODO drop `null` from these unions
			team_id?: number | string | number[] | string[] | null;
			from_position?: number | null;
			to_position?: number | null;
			page_no?: number | null;
			limit?: number | null;
		} | null,
		fields?: Field | Field[]
	) => Promise<any>;

	tables: (
		tournament_id: TournamentId,
		stage_id: number,
		options?: {
			// TODO drop `null` from these unions
			group_id?: number | string | number[] | string[] | null;
			page_no?: number | null;
			limit?: number | null;
		} | null,
		fields?: Field | Field[]
	) => Promise<any>;
};

type WarGamingApplication = {
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

const create: (...args: RequestConstructorParams) => WarGamingApplication = (application_id, region, language) => {
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
		}
	};

	Object.defineProperty(wotblitz, 'request', {enumerable: false});

	return wotblitz;
};

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

		if (Array.isArray(options.status)) options.status = options.status.toString() as TournamentStatus;

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
		if (Array.isArray(options.status)) options.status = options.status.toString() as TournamentTeamStatus;

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
