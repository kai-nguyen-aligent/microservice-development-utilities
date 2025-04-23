import type { Middleware } from 'openapi-fetch';
import type { ApiKey, Basic, OAuth10a, OAuth20 } from './types/authentications-types';
import { generateOauthParams } from './utils/oauth10a';

function apiKeyAuthMiddleware(config: ApiKey): Middleware {
    return {
        onRequest: ({ request }) => {
            request.headers.set(config.header, config.value);
        },
    };
}

function basicAuthMiddleware(config: Basic): Middleware {
    const credentials = Buffer.from(`${config.username}:${config.password}`).toString('base64');
    return {
        onRequest: ({ request }) => {
            request.headers.set('Authorization', `Basic ${credentials}`);
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

function oAuth20AuthMiddleware<T>(options: OAuth20<T>): Middleware {
    return {
        onRequest: async ({ request }) => {
            const accessToken = await options.accessToken();
            request.headers.set('Authorization', `Bearer ${accessToken}`);
        },
    };
}

export type { ApiKey, Basic, OAuth10a, OAuth20 };

export { apiKeyAuthMiddleware, basicAuthMiddleware, oAuth10aAuthMiddleware, oAuth20AuthMiddleware };
