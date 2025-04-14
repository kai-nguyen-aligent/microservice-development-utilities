import { logger, Tree } from '@nx/devkit';
import { spawn } from 'child_process';
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

// This is ignored by coverage because its relying on a third party package to do the validation step
export async function validateSchema(schemaPath: string) {
    return new Promise((resolve, reject) => {
        const child = spawn('npx', ['@redocly/cli', 'lint', schemaPath], {
            stdio: ['pipe', 'inherit', 'inherit'],
        });

        child.on('close', code => {
            if (code === 0) {
                resolve(`Validation completed`);
            } else {
                reject(new Error(`Validation failed with code ${code}`));
            }
        });
    });
}
/* v8 ignore end */
