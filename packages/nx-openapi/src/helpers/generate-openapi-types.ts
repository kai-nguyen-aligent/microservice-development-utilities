import { logger, Tree } from '@nx/devkit';
import { lint, loadConfig } from '@redocly/openapi-core';
import { readFileSync } from 'fs';
import openapiTS, { astToString } from 'openapi-typescript';

/**
 * Grabs schema data from local directory. The schemaPath is evaluated relative to the root of the template project,
 * not the root of the generator.
 * @param rootDir Root directory of the project tree
 * @param schemaPath Path of the schema relative to the root of the entire project.
 * @param typeDest Destination of the generated types.
 * @returns Promise<void>
 */
export async function generateOpenApiTypes(tree: Tree, schemaPath: string, typeDest: string) {
    try {
        logger.info(`Generating types from ${schemaPath}`);
        const ast = await openapiTS(tree.read(schemaPath));

        tree.write(typeDest, astToString(ast));
    } catch (e) {
        throw new Error(`Failed to generate types for path ${schemaPath}` + e);
    }
}

// We do not want to test this function.
// It only download/copy the schema to a specified destination.
/* v8 ignore start */
/**
 * Copies the original schema from the source to newly generated client
 */
export async function copySchema(tree: Tree, destination: string, schemaPath: string) {
    const isRemoteSchema = schemaPath.startsWith('http://') || schemaPath.startsWith('https://');

    let schema: Buffer | null;

    if (isRemoteSchema) {
        const response = await fetch(schemaPath);
        schema = Buffer.from(await response.arrayBuffer());
    } else {
        schema = readFileSync(schemaPath);
    }

    if (!schema || !schema.length) {
        throw new Error(`Failed to read schema at ${schemaPath}`);
    }

    tree.write(destination, schema);

    console.log(`Schema copied to ${destination}, length: ${schema.length}`);
}
/* v8 ignore end */

export async function validateSchema(path: string) {
    let hasError = false;
    try {
        const config = await loadConfig();
        const results = await lint({ ref: path, config });

        results.forEach(result => {
            const location = result.location.map(({ pointer, reportOnKey }) => ({
                pointer,
                reportOnKey,
            }));

            if (result.severity === 'warn') {
                logger.warn(
                    JSON.stringify({ location, message: result.message, severity: result.severity })
                );
                return;
            }

            logger.error(
                JSON.stringify({ location, message: result.message, severity: result.severity })
            );
            hasError = true;
        });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        logger.error(`Failed to validate schema: ${message}`);
        hasError = true;
    }

    return hasError;
}
