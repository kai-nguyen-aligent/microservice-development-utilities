import { MiddlewareCallbackParams } from 'openapi-fetch';
import { OAuth10a } from '../authentications';
import { generateOauthParams } from './oauth10a';

describe('generateOauthParams', () => {
    const baseRequest: MiddlewareCallbackParams['request'] = {
        method: '',
        url: '',
        cache: 'default',
        credentials: 'same-origin',
        headers: new Headers(),
        integrity: '',
        keepalive: false,
        mode: 'cors',
        redirect: 'follow',
        referrer: '',
        referrerPolicy: '',
        signal: new AbortController().signal,
        body: null,
        bodyUsed: false,
        destination: 'document',
        duplex: 'half',
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob(Array(new ArrayBuffer(0)))),
        formData: () => Promise.resolve(new FormData()),
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        clone: () => ({ ...baseRequest }),
    };

    const baseOptions: MiddlewareCallbackParams['options'] = {
        baseUrl: '',
        bodySerializer: () => '',
        fetch: () => Promise.resolve(new Response()),
        querySerializer: () => '',
        parseAs: 'json',
    };

    it('generate correct HMAC-SHA256 signature to simple GET with token', async () => {
        const request: MiddlewareCallbackParams['request'] = {
            ...baseRequest,
            method: 'get',
            url: 'path/with/string',
        };
        const options: MiddlewareCallbackParams['options'] = {
            ...baseOptions,
        };
        const params: MiddlewareCallbackParams['params'] = {};
        const config: OAuth10a = {
            algorithm: 'HMAC-SHA256',
            consumerKey: 'k',
            consumerSecret: 's',
            token: 't',
            tokenSecret: 'ts',
            callback: 'cb',
            verifier: 'v',
        };

        const result = generateOauthParams(request, options, params, config);
        expect(result).toEqual('');
    });

    it.todo('generate correct HMAC-SHA1 signature to simple GET without token', async () => {});

    it.todo(
        'generate correct HMAC-SHA256 signature to simple POST request with token',
        async () => {}
    );
    it.todo(
        'generate correct HMAC-SHA1 signature to simple POST request without token and using URLSearchParams for body'
    );
    it.todo(
        'generate correct HMAC-SHA1 signature to simple POST request with query parameters',
        async () => {}
    );
    it.todo(
        'generate correct HMAC-SHA1 signature to simple POST request with query parameters in params as URLSearchParams',
        async () => {}
    );
    it.todo(
        'generate correct HMAC-SHA1 signature to simple POST request with callback URL',
        async () => {}
    );
    it.todo(
        'generate correct HMAC-SHA256 signature to simple POST request with callback URL',
        async () => {}
    );
    it.todo(
        'generate correct HMAC-SHA1 signature to simple POST request with verifier',
        async () => {}
    );
    it.todo(
        'generate correct HMAC-SHA256 signature to simple POST request with verifier',
        async () => {}
    );
});
