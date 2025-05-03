import type { Middleware } from 'openapi-fetch';
import { generateOauthParams } from './oauth10a/oauth10a';
import type { ApiKey, Basic, OAuth10a, OAuth20 } from './types/authentications';

function apiKeyAuthMiddleware(config: ApiKey): Middleware {
    return {
        onRequest: async ({ request }) => {
            request.headers.set(config.header, await config.value());
        },
    };
}

function basicAuthMiddleware(config: Basic): Middleware {
    return {
        onRequest: async ({ request }) => {
            const { username, password } = await config.credentials();

            request.headers.set(
                'Authorization',
                `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
            );
        },
    };
}

function oAuth10aAuthMiddleware(config: OAuth10a): Middleware {
    return {
        onRequest: async ({ request, options, params }) => {
            const oauthParams = await generateOauthParams(request, options, params, config);

            request.headers.set('Authorization', `OAuth ${oauthParams}`);
        },
    };
}

function oAuth20AuthMiddleware(options: OAuth20): Middleware {
    return {
        onRequest: async ({ request }) => {
            const { tokenType = 'Bearer' } = options;

            request.headers.set('Authorization', `${tokenType} ${await options.token()}`);
        },
    };
}

export type { ApiKey, Basic, OAuth10a, OAuth20 };

export { apiKeyAuthMiddleware, basicAuthMiddleware, oAuth10aAuthMiddleware, oAuth20AuthMiddleware };
