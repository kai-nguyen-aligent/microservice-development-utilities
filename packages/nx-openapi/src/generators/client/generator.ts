import { Tree, formatFiles, generateFiles, joinPathFragments, logger } from '@nx/devkit';
import {
    copySchema,
    generateOpenApiTypes,
    validateSchema,
} from '../../helpers/generate-openapi-types';
import { addTsConfigPath, attemptToAddProjectConfiguration } from '../../helpers/utilities';
import { ClientGeneratorSchema } from './schema';

const VALID_EXTENSIONS = ['yaml', 'yml', 'json'];

export async function clientGenerator(tree: Tree, options: ClientGeneratorSchema) {
    const { name, schemaPath, importPath = `@clients/${name}`, skipValidate, override } = options;

    const ext = schemaPath.split('.').pop() || '';
    if (!VALID_EXTENSIONS.includes(ext)) {
        throw new Error(`Invalid schema file extension: ${ext}`);
    }

    // TODO MI-201 Unit tests fail when performing schema validation
    /* v8 ignore next 3 */
    if (!skipValidate) {
        await validateSchema(schemaPath);
    }

    const projectRoot = `clients/${name}`;
    const schemaDest = `${projectRoot}/schema.${ext}`;
    const typesDest = `${projectRoot}/generated/index.ts`;

    const isNewProject = attemptToAddProjectConfiguration(tree, name, projectRoot);

    if (!isNewProject && !override) {
        logger.info(
            `Project ${name} already exists. Use --override to override the existing schema.`
        );
        return;
    }

    if (isNewProject) {
        logger.info(`Creating new project at ${projectRoot}`);

        // Generate other files
        generateFiles(tree, joinPathFragments(__dirname, './files'), projectRoot, options);

        // Add the project to the tsconfig paths so it can be imported by namespace
        addTsConfigPath(tree, importPath, [joinPathFragments(projectRoot, './src', 'index.ts')]);
    }

    await copySchema(tree, schemaDest, schemaPath);

    await generateOpenApiTypes(tree, schemaDest, typesDest);

    await formatFiles(tree);
}

export default clientGenerator;
