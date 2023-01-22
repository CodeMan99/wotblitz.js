import fetch, {Response} from 'node-fetch';
import * as querystring from 'querystring';
import * as util from 'util';

type Region =
	| '.com'
	| '.asia'
	| '.eu'
	| '.ru'

type Language =
	// "en" — English
	| 'en'
	// "ru" — Русский
	| 'ru'
	// "pl" — Polski
	| 'pl'
	// "de" — Deutsch
	| 'de'
	// "fr" — Français
	| 'fr'
	// "es" — Español
	| 'es'
	// "zh-cn" — 简体中文
	| 'zh-cn'
	// "zh-tw" — 繁體中文
	| 'zh-tw'
	// "tr" — Türkçe
	| 'tr'
	// "cs" — Čeština
	| 'cs'
	// "th" — ไทย (by default)
	| 'th'
	// "vi" — Tiếng Việt
	| 'vi'
	// "ko" — 한국어
	| 'ko'

type HttpMethod = 'GET' | 'POST';

type RequestOptions = {
	hostname: string;
	language?: Language;
	method?: HttpMethod;
	path: string;
	region?: Region;
}

class Request {
	private appId: string | undefined;
	region: Region;
	language: Language;
	userAgent = 'wotblitz-v1.3 (+https://github.com/CodeMan99/wotblitz.js)';

	constructor(application_id?: string, region: Region = '.com', language: Language = 'en') {
		this.appId = application_id;
		this.region = region;
		this.language = language;
	}

	get application_id(): string {
		if (!this.appId) this.appId = process.env.APPLICATION_ID;
		if (!this.appId) throw new Error('wotblitz/request: no APPLICATION_ID set in the environment');

		return this.appId;
	}

	set application_id(appId: string) {
		this.appId = appId;
	}

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
	async execute(options: RequestOptions, body: Record<string, any>): Promise<any> {
		// assign defaults
		options = Object.assign({
			language: this.language,
			method: 'POST',
			region: this.region
		}, options);

		// Will throw error if `this.appId` is not set.
		body.application_id = this.application_id;
		body.language = options.language;

		const url = 'https://' + options.hostname + options.region + options.path;

		let request: Promise<Response>;

		if (options.method !== 'GET') {
			request = fetch(url, {
				body: querystring.stringify(body),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent': this.userAgent
				},
				method: options.method
			});
		} else {
			request = fetch(url + '?' + querystring.stringify(body), {
				headers: {
					'User-Agent': this.userAgent
				},
				method: 'GET'
			});
		}

		type ResponseError = {
			code: number;
			message: string;
			field: string;
			value: any;
		}

		type ResponseBody = {
			status: 'ok';
			data: any;
		} | {
			status: 'error';
			error: ResponseError;
		}

		const response = await request;
		const result: ResponseBody = await response.json();

		switch (result.status) {
		case 'ok':
			return result.data;
		case 'error':
			// eslint-disable-next-line no-case-declarations
			const e = result.error;
			// eslint-disable-next-line no-case-declarations
			const message = util.format('%d %s: %s=%j', e.code, e.message, e.field, e.value);

			throw new Error(message);
		default:
			return null;
		}
	}
}

export = Request;
