/**
 * Represents an API key authentication method.
 *
 * @property {string} header - The header name where the API key will be set.
 * @property {string} value - The API key value.
 */
export interface ApiKey {
    header: string;
    value: string;
}

/**
 * Represents basic authentication credentials.
 *
 * @property {string} username - The username for basic authentication.
 * @property {string} password - The password for basic authentication.
 */
export interface Basic {
    username: string;
    password: string;
}

/**
 * Represents OAuth 1.0a authentication credentials.
 *
 * @property {string} consumerKey - The consumer key for OAuth 1.0.
 * @property {string} consumerSecret - The consumer secret for OAuth 1.0.
 * @property {string} token - The token for OAuth 1.0.
 * @property {string} tokenSecret - The token secret for OAuth 1.0.
 */
export interface OAuth10a {
    algorithm: 'HMAC-SHA1' | 'HMAC-SHA256';
    consumerKey: string;
    consumerSecret: string;
    token: string;
    tokenSecret: string;
    includeBodyHash?: boolean | 'auto';
    realm?: string;
    callback?: string;
    verifier?: string;
}

/**
 * Represents OAuth 2.0 authentication credentials.
 *
 * @property {T} credentials - The credentials for OAuth 2.0.
 * @property {() => Promise<string>} accessToken - A function that returns a promise resolving to an access token.
 */
export interface OAuth20<T = Record<string, string>> {
    credentials: T;
    accessToken: () => Promise<string>;
}
