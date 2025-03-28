import { formatFiles, readNxJson, Tree, updateNxJson } from '@nx/devkit';
import { InitGeneratorSchema } from './schema';

/**
 * Initializes the Nx Serverless plugin by adding it to the `nx.json` configuration file.
 *
 * This generator ensures that the `@nx/nx-serverless/plugin` is registered in the `plugins` section
 * of the `nx.json` file. If the plugin is already present, no changes are made. If not, it adds the
 * plugin with default options.
 *
 * @param {Tree} tree - The file system tree representing the current project.
 * @param {InitGeneratorSchema} _options - The options passed to the generator (currently unused).
 * @returns {Promise<void>} A promise that resolves when the generator has completed its task.
 */
export async function initGenerator(tree: Tree, _options: InitGeneratorSchema): Promise<void> {
    const nxJson = readNxJson(tree) || {};
    const hasPlugin = nxJson.plugins?.some(p =>
        typeof p === 'string'
            ? p === '@aligent/nx-serverless/plugin'
            : p.plugin === '@aligent/nx-serverless/plugin'
    );

    if (!hasPlugin) {
        if (!nxJson.plugins) {
            nxJson.plugins = [];
        }
        nxJson.plugins = [
            ...nxJson.plugins,
            { plugin: '@aligent/nx-serverless/plugin', options: {} },
        ];
    }

    updateNxJson(tree, nxJson);
    await formatFiles(tree);
}

export default initGenerator;
