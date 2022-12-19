interface RetryConfig {
    /** The number of retries to attempt after the first run */
    retries: number;
    /** The base delay between retries */
    delay: number;
    /** The amount to increase the delay by each retry */
    backoffRate: number;
    /**
     * A callback to run before each retry
     * @param retries the number of retries so far (will start at 1)
     * @param error the error from the last attempt
     */
    onRetry?: (retries: number, error: Error, config: RetryConfig) => void;
}

/**
 * Retry an async function if it fails
 * @param fn the function to be retried
 * @param config the configuration for retries
 * @param retryCount the number of retries so far
 * @param error the error from teh last retry
 */
async function retryWrapperInternal<T>(
    fn: () => Promise<T>,
    config: RetryConfig,
    retryCount: number,
    error?: Error
): Promise<T> {
    if (config.retries < 0) {
        throw error;
    }
    if (error) {
        if (config.onRetry) {
            config.onRetry(retryCount, error, config);
        }
    }
    try {
        const result = await fn();
        return result;
    } catch (err) {
        await (() => new Promise((res) => setTimeout(res, config.delay)))();
        return await retryWrapperInternal(
            fn,
            {
                ...config,
                retries: config.retries - 1,
                delay: config.delay + config.backoffRate,
            },
            retryCount + 1,
            err
        );
    }
}

/**
 * Retry an async function if it fails
 * @param fn the function to be retried
 * @param config the configuration for retries
 */
export async function retryWrapper<T>(
    fn: () => Promise<T>,
    config: Partial<RetryConfig>
): Promise<T> {
    const defaultConfig: RetryConfig = {
        retries: 1,
        delay: 0,
        backoffRate: 0
    };
    return await retryWrapperInternal(
        fn,
        {
            ...defaultConfig,
            ...config
        },
        0
    );

}
