var mockery = require('mockery');
var querystring = require('querystring');
var test = require('tape');
var fetch = {};

// synchronous promise utils to avoid the need for sub-tests
Promise = function() { throw new Error('Promise constructor not implemented for tests'); };
Promise.resolve = value => {
	return {then: resolve => resolve(value)};
};
Promise.reject = value => {
	return {then: (_, reject) => reject(value)};
};

mockery.registerAllowable('../wotblitz.js');
mockery.registerAllowable('./request.js');
mockery.registerAllowable('util');
mockery.registerMock('node-fetch', (url, options) => {
	fetch.url = url;
	fetch.options = options;

	return Promise.resolve({
		json: () => Promise.resolve({status: 'ok'})
	});
});
mockery.registerMock('querystring', {
	stringify: obj => querystring.parse(querystring.stringify(obj))
});
mockery.enable({useCleanCache: true});

var wotblitz = require('../wotblitz.js')();

mockery.disable();
mockery.deregisterAll();

test('wotblitz', t => {
	var failure = () => t.fail('unexpected promise resolve');

	wotblitz.application_id = 'wotblitztest';
	t.equal(wotblitz.application_id, wotblitz.request.application_id, '.application_id pass through to .request.application_id');
	t.equal(wotblitz.language, wotblitz.request.language, '.language pass through to .request.language');
	t.equal(wotblitz.region, wotblitz.request.region, '.region pass through to .request.region');

	wotblitz.auth.login().then(failure, error => {
		t.equal(error && error.message, 'wotblitz.auth.login: redirect_uri is required', 'rejects without a redirect_uri');
	});

	wotblitz.auth.login('http:\/\/localhost:8888');
	t.equal(fetch.url, 'https:\/\/api.worldoftanks.com/wot/auth/login/', '.auth.login url');
	t.equal(fetch.options.method, 'POST', '.auth.login method');
	t.equal(fetch.options.body.redirect_uri, 'http:\/\/localhost:8888', '.auth.login redirect_uri');
	t.equal(fetch.options.body.nofollow, '1', '.auth.login default nofollow');
	t.equal(fetch.options.body.expires_at, '', '.auth.login default expires_at');
	t.equal(fetch.options.body.display, '', '.auth.login default page');

	wotblitz.auth.login('http:\/\/localhost:8080', 0, 1209600, 'page');
	t.equal(fetch.options.body.redirect_uri, 'http:\/\/localhost:8080', '.auth.login redirect_uri');
	t.equal(fetch.options.body.nofollow, '0', '.auth.login nofollow');
	t.equal(fetch.options.body.expires_at, '1209600', '.auth.login expires_at');
	t.equal(fetch.options.body.display, 'page', '.auth.login page');

	wotblitz.auth.prolongate().then(failure, error => {
		t.equal(error && error.message, 'wotblitz.auth.prolongate: access_token is required', 'rejects without an access_token');
	});

	wotblitz.auth.prolongate('b608c5293fdc496db8fc238151b9a47283ae183c');
	t.equal(fetch.url, 'https:\/\/api.worldoftanks.com/wot/auth/prolongate/', '.auth.prolongate url');
	t.equal(fetch.options.method, 'POST', '.auth.prolongate method');
	t.equal(fetch.options.body.access_token, 'b608c5293fdc496db8fc238151b9a47283ae183c', '.auth.prolongate access_token');
	t.equal(fetch.options.body.expires_at, '1209600', '.auth.prolongate default expires_at');

	wotblitz.auth.prolongate('7711f8894ea0430fb030502662fab980622aa2f9', 604800);
	t.equal(fetch.options.body.access_token, '7711f8894ea0430fb030502662fab980622aa2f9', '.auth.prolongate access_token');
	t.equal(fetch.options.body.expires_at, '604800', '.auth.prolongate expires_at');

	wotblitz.auth.logout().then(failure, error => {
		t.equal(error && error.message, 'wotblitz.auth.logout: access_token is required', 'rejects without an access_token');
	});

	wotblitz.auth.logout('6c2f7b7eba9f4b359bf5f511d48c6bed269ac37e');
	t.equal(fetch.url, 'https:\/\/api.worldoftanks.com/wot/auth/logout/', '.auth.logout url');
	t.equal(fetch.options.method, 'POST', '.auth.logout method');
	t.equal(fetch.options.body.access_token, '6c2f7b7eba9f4b359bf5f511d48c6bed269ac37e', '.auth.logout access_token');

	wotblitz.servers.info();
	t.equal(fetch.url, 'https:\/\/api.worldoftanks.com/wgn/servers/info/', '.servers.info url');
	t.equal(fetch.options.method, 'POST', '.servers.info requst method');
	t.equal(fetch.options.body.game, '', '.servers.info game default');
	t.equal(fetch.options.body.fields, '', '.servers.info fields default');

	wotblitz.servers.info('wotb', 'players_online');
	t.equal(fetch.options.body.game, 'wotb', '.servers.info game specifed with string');
	t.equal(fetch.options.body.fields, 'players_online', '.servers.info fields specified with string');

	wotblitz.servers.info(['wotb', 'wot'], ['players_online', 'server']);
	t.equal(fetch.options.body.game, 'wotb,wot', '.servers.info game specified with array');
	t.equal(fetch.options.body.fields, 'players_online,server', '.servers.info game specified with array');

	wotblitz.account.list().then(failure, error => {
		t.equal(error && error.message, 'wotblitz.account.list: search is required', 'rejects without a search value');
	});

	wotblitz.account.list('user');
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/account/list/', '.account.list url');
	t.equal(fetch.options.method, 'POST', '.accout.list method');
	t.equal(fetch.options.body.search, 'user', '.account.list search');
	t.equal(fetch.options.body.type, '', '.account.list default type');
	t.equal(fetch.options.body.limit, '', '.account.list default limit');
	t.equal(fetch.options.body.fields, '', '.account.list default fields');

	wotblitz.account.list('player', 'exact', 1, 'account_id');
	t.equal(fetch.options.body.search, 'player', '.account.list search');
	t.equal(fetch.options.body.type, 'exact', '.account.list type');
	t.equal(fetch.options.body.limit, '1', '.account.list limit');
	t.equal(fetch.options.body.fields, 'account_id', '.account.list fields');

	wotblitz.account.list('userplayer', null, null, ['account_id', 'nickname']);
	t.equal(fetch.options.body.search, 'userplayer', '.account.list search');
	t.equal(fetch.options.body.type, '', '.account.list unspecified type');
	t.equal(fetch.options.body.limit, '', '.account.list unspecified limit');
	t.equal(fetch.options.body.fields, 'account_id,nickname', '.account.list fields specified with array');

	wotblitz.account.info().then(failure, error => {
		t.equal(error && error.message, 'wotblitz.account.info: account_id is required', 'rejects without an account_id');
	});

	wotblitz.account.info('1009922015');
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/account/info/', '.account.info url');
	t.equal(fetch.options.method, 'POST', '.account.info method');
	t.equal(fetch.options.body.account_id, '1009922015', '.account.info account_id');
	t.equal(fetch.options.body.access_token, '', '.account.info default access_token');
	t.equal(fetch.options.body.extra, '', '.account.info default extra');
	t.equal(fetch.options.body.fields, '', '.account.info default fields');

	wotblitz.account.info('1009922017',
		'45e2342270970bd79718f9b94efcbf4c090ea73f',
		'private.grouped_contacts',
		'private.grouped_contacts');
	t.equal(fetch.options.body.account_id, '1009922017', '.account.info account_id');
	t.equal(fetch.options.body.access_token, '45e2342270970bd79718f9b94efcbf4c090ea73f', '.account.info access_token');
	t.equal(fetch.options.body.extra, 'private.grouped_contacts', '.account.info extra');
	t.equal(fetch.options.body.fields, 'private.grouped_contacts', '.account.info fields');

	wotblitz.account.info('1009922018', null, null, 'last_battle_time');
	t.equal(fetch.options.body.account_id, '1009922018', '.account.info account_id');
	t.equal(fetch.options.body.access_token, '', '.account.info unspecified access_token');
	t.equal(fetch.options.body.extra, '', '.account.info unspecified extra');
	t.equal(fetch.options.body.fields, 'last_battle_time', '.account.info fields');

	wotblitz.account.info(['1009922019', '1009922020'], null, ['private.grouped_contacts'], [
		'last_battle_time',
		'statistics.all',
		'private.grouped_contacts'
	]);
	t.equal(fetch.options.body.account_id, '1009922019,1009922020', '.account.info multiple account_id');
	t.equal(fetch.options.body.access_token, '', '.account.info unspecified access_token');
	t.equal(fetch.options.body.extra, 'private.grouped_contacts', '.account.info multiple extra');
	t.equal(fetch.options.body.fields, 'last_battle_time,statistics.all,private.grouped_contacts', '.account.info multiple fields');

	wotblitz.account.achievements().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.account.achievements: account_id is required',
			'.account.achievements missing account_id');
	});

	wotblitz.account.achievements('1009922021');
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/account/achievements/', '.account.achievements url');
	t.equal(fetch.options.method, 'POST', '.account.achievements method');
	t.equal(fetch.options.body.account_id, '1009922021', '.account.achievements account_id');
	t.equal(fetch.options.body.fields, '', '.account.achievements default fields');

	wotblitz.account.achievements('1009922022', 'max_series');
	t.equal(fetch.options.body.account_id, '1009922022', '.account.achievements account_id');
	t.equal(fetch.options.body.fields, 'max_series', '.account.achievements fields');

	wotblitz.account.achievements(['1009922023', '1009922024'], ['achievements', 'max_series']);
	t.equal(fetch.options.body.account_id, '1009922023,1009922024', '.account.achievements multiple account_id');
	t.equal(fetch.options.body.fields, 'achievements,max_series', '.account.achievements multiple fields');

	wotblitz.account.tankstats().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.account.tankstats: account_id is required',
			'.account.tankstats missing account_id');
	});

	wotblitz.account.tankstats('1009922045').then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.account.tankstats: tank_id is required',
			'.account.tankstats missing tank_id');
	});

	wotblitz.account.tankstats('1009922050', '1');
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/account/tankstats/', '.account.tankstats url');
	t.equal(fetch.options.method, 'POST', '.account.tankstats method');
	t.equal(fetch.options.body.account_id, '1009922050', '.account.tankstats account_id');
	t.equal(fetch.options.body.tank_id, '1', '.account.tankstats tank_id');
	t.equal(fetch.options.body.fields, '', '.account.tankstats default fields');

	wotblitz.account.tankstats('1009922051', '2657', 'all.max_frags');
	t.equal(fetch.options.body.account_id, '1009922051', '.account.tankstats account_id');
	t.equal(fetch.options.body.tank_id, '2657', '.account.tankstats tank_id');
	t.equal(fetch.options.body.fields, 'all.max_frags', '.account.tankstats fields');

	wotblitz.account.tankstats(['1009922052', '1009922053'], '54289', ['account_id', 'all.battles', 'all.wins']);
	t.equal(fetch.options.body.account_id, '1009922052,1009922053', '.account.tankstats multiple account_id');
	t.equal(fetch.options.body.tank_id, '54289', '.account.tankstats tank_id');
	t.equal(fetch.options.body.fields, 'account_id,all.battles,all.wins', '.account.tankstats multiple fields');

	wotblitz.clans.list();
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/clans/list/', '.clans.list url');
	t.equal(fetch.options.method, 'POST', '.clans.list method');
	t.equal(fetch.options.body.search, '', '.clans.list search');
	t.equal(fetch.options.body.page_no, '', '.clans.list default page_no');
	t.equal(fetch.options.body.limit, '', '.clans.list default limit');
	t.equal(fetch.options.body.fields, '', '.clans.list default fields');

	wotblitz.clans.list('BUST', 1, 100, 'name');
	t.equal(fetch.options.body.search, 'BUST', '.clans.list search');
	t.equal(fetch.options.body.page_no, '1', '.clans.list page_no');
	t.equal(fetch.options.body.limit, '100', '.clans.list limit');
	t.equal(fetch.options.body.fields, 'name', '.clans.list name');

	wotblitz.clans.list('DONE', null, null, ['tag', 'name', 'clan_id']);
	t.equal(fetch.options.body.search, 'DONE', '.clans.list search');
	t.equal(fetch.options.body.page_no, '', '.clans.list page_no unspecified');
	t.equal(fetch.options.body.limit, '', '.clans.list limit unspecified');
	t.equal(fetch.options.body.fields, 'tag,name,clan_id', '.clans.list multiple fields');

	wotblitz.clans.info().then(failure, error => {
		t.equal(error && error.message, 'wotblitz.clans.info: clan_id is required', '.clans.info missing clan_id');
	});

	wotblitz.clans.info(17);
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/clans/info/', '.clans.info url');
	t.equal(fetch.options.method, 'POST', '.clans.info method');
	t.equal(fetch.options.body.clan_id, '17', '.clans.info clan_id');
	t.equal(fetch.options.body.extra, '', '.clans.info default extra');
	t.equal(fetch.options.body.fields, '', '.clans.info default fields');

	wotblitz.clans.info(18, 'members', 'members.account_name');
	t.equal(fetch.options.body.clan_id, '18', '.clans.info clan_id');
	t.equal(fetch.options.body.extra, 'members', '.clans.info extra');
	t.equal(fetch.options.body.fields, 'members.account_name', '.clans.info fields');

	wotblitz.clans.info([19, 20], ['members'], ['members.account_name', 'members.account_id']);
	t.equal(fetch.options.body.clan_id, '19,20', '.clans.info multiple clan_id');
	t.equal(fetch.options.body.extra, 'members', '.clans.info multiple extra');
	t.equal(fetch.options.body.fields, 'members.account_name,members.account_id', '.clans.info multiple fields');

	wotblitz.clans.accountinfo().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.clans.accountinfo: account_id is required',
			'.clans.accountinfo missing account_id');
	});

	wotblitz.clans.accountinfo('1009922080');
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/clans/accountinfo/', '.clans.accountinfo url');
	t.equal(fetch.options.method, 'POST', '.clans.accountinfo method');
	t.equal(fetch.options.body.account_id, '1009922080', '.clans.accountinfo account_id');
	t.equal(fetch.options.body.extra, '', '.clans.accountinfo default extra');
	t.equal(fetch.options.body.fields, '', '.clans.accountinfo default fields');

	wotblitz.clans.accountinfo('1009922081', 'clan', 'clan.name');
	t.equal(fetch.options.body.account_id, '1009922081', '.clans.accountinfo account_id');
	t.equal(fetch.options.body.extra, 'clan', '.clans.accountinfo extra');
	t.equal(fetch.options.body.fields, 'clan.name', '.clans.accountinfo fields');

	wotblitz.clans.accountinfo(['1009922082', '1009922083'], ['clan'], ['account_id', 'account_name', 'clan.tag', 'clan.clan_id']);
	t.equal(fetch.options.body.account_id, '1009922082,1009922083', '.clans.accountinfo multiple account_id');
	t.equal(fetch.options.body.extra, 'clan', '.clans.accountinfo multiple extra');
	t.equal(fetch.options.body.fields, 'account_id,account_name,clan.tag,clan.clan_id', '.clans.accountinfo multiple fields');

	wotblitz.clans.glossary();
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/clans/glossary/', '.clans.glossary url');
	t.equal(fetch.options.method, 'POST', '.clans.glossary method');
	t.equal(fetch.options.body.fields, '', '.clans.glossary default fields');

	wotblitz.clans.glossary('clan_roles');
	t.equal(fetch.options.body.fields, 'clan_roles', '.clans.glossary fields');

	wotblitz.clans.glossary(['clan_roles', 'settings']);
	t.equal(fetch.options.body.fields, 'clan_roles,settings', '.clans.glossary multiple fields');

	wotblitz.encyclopedia.vehicles();
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/encyclopedia/vehicles/', '.encyclopedia.vehicles url');
	t.equal(fetch.options.method, 'POST', '.encyclopedia.vehicles method');
	t.equal(fetch.options.body.tank_id, '', '.encyclopedia.vehicles default tank_id');
	t.equal(fetch.options.body.nation, '', '.encyclopedia.vehicles default nation');
	t.equal(fetch.options.body.fields, '', '.encyclopedia.vehicles default fields');

	wotblitz.encyclopedia.vehicles(1, 'ussr', 'name');
	t.equal(fetch.options.body.tank_id, '1', '.encyclopedia.vehicles tank_id');
	t.equal(fetch.options.body.nation, 'ussr', '.encyclopedia.vehicles nation');
	t.equal(fetch.options.body.fields, 'name', '.encyclopedia.vehicles fields');

	wotblitz.encyclopedia.vehicles([1, 11777, 1057], ['ussr', 'usa'], ['name', 'tier', 'type', 'nation']);
	t.equal(fetch.options.body.tank_id, '1,11777,1057', '.encyclopedia.vehicles multiple tank_id');
	t.equal(fetch.options.body.nation, 'ussr,usa', '.encyclopedia.vehicles multiple nation');
	t.equal(fetch.options.body.fields, 'name,tier,type,nation', '.encyclopedia.vehicles multiple fields');

	wotblitz.encyclopedia.vehicleprofile().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.encyclopedia.vehicleprofile: tank_id is required',
			'.encyclopedia.vehicleprofile missing tank_id');
	});

	wotblitz.encyclopedia.vehicleprofile(11777);
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/encyclopedia/vehicleprofile/', '.encyclopedia.vehicleprofile url');
	t.equal(fetch.options.method, 'POST', '.encyclopedia.vehicleprofile method');
	t.equal(fetch.options.body.tank_id, '11777', '.encyclopedia.vehicleprofile tank_id');
	t.equal(fetch.options.body.profile_id, '', '.encyclopedia.vehicleprofile default profile_id');
	t.equal(fetch.options.body.fields, '', '.encyclopedia.vehicleprofile default fields');

	wotblitz.encyclopedia.vehicleprofile(1, '2-3-4-5');
	t.equal(fetch.options.body.tank_id, '1', '.encyclopedia.vehicleprofile tank_id');
	t.equal(fetch.options.body.profile_id, '2-3-4-5', '.encyclopedia.vehicleprofile profile_id');
	t.equal(fetch.options.body.fields, '', '.encyclopedia.vehicleprofile default fields');

	wotblitz.encyclopedia.vehicleprofile(1, null, {
		suspension_id: 2,
		turret_id: 3,
		gun_id: 4,
		engine_id: 5
	});
	t.equal(fetch.options.body.tank_id, '1', '.encyclopedia.vehicleprofile tank_id');
	t.equal(fetch.options.body.suspension_id, '2', '.encyclopedia.vehicleprofile suspension_id');
	t.equal(fetch.options.body.turret_id, '3', '.encyclopedia.vehicleprofile turret_id');
	t.equal(fetch.options.body.gun_id, '4', '.encyclopedia.vehicleprofile gun_id');
	t.equal(fetch.options.body.engine_id, '5', '.encyclopedia.vehicleprofile engine_id');
	t.equal(fetch.options.body.fields, '', '.encyclopedia.vehicleprofile default fields');

	wotblitz.encyclopedia.vehicleprofile(1, '2-3-4-5', {
		suspension_id: 258,
		turret_id: 259,
		gun_id: 261,
		engine_id: 516
	});
	t.equal(fetch.options.body.tank_id, '1', '.encyclopedia.vehicleprofile tank_id');
	t.equal(!!fetch.options.body.profile_id, false, '.encyclopedia.vehicleprofile profile_id overrode');
	t.equal(fetch.options.body.suspension_id, '258', '.encyclopedia.vehicleprofile suspension_id');
	t.equal(fetch.options.body.turret_id, '259', '.encyclopedia.vehicleprofile turret_id');
	t.equal(fetch.options.body.gun_id, '261', '.encyclopedia.vehicleprofile gun_id');
	t.equal(fetch.options.body.engine_id, '516', '.encyclopedia.vehicleprofile engine_id');
	t.equal(fetch.options.body.fields, '', '.encyclopedia.vehicleprofile default fields');

	wotblitz.encyclopedia.vehicleprofile(1, '258-259-261-516', null, 'speed_forward');
	t.equal(fetch.options.body.tank_id, '1', '.encyclopedia.vehicleprofile tank_id');
	t.equal(fetch.options.body.profile_id, '258-259-261-516', '.encyclopedia.vehicleprofile profile_id');
	t.equal(fetch.options.body.fields, 'speed_forward', '.encyclopedia.vehicleprofile fields');

	wotblitz.encyclopedia.vehicleprofile(1, null, {gun_id: 261}, ['gun.move_down_arc', 'gun.move_up_arc']);
	t.equal(fetch.options.body.tank_id, '1', '.encyclopedia.vehicleprofile tank_id');
	t.equal(fetch.options.body.gun_id, '261', '.encyclopedia.vehicleprofile engine_id');
	t.equal(fetch.options.body.fields, 'gun.move_down_arc,gun.move_up_arc', '.encyclopedia.vehicleprofile multiple fields');

	wotblitz.encyclopedia.modules();
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/encyclopedia/modules/', '.encyclopedia.modules url');
	t.equal(fetch.options.method, 'POST', '.encyclopedia.modules method');
	t.equal(fetch.options.body.module_id, '', '.encyclopedia.modules default module_id');
	t.equal(fetch.options.body.fields, '', '.encyclopedia.modules default fields');

	wotblitz.encyclopedia.modules(2, 'suspensions');
	t.equal(fetch.options.body.module_id, '2', '.encyclopedia.modules module_id');
	t.equal(fetch.options.body.fields, 'suspensions', '.encyclopedia.modules fields');

	wotblitz.encyclopedia.modules([2, 3, 4, 5], ['suspensions.name', 'turrets.name', 'guns.name', 'engines.name']);
	t.equal(fetch.options.body.module_id, '2,3,4,5', '.encyclopedia.modules multiple module_id');
	t.equal(fetch.options.body.fields,
		'suspensions.name,turrets.name,guns.name,engines.name',
		'.encyclopedia.modules multiple fields');

	wotblitz.encyclopedia.provisions();
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/encyclopedia/provisions/', '.encyclopedia.provisions url');
	t.equal(fetch.options.method, 'POST', '.encyclopedia.provisions method');
	t.equal(fetch.options.body.tank_id, '', '.encyclopedia.provisions default tank_id');
	t.equal(fetch.options.body.provision_id, '', '.encyclopedia.provisions default provision_id');
	t.equal(fetch.options.body.type, '', '.encyclopedia.provisions default type');
	t.equal(fetch.options.body.fields, '', '.encyclopedia.provisions default fields');

	wotblitz.encyclopedia.provisions(52993, 249, 'optionalDevice', '-tanks');
	t.equal(fetch.options.body.tank_id, '52993', '.encyclopedia.provisions tank_id');
	t.equal(fetch.options.body.provision_id, '249', '.encyclopedia.provisions provision_id');
	t.equal(fetch.options.body.type, 'optionalDevice', '.encyclopedia.provisions type');
	t.equal(fetch.options.body.fields, '-tanks', '.encyclopedia.provisions fields');

	wotblitz.encyclopedia.provisions([2657, 8465], [3065, 3321], null, ['name_i18n', 'description_i18n']);
	t.equal(fetch.options.body.tank_id, '2657,8465', '.encyclopedia.provisions multiple tank_id');
	t.equal(fetch.options.body.provision_id, '3065,3321', '.encyclopedia.provisions multiple provision_id');
	t.equal(fetch.options.body.fields, 'name_i18n,description_i18n', '.encyclopedia.provisions multiple fields');

	wotblitz.encyclopedia.info();
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/encyclopedia/info/', '.encyclopedia.info url');
	t.equal(fetch.options.method, 'POST', '.encyclopedia.info method');
	t.equal(fetch.options.body.fields, '', '.encyclopedia.info default fields');

	wotblitz.encyclopedia.info('game_version');
	t.equal(fetch.options.body.fields, 'game_version', '.encyclopedia.info fields');

	wotblitz.encyclopedia.info(['game_version', 'tanks_updated_at']);
	t.equal(fetch.options.body.fields, 'game_version,tanks_updated_at', '.encyclopedia.info multiple fields');

	wotblitz.encyclopedia.achievements();
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/encyclopedia/achievements/', '.encyclopedia.achievements url');
	t.equal(fetch.options.method, 'POST', '.encyclopedia.achievements method');
	t.equal(fetch.options.body.fields, '', '.encyclopedia.achievements default fields');

	wotblitz.encyclopedia.achievements('name');
	t.equal(fetch.options.body.fields, 'name', '.encyclopedia.achievements fields');

	wotblitz.encyclopedia.achievements(['name', 'description', 'image']);
	t.equal(fetch.options.body.fields, 'name,description,image', '.encyclopedia.achievements multiple fields');

	wotblitz.encyclopedia.crewskills();
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/encyclopedia/crewskills/', '.encyclopedia.crewskills url');
	t.equal(fetch.options.method, 'POST', '.encyclopedia.crewskills method');
	t.equal(fetch.options.body.skill_id, '', '.encyclopedia.crewskills default skill_id');
	t.equal(fetch.options.body.vehicle_type, '', '.encyclopedia.crewskills default vehicle_type');
	t.equal(fetch.options.body.fields, '', '.encyclopedia.crewskills default fields');

	wotblitz.encyclopedia.crewskills('smooth_driving', 'mediumTank', 'name');
	t.equal(fetch.options.body.skill_id, 'smooth_driving', '.encyclopedia.crewskills skill_id');
	t.equal(fetch.options.body.vehicle_type, 'mediumTank', '.encyclopedia.crewskills vehicle_type');
	t.equal(fetch.options.body.fields, 'name', '.encyclopedia.crewskills fields');

	wotblitz.encyclopedia.crewskills(['surrounded_by_enemy', 'armour_piercing'], ['mediumTank', 'lightTank'], [
		'name', 'tip', 'effect'
	]);
	t.equal(fetch.options.body.skill_id, 'surrounded_by_enemy,armour_piercing', '.encyclopedia.crewskills multiple skill_id');
	t.equal(fetch.options.body.vehicle_type, 'mediumTank,lightTank', '.encyclopedia.crewskills multiple vehicle_type');
	t.equal(fetch.options.body.fields, 'name,tip,effect', '.encyclopedia.crewskills multiple fields');

	wotblitz.encyclopedia.vehicleprofiles().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.encyclopedia.vehicleprofiles: tank_id is required',
			'.encyclopedia.vehicleprofiles missing tank_id');
	});

	wotblitz.encyclopedia.vehicleprofiles(10769);
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/encyclopedia/vehicleprofiles/', '.encyclopedia.vehicleprofiles url');
	t.equal(fetch.options.method, 'POST', '.encyclopedia.vehicleprofiles method');
	t.equal(fetch.options.body.tank_id, '10769', '.encyclopedia.vehicleprofiles tank_id');
	t.equal(fetch.options.body.order_by, '', '.encyclopedia.vehicleprofiles default order_by');
	t.equal(fetch.options.body.fields, '', '.encyclopedia.vehicleprofiles default fields');

	wotblitz.encyclopedia.vehicleprofiles(3153, 'price_credit', 'profile_id');
	t.equal(fetch.options.body.tank_id, '3153', '.encyclopedia.vehicleprofiles tank_id');
	t.equal(fetch.options.body.order_by, 'price_credit', '.encyclopedia.vehicleprofiles order_by');
	t.equal(fetch.options.body.fields, 'profile_id', '.encyclopedia.vehicleprofiles fields');

	wotblitz.encyclopedia.vehicleprofiles([529, 3873], '-price_credit', ['tank_id', 'profile_id']);
	t.equal(fetch.options.body.tank_id, '529,3873', '.encyclopedia.vehicleprofiles multiple tank_id');
	t.equal(fetch.options.body.order_by, '-price_credit', '.encyclopedia.vehicleprofiles order_by');
	t.equal(fetch.options.body.fields, 'tank_id,profile_id', '.encyclopedia.vehicleprofiles multiple fields');

	wotblitz.tanks.stats().then(failure, error => {
		t.equal(error && error.message, 'wotblitz.tanks.stats: account_id is required', '.tanks.stats missing account_id');
	});

	wotblitz.tanks.stats('1009923050');
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/tanks/stats/', '.tanks.stats url');
	t.equal(fetch.options.method, 'POST', '.tanks.stats method');
	t.equal(fetch.options.body.account_id, '1009923050', '.tanks.stats account_id');
	t.equal(fetch.options.body.access_token, '', '.tanks.stats default access_token');
	t.equal(fetch.options.body.tank_id, '', '.tanks.stats default tank_id');
	t.equal(fetch.options.body.in_garage, '', '.tanks.stats default in_garage');
	t.equal(fetch.options.body.fields, '', '.tanks.stats default fields');

	wotblitz.tanks.stats('1009923051', '7c2f6b5eba8f4b359bf5a511d48c6bed269ac37d', 1, '1', 'all');
	t.equal(fetch.options.body.account_id, '1009923051', '.tanks.stats account_id');
	t.equal(fetch.options.body.access_token, '7c2f6b5eba8f4b359bf5a511d48c6bed269ac37d', '.tanks.stats access_token');
	t.equal(fetch.options.body.tank_id, '1', '.tanks.stats tank_id');
	t.equal(fetch.options.body.in_garage, '1', '.tanks.stats in_garage');
	t.equal(fetch.options.body.fields, 'all', '.tanks.stats fields');

	wotblitz.tanks.stats('1009923052', null, [16657, 7953, 3857], null, ['all.wins', 'all.battles']);
	t.equal(fetch.options.body.account_id, '1009923052', '.tanks.stats account_id');
	t.equal(fetch.options.body.access_token, '', '.tanks.stats access_token unspecified');
	t.equal(fetch.options.body.tank_id, '16657,7953,3857', '.tanks.stats multiple tank_id');
	t.equal(fetch.options.body.in_garage, '', '.tanks.stats in_garage unspecified');
	t.equal(fetch.options.body.fields, 'all.wins,all.battles', '.tanks.stats multiple fields');

	wotblitz.tanks.achievements().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.tanks.achievements: account_id is required',
			'.tanks.achievements missing account_id');
	});

	wotblitz.tanks.achievements('1009923060');
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/tanks/achievements/', '.tanks.achievements url');
	t.equal(fetch.options.method, 'POST', '.tanks.achievements method');
	t.equal(fetch.options.body.account_id, '1009923060', '.tanks.achievements account_id');
	t.equal(fetch.options.body.access_token, '', '.tanks.achivements default access_token');
	t.equal(fetch.options.body.tank_id, '', '.tanks.achievements default tank_id');
	t.equal(fetch.options.body.in_garage, '', '.tanks.achievements default in_garage');
	t.equal(fetch.options.body.fields, '', '.tanks.achievements default fields');

	wotblitz.tanks.achievements('1009923061', '7c2f6b5eba8f4b359bf2b711d48c6bed269ac37d', 2305, '0', 'all');
	t.equal(fetch.options.body.account_id, '1009923061', '.tanks.achievements account_id');
	t.equal(fetch.options.body.access_token, '7c2f6b5eba8f4b359bf2b711d48c6bed269ac37d', '.tanks.achievements access_token');
	t.equal(fetch.options.body.tank_id, '2305', '.tanks.achievements tank_id');
	t.equal(fetch.options.body.in_garage, '0', '.tanks.achievements in_garage');
	t.equal(fetch.options.body.fields, 'all', '.tanks.achievements fields');

	wotblitz.tanks.achievements('1009923062', null, [1105, 15889, 10017], null, ['all.wins', 'all.battles', 'all.xp']);
	t.equal(fetch.options.body.account_id, '1009923062', '.tanks.achievements account_id');
	t.equal(fetch.options.body.access_token, '', '.tanks.achievements access_token unspecified');
	t.equal(fetch.options.body.tank_id, '1105,15889,10017', '.tanks.achievements multiple tank_id');
	t.equal(fetch.options.body.in_garage, '', '.tanks.achievements in_garage unspecified');
	t.equal(fetch.options.body.fields, 'all.wins,all.battles,all.xp', '.tanks.achievements multiple fields');

	wotblitz.clanmessages.messages().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.clanmessages.messages: access_token is required',
			'.clanmessages.messages missing access_token');
	});

	wotblitz.clanmessages.messages('123456789abcdef0123456789abcdef012345678');
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/clanmessages/messages/', '.clanmessages.messages url');
	t.equal(fetch.options.method, 'POST', '.clanmessages.messages method');
	t.equal(fetch.options.body.access_token, '123456789abcdef0123456789abcdef012345678', '.clanmessages.messages access_token');
	t.equal(fetch.options.body.message_id, '', '.clanmessages.messages default message_id');
	t.equal(fetch.options.body.order_by, '', '.clanmessages.messages default order_by');
	t.equal(fetch.options.body.fields, '', '.clanmessages.messages default fields');

	wotblitz.clanmessages.messages('0123456789abcdef0123456789abcdef01234567', 57, null, 'message');
	t.equal(fetch.options.body.access_token, '0123456789abcdef0123456789abcdef01234567', '.clanmessages.messages access_token');
	t.equal(fetch.options.body.message_id, '57', '.clanmessages.messages message_id');
	t.equal(fetch.options.body.order_by, '', '.clanmessages.messages order_by unspecified');
	t.equal(fetch.options.body.fields, 'message', '.clanmessages.messages fields');

	wotblitz.clanmessages.messages('f0123456789abcdef0123456789abcdef0123456', null, {
		order_by: 'updated_at',
		expires_before: 1477423406
	});
	t.equal(fetch.options.body.access_token, 'f0123456789abcdef0123456789abcdef0123456', '.clanmessages.messages access_token');
	t.equal(fetch.options.body.message_id, '', '.clanmessages.messages message_id unspecified');
	t.equal(fetch.options.body.order_by, 'updated_at', '.clanmessages.messages order_by');
	t.equal(fetch.options.body.expires_before, '1477423406', '.clanmessages.messages expires_before');
	t.equal(fetch.options.body.fields, '', '.clanmessages.messages default fields');

	wotblitz.clanmessages.messages('ef0123456789abcdef0123456789abcdef012345', null, {
		page_no: 1,
		limit: 100,
		order_by: ['importance', 'type'],
		expires_after: 1477422006,
		importance: 'standard',
		status: 'active',
		type: 'general'
	}, ['message', 'message_id', 'title', 'author_id']);
	t.equal(fetch.options.body.access_token, 'ef0123456789abcdef0123456789abcdef012345', '.clanmessages.messages access_token');
	t.equal(fetch.options.body.message_id, '', '.clanmessages.messages message_id unspecified');
	t.equal(fetch.options.body.page_no, '1', '.clanmessages.messages page_no');
	t.equal(fetch.options.body.limit, '100', '.clanmessages.messages limit');
	t.equal(fetch.options.body.order_by, 'importance,type', '.clanmessages.messages multiple order_by');
	t.equal(fetch.options.body.expires_after, '1477422006', '.clanmessages.messages expires_after');
	t.equal(fetch.options.body.importance, 'standard', '.clanmessages.messages standard');
	t.equal(fetch.options.body.status, 'active', '.clanmessages.messages active');
	t.equal(fetch.options.body.type, 'general', '.clanmessages.messages type');
	t.equal(fetch.options.body.fields, 'message,message_id,title,author_id', '.clanmessages.messages multiple fields');

	wotblitz.clanmessages.create('token', 'title', 'text', 'type', 'importance').then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.clanmessages.create: all arguments are required',
			'.clanmessages.create arguments');
	});

	wotblitz.clanmessages.create('f0123456789abcdef0123456789abcdef0123456', 'TEST: Clan Meeting',
		'Mandatory meeting for all members on Saturday, October 22 at 20:00 EST', 'meeting', 'standard', 1477872000);
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/clanmessages/create/', '.clanmessages.create url');
	t.equal(fetch.options.method, 'POST', '.clanmessages.create method');
	t.equal(fetch.options.body.access_token, 'f0123456789abcdef0123456789abcdef0123456', '.clanmessages.create access_token');
	t.equal(fetch.options.body.title, 'TEST: Clan Meeting', '.clanmessages.create title');
	t.equal(fetch.options.body.text,
		'Mandatory meeting for all members on Saturday, October 22 at 20:00 EST', '.clanmessages.create text');
	t.equal(fetch.options.body.type, 'meeting', '.clanmessages.create type');
	t.equal(fetch.options.body.importance, 'standard', '.clanmessages.create standard');
	t.equal(fetch.options.body.expires_at, '1477872000', '.clanmessages.create expires_at');

	wotblitz.clanmessages.delete('token').then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.clanmessages.delete: all arguments are required',
			'.clanmessages.delete arguments');
	});

	wotblitz.clanmessages.delete('0123456789abcdef0123456789abcdef01234567', 83);
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/clanmessages/delete/', '.clanmessages.delete url');
	t.equal(fetch.options.method, 'POST', '.clanmessages.delete method');
	t.equal(fetch.options.body.access_token, '0123456789abcdef0123456789abcdef01234567', '.clanmessages.delete access_token');
	t.equal(fetch.options.body.message_id, '83', '.clanmessages.delete message_id');

	wotblitz.clanmessages.like('token', 'id').then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.clanmessages.like: all arguments are required',
			'.clanmessages.like arguments');
	});

	wotblitz.clanmessages.like('123456789abcdef0123456789abcdef012345678', 105, 'add');
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/clanmessages/like/', '.clanmessages.like url');
	t.equal(fetch.options.method, 'POST', '.clanmessages.like method');
	t.equal(fetch.options.body.access_token, '123456789abcdef0123456789abcdef012345678', '.clanmessages.like access_token');
	t.equal(fetch.options.body.message_id, '105', '.clanmessages.like message_id');
	t.equal(fetch.options.body.action, 'add', '.clanmessages.like action');

	wotblitz.clanmessages.likes().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.clanmessages.likes: access_token is required',
			'.clanmessages.likes missing access_token');
	});

	wotblitz.clanmessages.likes('token').then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.clanmessages.likes: message_id is required',
			'.clanmessages.likes missing message_id');
	});

	wotblitz.clanmessages.likes('456789abcdef0123456789abcdef0123456789ab', 112);
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/clanmessages/likes/', '.clanmessages.likes url');
	t.equal(fetch.options.method, 'POST', '.clanmessages.likes method');
	t.equal(fetch.options.body.access_token, '456789abcdef0123456789abcdef0123456789ab', '.clanmessages.likes access_token');
	t.equal(fetch.options.body.message_id, '112', '.clanmessages.likes message_id');
	t.equal(fetch.options.body.fields, '', '.clanmessages.likes default fields');

	wotblitz.clanmessages.likes('56789abcdef0123456789abcdef0123456789abc', 127, 'account_id');
	t.equal(fetch.options.body.access_token, '56789abcdef0123456789abcdef0123456789abc', '.clanmessages.likes access_token');
	t.equal(fetch.options.body.message_id, '127', '.clanmessages.likes message_id');
	t.equal(fetch.options.body.fields, 'account_id', '.clanmessages.likes fields');

	wotblitz.clanmessages.likes('6789abcdef0123456789abcdef0123456789abcd', 130, ['account_id', 'liked_at']);
	t.equal(fetch.options.body.access_token, '6789abcdef0123456789abcdef0123456789abcd', '.clanmessages.likes access_token');
	t.equal(fetch.options.body.message_id, '130', '.clanmessages.likes message_id');
	t.equal(fetch.options.body.fields, 'account_id,liked_at', '.clanmessages.likes multiple fields');

	wotblitz.clanmessages.update().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.clanmessages.update: access_token is required',
			'.clanmessages.update missing access_token');
	});

	wotblitz.clanmessages.update('token').then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.clanmessages.update: message_id is required',
			'.clanmessages.update missing message_id');
	});

	wotblitz.clanmessages.update('23456789abcdef0123456789abcdef0123456789', 185);
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/clanmessages/update/', '.clanmessages.update url');
	t.equal(fetch.options.method, 'POST', '.clanmessages.update method');
	t.equal(fetch.options.body.access_token, '23456789abcdef0123456789abcdef0123456789', '.clanmessages.update access_token');
	t.equal(fetch.options.body.message_id, '185', '.clanmessages.update message_id');
	t.equal(fetch.options.body.title, '', '.clanmessages.update default title');
	t.equal(fetch.options.body.text, '', '.clanmessages.update default text');
	t.equal(fetch.options.body.type, '', '.clanmessages.update default type');
	t.equal(fetch.options.body.importance, '', '.clanmessages.update default importance');
	t.equal(fetch.options.body.expires_at, '', '.clanmessages.update default expires_at');

	wotblitz.clanmessages.update('3456789abcdef0123456789abcdef0123456789a', 189, 'New Title',
		'Updated message to the clan.', 'battle', 'standard', 1477873000);
	t.equal(fetch.options.body.access_token, '3456789abcdef0123456789abcdef0123456789a', '.clanmessages.update access_token');
	t.equal(fetch.options.body.message_id, '189', '.clanmessages.update message_id');
	t.equal(fetch.options.body.title, 'New Title', '.clanmessages.update title');
	t.equal(fetch.options.body.text, 'Updated message to the clan.', '.clanmessages.update text');
	t.equal(fetch.options.body.type, 'battle', '.clanmessages.update type');
	t.equal(fetch.options.body.importance, 'standard', '.clanmessages.update importance');
	t.equal(fetch.options.body.expires_at, '1477873000', '.clanmessages.update expires_at');

	wotblitz.tournaments.list();
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/tournaments/list/', '.tournaments.list url');
	t.equal(fetch.options.method, 'POST', '.tournaments.list method');
	t.equal(fetch.options.body.search, '', '.tournaments.list default search');
	t.equal(fetch.options.body.status, '', '.tournaments.list default status');
	t.equal(fetch.options.body.page_no, '', '.tournaments.list default page_no');
	t.equal(fetch.options.body.limit, '', '.tournaments.list default limit');
	t.equal(fetch.options.body.fields, '', '.tournaments.list default fields');

	wotblitz.tournaments.list({search: 'Brawl', status: 'upcoming', page_no: 2, limit: 10}, 'title');
	t.equal(fetch.options.body.search, 'Brawl', '.tournaments.list search passed');
	t.equal(fetch.options.body.status, 'upcoming', '.tournaments.list status passed');
	t.equal(fetch.options.body.page_no, '2', '.tournaments.list page_no passed');
	t.equal(fetch.options.body.limit, '10', '.tournaments.list limit passed');
	t.equal(fetch.options.body.fields, 'title', '.tournaments.list fields passed');

	wotblitz.tournaments.list({status: ['upcoming', 'registration_started']}, ['start_at', 'end_at']);
	t.equal(fetch.options.body.search, '', '.tournaments.list default search');
	t.equal(fetch.options.body.status, 'upcoming,registration_started', '.tournaments.list multiple status passed');
	t.equal(fetch.options.body.page_no, '', '.tournaments.list default page_no');
	t.equal(fetch.options.body.limit, '', '.tournaments.list default limit');
	t.equal(fetch.options.body.fields, 'start_at,end_at', '.tournaments.list multiple fields passed');

	wotblitz.tournaments.list({
		search: 'Battlegrounds',
		status: ['upcoming', 'registration_started', 'registration_finished', 'running'],
		page_no: 3,
		limit: 5
	}, [
		'status',
		'start_at',
		'title',
		'description'
	]);
	t.equal(fetch.options.body.search, 'Battlegrounds', '.tournaments.list search passed');
	t.equal(fetch.options.body.status,
		'upcoming,registration_started,registration_finished,running',
		'.tournaments.list multiple status passed');
	t.equal(fetch.options.body.page_no, '3', '.tournaments.list page_no passed');
	t.equal(fetch.options.body.limit, '5', '.tournaments.list limit passed');
	t.equal(fetch.options.body.fields, 'status,start_at,title,description', '.tournaments.list multiple fields passed');

	wotblitz.tournaments.info().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.tournaments.info: tournament_id is required',
			'.tournaments.info missing tournament_id');
	});

	wotblitz.tournaments.info(5);
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/tournaments/info/', '.tournaments.info url');
	t.equal(fetch.options.method, 'POST', '.tournaments.info method');
	t.equal(fetch.options.body.tournament_id, '5', '.tournaments.info tournament_id passed');
	t.equal(fetch.options.body.fields, '', '.tournaments.info default fields');

	wotblitz.tournaments.info(12, 'description');
	t.equal(fetch.options.body.tournament_id, '12', '.tournaments.info tournament_id passed');
	t.equal(fetch.options.body.fields, 'description', '.tournaments.info fields passed');

	wotblitz.tournaments.info([14, 16], ['title', 'status']);
	t.equal(fetch.options.body.tournament_id, '14,16', '.tournaments.info multiple tournament_id passed');
	t.equal(fetch.options.body.fields, 'title,status', '.tournaments.info multiple fields passed');

	wotblitz.tournaments.teams().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.tournaments.teams: tournament_id is required',
			'.tournaments.teams missing tournament_id');
	});

	wotblitz.tournaments.teams(6);
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/tournaments/teams/', '.tournaments.teams url');
	t.equal(fetch.options.method, 'POST', '.tournaments.teams method');
	t.equal(fetch.options.body.tournament_id, '6', '.tournaments.teams tournament_id passed');
	t.equal(fetch.options.body.account_id, '', '.tournaments.teams default account_id');
	t.equal(fetch.options.body.clan_id, '', '.tournaments.teams default clan_id');
	t.equal(fetch.options.body.team_id, '', '.tournaments.teams default team_id');
	t.equal(fetch.options.body.status, '', '.tournaments.teams default status');
	t.equal(fetch.options.body.search, '', '.tournaments.teams default search');
	t.equal(fetch.options.body.page_no, '', '.tournaments.teams default page_no');
	t.equal(fetch.options.body.limit, '', '.tournaments.teams default limit');
	t.equal(fetch.options.body.fields, '', '.tournaments.teams default fields');

	wotblitz.tournaments.teams(16, {
		account_id: '1007942',
		clan_id: 5,
		team_id: 72,
		status: 'confirmed',
		search: 'zoo',
		page_no: 1,
		limit: 15
	}, 'players');
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/tournaments/teams/', '.tournaments.teams url');
	t.equal(fetch.options.method, 'POST', '.tournaments.teams method');
	t.equal(fetch.options.body.tournament_id, '16', '.tournaments.teams tournament_id passed');
	t.equal(fetch.options.body.account_id, '1007942', '.tournaments.teams account_id passed');
	t.equal(fetch.options.body.clan_id, '5', '.tournaments.teams clan_id passed');
	t.equal(fetch.options.body.team_id, '72', '.tournaments.teams team_id passed');
	t.equal(fetch.options.body.status, 'confirmed', '.tournaments.teams status passed');
	t.equal(fetch.options.body.search, 'zoo', '.tournaments.teams search passed');
	t.equal(fetch.options.body.page_no, '1', '.tournaments.teams page_no passed');
	t.equal(fetch.options.body.limit, '15', '.tournaments.teams limit passed');
	t.equal(fetch.options.body.fields, 'players', '.tournaments.teams fields passed');

	wotblitz.tournaments.teams(26, {
		account_id: ['1007943', '1007944'],
		clan_id: [14, 16, 18],
		team_id: [73, 84, 95],
		status: ['forming', 'confirmed'],
		search: 'wild',
		page_no: 2,
		limit: 10
	}, ['title', 'players.name']);
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/tournaments/teams/', '.tournaments.teams url');
	t.equal(fetch.options.method, 'POST', '.tournaments.teams method');
	t.equal(fetch.options.body.tournament_id, '26', '.tournaments.teams tournament_id passed');
	t.equal(fetch.options.body.account_id, '1007943,1007944', '.tournaments.teams account_id passed');
	t.equal(fetch.options.body.clan_id, '14,16,18', '.tournaments.teams multiple clan_id passed');
	t.equal(fetch.options.body.team_id, '73,84,95', '.tournaments.teams multiple team_id passed');
	t.equal(fetch.options.body.status, 'forming,confirmed', '.tournaments.teams multiple status passed');
	t.equal(fetch.options.body.search, 'wild', '.tournaments.teams search passed');
	t.equal(fetch.options.body.page_no, '2', '.tournaments.teams page_no passed');
	t.equal(fetch.options.body.limit, '10', '.tournaments.teams limit passed');
	t.equal(fetch.options.body.fields, 'title,players.name', '.tournaments.teams multiple fields passed');

	wotblitz.tournaments.stages().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.tournaments.stages: tournament_id is required',
			'.tournaments.stages: missing tournament_id');
	});

	wotblitz.tournaments.stages(7);
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/tournaments/stages/', '.tournaments.stages url');
	t.equal(fetch.options.method, 'POST', '.tournaments.stages method');
	t.equal(fetch.options.body.tournament_id, '7', '.tournaments.stages tournament_id passed');
	t.equal(fetch.options.body.page_no, '', '.tournaments.stages default page_no');
	t.equal(fetch.options.body.limit, '', '.tournaments.stages default limit');
	t.equal(fetch.options.body.fields, '', '.tournaments.stages default limit');

	wotblitz.tournaments.stages(17, {page_no: 1, limit: 12}, 'description');
	t.equal(fetch.options.body.tournament_id, '17', '.tournaments.stages tournament_id passed');
	t.equal(fetch.options.body.page_no, '1', '.tournaments.stages page_no passed');
	t.equal(fetch.options.body.limit, '12', '.tournaments.stages limit passed');
	t.equal(fetch.options.body.fields, 'description', '.tournaments.stages fields passed');

	wotblitz.tournaments.stages(27, null, ['min_tier', 'max_tier']);
	t.equal(fetch.options.body.tournament_id, '27', '.tournaments.stages tournament_id passed');
	t.equal(fetch.options.body.page_no, '', '.tournaments.stages default page_no');
	t.equal(fetch.options.body.limit, '', '.tournaments.stages default limit');
	t.equal(fetch.options.body.fields, 'min_tier,max_tier', '.tournaments.stages mutliple fields passed');

	wotblitz.tournaments.matches().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.tournaments.matches: tournament_id is required',
			'.tournaments.matches missing tournament_id');
	});

	wotblitz.tournaments.matches(12).then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.tournaments.matches: stage_id is required',
			'.tournaments.matches missing stage_id');
	});

	wotblitz.tournaments.matches(8, 1);
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/tournaments/matches/', '.tournaments.matches url');
	t.equal(fetch.options.method, 'POST', '.tournaments.matches method');
	t.equal(fetch.options.body.tournament_id, '8', '.tournaments.matches tournament_id passed');
	t.equal(fetch.options.body.stage_id, '1', '.tournaments.matches stage_id passed');
	t.equal(fetch.options.body.team_id, '', '.tournaments.matches default team_id');
	t.equal(fetch.options.body.group_id, '', '.tournaments.matches default group_id');
	t.equal(fetch.options.body.round_number, '', '.tournaments.matches default round_number');
	t.equal(fetch.options.body.page_no, '', '.tournaments.matches default page_no');
	t.equal(fetch.options.body.limit, '', '.tournaments.matches default limit');
	t.equal(fetch.options.body.fields, '', '.tournaments.matches default fields');

	wotblitz.tournaments.matches(18, 2, {team_id: 45, group_id: 3, round_number: 1, page_no: 1, limit: 5}, 'state');
	t.equal(fetch.options.body.tournament_id, '18', '.tournaments.matches tournament_id passed');
	t.equal(fetch.options.body.stage_id, '2', '.tournaments.matches stage_id passed');
	t.equal(fetch.options.body.team_id, '45', '.tournaments.matches team_id passed');
	t.equal(fetch.options.body.round_number, '1', '.tournaments.matches round_number passed');
	t.equal(fetch.options.body.page_no, '1', '.tournaments.matches page_no passed');
	t.equal(fetch.options.body.limit, '5', '.tournaments.matches limit passed');
	t.equal(fetch.options.body.fields, 'state', '.tournaments.matches fields passed');

	wotblitz.tournaments.matches(28, 3, {
		team_id: [2, 4, 10],
		group_id: [3, 5, 9, 11],
		round_number: [1, 2, 3]
	}, ['id', 'start_time']);
	t.equal(fetch.options.body.tournament_id, '28', '.tournaments.matches tournament_id passed');
	t.equal(fetch.options.body.stage_id, '3', '.tournaments.matches stage_id passed');
	t.equal(fetch.options.body.team_id, '2,4,10', '.tournaments.matches multiple team_id passed');
	t.equal(fetch.options.body.group_id, '3,5,9,11', '.tournaments.matches multiple group_id passed');
	t.equal(fetch.options.body.round_number, '1,2,3', '.tournaments.matches multiple round_number passed');
	t.equal(fetch.options.body.page_no, '', '.tournaments.matches default page_no');
	t.equal(fetch.options.body.limit, '', '.tournaments.matches default limit');
	t.equal(fetch.options.body.fields, 'id,start_time', '.tournaments.matches multiple fields passed');

	wotblitz.tournaments.standings().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.tournaments.standings: tournament_id is required',
			'.tournaments.standings missing tournament_id');
	});

	wotblitz.tournaments.standings(9);
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/tournaments/standings/', '.tournaments.standings url');
	t.equal(fetch.options.method, 'POST', '.tournaments.standings method');
	t.equal(fetch.options.body.tournament_id, '9', '.tournaments.standings tournament_id passed');
	t.equal(fetch.options.body.team_id, '', '.tournaments.standings default team_id');
	t.equal(fetch.options.body.from_position, '', '.tournaments.standings default from_position');
	t.equal(fetch.options.body.to_position, '', '.tournaments.standings default to_position');
	t.equal(fetch.options.body.page_no, '', '.tournaments.standings default page_no');
	t.equal(fetch.options.body.limit, '', '.tournaments.standings default limit');
	t.equal(fetch.options.body.fields, '', '.tournaments.standings default fields');

	wotblitz.tournaments.standings(19, {
		team_id: 12,
		from_position: 4,
		to_position: 1,
		page_no: 1,
		limit: 6
	}, 'points');
	t.equal(fetch.options.body.tournament_id, '19', '.tournaments.standings tournament_id passed');
	t.equal(fetch.options.body.team_id, '12', '.tournaments.standings team_id passed');
	t.equal(fetch.options.body.from_position, '4', '.tournaments.standings from_position passed');
	t.equal(fetch.options.body.to_position, '1', '.tournaments.standings to_position passed');
	t.equal(fetch.options.body.page_no, '1', '.tournaments.standings page_no passed');
	t.equal(fetch.options.body.limit, '6', '.tournaments.standings limit passed');
	t.equal(fetch.options.body.fields, 'points', '.tournaments.standings fields passed');

	wotblitz.tournaments.standings(29, {team_id: [1, 2, 3]}, ['wins', 'battle_played', 'position']);
	t.equal(fetch.options.body.tournament_id, '29', '.tournaments.standings tournament_id passed');
	t.equal(fetch.options.body.team_id, '1,2,3', '.tournaments.standings multiple team_id passed');
	t.equal(fetch.options.body.from_position, '', '.tournaments.standings default from_position');
	t.equal(fetch.options.body.to_position, '', '.tournaments.standings default to_position');
	t.equal(fetch.options.body.page_no, '', '.tournaments.standings default page_no');
	t.equal(fetch.options.body.limit, '', '.tournaments.standings default limit');
	t.equal(fetch.options.body.fields, 'wins,battle_played,position', '.tournaments.standings multiple fields passed');

	wotblitz.tournaments.tables().then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.tournaments.tables: tournament_id is required',
			'.tournaments.tables missing tournament_id');
	});

	wotblitz.tournaments.tables(11).then(failure, error => {
		t.equal(error && error.message,
			'wotblitz.tournaments.tables: stage_id is required',
			'.tournaments.tables missing stage_id');
	});

	wotblitz.tournaments.tables(10, 2);
	t.equal(fetch.url, 'https:\/\/api.wotblitz.com/wotb/tournaments/tables/', '.tournaments.tables url');
	t.equal(fetch.options.method, 'POST', '.tournaments.tables method');
	t.equal(fetch.options.body.tournament_id, '10', '.tournaments.tables tournament_id passed');
	t.equal(fetch.options.body.stage_id, '2', '.tournaments.tables stage_id passed');
	t.equal(fetch.options.body.group_id, '', '.tournaments.tables default group_id');
	t.equal(fetch.options.body.page_no, '', '.tournaments.tables default page_no');
	t.equal(fetch.options.body.limit, '', '.tournaments.tables default limit');
	t.equal(fetch.options.body.fields, '', '.tournaments.tables default fields');

	wotblitz.tournaments.tables(20, 3, {group_id: 7, page_no: 3, limit: 2}, 'round');
	t.equal(fetch.options.body.tournament_id, '20', '.tournaments.tables tournament_id passed');
	t.equal(fetch.options.body.stage_id, '3', '.tournaments.tables stage_id passed');
	t.equal(fetch.options.body.group_id, '7', '.tournaments.tables group_id passed');
	t.equal(fetch.options.body.page_no, '3', '.tournaments.tables page_no passed');
	t.equal(fetch.options.body.limit, '2', '.tournaments.tables limit passed');
	t.equal(fetch.options.body.fields, 'round', '.tournaments.tables fields passed');

	wotblitz.tournaments.tables(30, 4, {group_id: [2, 4, 6]}, ['title', 'team_points', 'position']);
	t.equal(fetch.options.body.tournament_id, '30', '.tournaments.tables tournament_id passed');
	t.equal(fetch.options.body.stage_id, '4', '.tournaments.tables stage_id passed');
	t.equal(fetch.options.body.group_id, '2,4,6', '.tournaments.tables multiple group_id passed');
	t.equal(fetch.options.body.page_no, '', '.tournaments.tables default page_no');
	t.equal(fetch.options.body.limit, '', '.tournaments.tables default limit');
	t.equal(fetch.options.body.fields, 'title,team_points,position', '.tournaments.tables multiple fields passed');

	t.end();
});
