var nock = require('nock');
var test = require('tape');

var request = require('../request.js');

test('request', t => {
	delete process.env.APPLICATION_ID;
	t.throws(() => request.application_id, Error, 'throws an error when no application_id is set.');

	process.env.APPLICATION_ID = 'setfromenv';
	t.equal(request.application_id, 'setfromenv', 'will get application_id from the env.');

	delete process.env.APPLICATION_ID;
	t.equal(request.application_id, 'setfromenv', 'caches application_id from the env.');

	request.application_id = 'setfromcode';
	t.equal(request.application_id, 'setfromcode', 'will respect application_id set in code.');

	t.equal(request.region, '.com', 'defaults to NA region.');

	t.equal(request.language, 'en', 'defaults to English language.');

	t.test('response successful', st => {
		var servers = nock('https:\/\/api.worldoftanks.com', {
			reqheaders: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
			.post('/wgn/servers/info/', {
				application_id: 'setfromcode',
				language: 'en'
			})
			.reply(200, {
				status: 'ok',
				data: {
					wot: [{
						players_online: 5622,
						server: 'NA EAST'
					}, {
						players_online: 3950,
						server: 'NA WEST'
					}],
					wotb: [{
						players_online: 2312,
						server: 'NA'
					}],
					wotp: [{
						players_online: 2481,
						server: 'NA'
					}]
				}
			});

		request({
			hostname: 'api.worldoftanks',
			path: '/wgn/servers/info/'
		}, {}).then(data => {
			st.deepEqual(data, {
				wot: [{
					players_online: 5622,
					server: 'NA EAST'
				}, {
					players_online: 3950,
					server: 'NA WEST'
				}],
				wotb: [{
					players_online: 2312,
					server: 'NA'
				}],
				wotp: [{
					players_online: 2481,
					server: 'NA'
				}]
			}, 'resolves to data property.');

			st.ok(servers.isDone(), 'parsed network request.');
			st.end();
		}, reason => {
			st.fail(reason);
			st.end();
		});
	});

	t.test('response error', st => {
		var encyclopediaInfo = nock('https:\/\/api.wotblitz.com')
			.get('/wotb/encyclopedia/info/')
			.query({
				application_id: 'setfromcode',
				language: 'en',
				fields: 'game'
			})
			.reply(200, {
				status: 'error',
				error: {
					code: 407,
					message: 'INVALID_FIELDS',
					field: 'fields',
					value: 'game'
				}
			});

		request({
			hostname: 'api.wotblitz',
			path: '/wotb/encyclopedia/info/',
			method: 'GET'
		}, {
			fields: 'game'
		}).then(data => {
			st.fail('incorrectly resolved to: ' + JSON.stringify(data));
			st.end();
		}, reason => {
			st.equal(reason.message, '407 INVALID_FIELDS: fields="game"', 'rejects to formatted exception');
			st.ok(encyclopediaInfo.isDone(), 'parsed network request.');
			st.end();
		});
	});

	t.end();
});
