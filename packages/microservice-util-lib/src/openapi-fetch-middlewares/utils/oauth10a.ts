import crypto from 'crypto';
import { rfc3986, sign } from 'oauth-sign';
import { MiddlewareCallbackParams } from 'openapi-fetch';
import { OAuth10a } from '../authentications';

/**
 * Takes an object of query parameters and returns it ready for
 * OAuth signing using. Returns an empty object if no params
 * are provided.
 *
 * Axios replaces all whitespace (or whitespace encoded as %20)
 * with the + character AFTER using encodeURIComponent
 *
 * This breaks OAuth signing because the Axios plugin does not
 * use the Axios parameter serializer.
 *
 * For this reason, we pre-emptively replace whitespace with +
 * ourselves. Replacement is on a 1:1 basis in case we ever
 * need to filter/match by free text in the backend
 *
 * See these tickets for related discussion:
 * https://aligent.atlassian.net/browse/MICRO-306
 * https://github.com/axios/axios/issues/678
 */
export function sanitizeQueryParams(params?: Record<string, unknown>): Record<string, unknown> {
    if (!params) {
        return {};
    }

    const sanitizedParams: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'string') {
            sanitizedParams[key] = value.replaceAll(' ', '+');
        } else {
            sanitizedParams[key] = value;
        }
    }

    return sanitizedParams;
}

/**
 * Determines whether a given URL is absolute.
 *
 * A URL is considered absolute if it begins with a scheme (e.g., "http://", "https://")
 * or is protocol-relative (e.g., "//example.com").
 * RFC 3986 defines scheme name as a sequence of characters beginning with a letter
 * and followed by any combination of letters, digits, plus, period, or hyphen.
 *
 * @param {string} url - The URL to check.
 * @returns {boolean} `true` if the URL is absolute, otherwise `false`.
 *
 * @example
 * isAbsoluteURL('https://example.com'); // true
 * isAbsoluteURL('//example.com'); // true
 * isAbsoluteURL('/relative/path'); // false
 */
function isAbsoluteURL(url: string): boolean {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

function combineURLs(baseURL: string, relativeURL: string): string {
    return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
}

function handleOAuthUrl(baseUrl: string, url: string) {
    const oauthUrl = new URL(!baseUrl || isAbsoluteURL(url) ? url : combineURLs(baseUrl, url));

    let searchParams: URLSearchParams | null = null;

    // Query parameters are hashed as part of params rather than as part of the URL
    if (oauthUrl.search) {
        searchParams = new URLSearchParams(oauthUrl.search);
        oauthUrl.search = '';
    }

    // Do not include hash in signature
    oauthUrl.hash = '';

    // Remove port if it is the default for that protocol
    if (
        (oauthUrl.protocol === 'https:' && oauthUrl.port === '443') ||
        (oauthUrl.protocol === 'http:' && oauthUrl.port === '80')
    ) {
        oauthUrl.port = '';
    }

    return {
        baseUri: oauthUrl.toString(),
        searchParams,
    };
}

function generateNonce(size: number = 16): string {
    return crypto.randomBytes(0 | (size * 0.75)).toString('base64');
}

function addParamToSign(
    paramsToSign: Record<string, string | string[]>,
    key: string,
    value: string
) {
    const existingValue = paramsToSign[key];

    if (typeof existingValue === 'string') {
        paramsToSign[key] = [existingValue, value];
    } else if (Array.isArray(existingValue)) {
        existingValue.push(value);
    } else {
        paramsToSign[key] = value;
    }
}

function addParamsToSign(
    paramsToSign: Record<string, string | string[]>,
    params: URLSearchParams | Record<string, unknown> | string
) {
    // Ensure `params` is compatible with `URLSearchParams`
    const normalizedParams =
        typeof params === 'string' || params instanceof URLSearchParams
            ? params
            : Object.entries(params).reduce<Record<string, string | string[]>>(
                  (acc, [key, value]) => {
                      acc[key] = Array.isArray(value) ? value.map(String) : String(value);
                      return acc;
                  },
                  {}
              );

    new URLSearchParams(normalizedParams).forEach((value, key) => {
        addParamToSign(paramsToSign, key, value);
    });
}

function shouldGenerateBodyHash(
    body: string,
    method: string,
    includeBodyHash: OAuth10a['includeBodyHash']
) {
    if (includeBodyHash === 'auto' && ['POST', 'PUT'].includes(method) && body) {
        return true;
    }

    return includeBodyHash === true;
}

export async function generateOauthParams(
    request: MiddlewareCallbackParams['request'],
    options: MiddlewareCallbackParams['options'],
    params: MiddlewareCallbackParams['params'],
    config: OAuth10a
) {
    const {
        algorithm,
        consumerKey,
        consumerSecret,
        token,
        tokenSecret,
        includeBodyHash = 'auto',
        realm,
        callback,
        verifier,
    } = config;

    const method = (request.method || 'GET').toUpperCase();

    // TODO: construct the correct url from request.url & params.path
    const url = request.url;

    const oauthParams: Record<string, string> = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: generateNonce(),
        oauth_signature_method: algorithm,
        oauth_timestamp: String(Math.floor(Date.now() * 0.001)),
        oauth_version: '1.0',
    };

    // If provided, oauth_token can be included in the oauth parameters
    // more information: https://datatracker.ietf.org/doc/html/rfc5849#section-3.1
    if (token) {
        oauthParams.oauth_token = token;
    }

    if (callback) {
        oauthParams.oauth_callback = callback;
    }

    if (verifier) {
        oauthParams.oauth_verifier = verifier;
    }

    const paramsToSign: Record<string, string | string[]> = {};

    addParamsToSign(paramsToSign, oauthParams);

    if (params.query) {
        addParamsToSign(paramsToSign, params.query);
    }

    const { baseUri, searchParams } = handleOAuthUrl(options.baseUrl, url);

    if (searchParams) {
        addParamsToSign(paramsToSign, searchParams);
    }

    const body = await request.text();
    const generateBodyHash = shouldGenerateBodyHash(body, method, includeBodyHash);

    // If user submit a form, then include form parameters in the
    // signature as parameters rather than the body hash
    if (request.headers.get('Content-Type') === 'application/x-www-form-urlencoded') {
        addParamsToSign(paramsToSign, new URLSearchParams(body));
    } else if (generateBodyHash) {
        const bodyHash = crypto
            .createHash(algorithm === 'HMAC-SHA1' ? 'sha1' : 'sha256')
            .update(Buffer.from(body))
            .digest('base64');
        oauthParams.oauth_body_hash = bodyHash;
        addParamToSign(paramsToSign, 'oauth_body_hash', bodyHash);
    }

    oauthParams.oauth_signature = sign(
        algorithm,
        method,
        baseUri,
        paramsToSign,
        consumerSecret,
        tokenSecret
    );

    // realm should not be included in the signature calculation
    // but is optional in the OAuth 1.0 Authorization header
    // so we need to add it after signing the request
    // more information: https://datatracker.ietf.org/doc/html/rfc5849#section-3.4.1.3.1
    if (realm) {
        oauthParams.realm = realm;
    }

    return Object.entries(oauthParams)
        .map(e => [e[0], '="', rfc3986(e[1]), '"'].join(''))
        .join(',');
}
