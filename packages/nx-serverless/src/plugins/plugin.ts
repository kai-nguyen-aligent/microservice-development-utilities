import {
    CreateNodesContext,
    createNodesFromFiles,
    CreateNodesV2,
    detectPackageManager,
    ProjectConfiguration,
    readJsonFile,
    TargetConfiguration,
    writeJsonFile,
} from '@nx/devkit';
import { calculateHashForCreateNodes } from '@nx/devkit/src/utils/calculate-hash-for-create-nodes';
import { getNamedInputs } from '@nx/devkit/src/utils/get-named-inputs';
import { getLockFileName } from '@nx/js';
import { existsSync, readdirSync } from 'fs';
import { hashObject } from 'nx/src/hasher/file-hasher';
import { workspaceDataDirectory } from 'nx/src/utils/cache-directory';
import { dirname, join } from 'path';
import { buildBuildTarget, buildDeployTarget, buildRemoveTarget } from '../helpers/targets';

type ServerlessTargets = Pick<ProjectConfiguration, 'targets' | 'metadata'>;

export interface ServerlessPluginOptions {
    buildTargetName?: string;
    deployTargetName?: string;
    removeTargetName?: string;
}

const SERVERLESS_CONFIG_PATTERN = '**/serverless.{yml,yaml}';
const SERVERLESS_BUILD_OUTPUT = '{projectRoot}/.serverless';

/**
 * A Serverless plugin that creates nodes for Nx projects based on Serverless configuration files.
 *
 * @type {CreateNodesV2<ServerlessPluginOptions>}
 */
export const createNodesV2: CreateNodesV2<ServerlessPluginOptions> = [
    SERVERLESS_CONFIG_PATTERN,
    async (configFilePaths, options, context) => {
        const optionHash = hashObject(options || {});
        const cachePath = join(workspaceDataDirectory, `serverless-${optionHash}.hash`);

        // Reads the cached targets from a cache file.
        const targetsCache = existsSync(cachePath) ? readJsonFile(cachePath) : {};

        // Ensure configFilePaths is an array as glob returns a string if there is only one file
        configFilePaths = Array.isArray(configFilePaths) ? configFilePaths : [configFilePaths];

        const projects = getProjects(context.workspaceRoot, configFilePaths).filter(
            project => project !== null
        );
        const dependencies = getDependencies(projects);

        try {
            return createNodesFromFiles(
                async (configFile, options, context) =>
                    await createNodesInternal(
                        configFile,
                        options,
                        context,
                        dependencies,
                        targetsCache
                    ),
                configFilePaths,
                options,
                context
            );
        } finally {
            // Writes the targets to a cache file.
            writeJsonFile(cachePath, targetsCache);
        }
    },
];

/**
 * Internal function to create nodes for a specific Serverless project.
 *
 * @param {string} configFilePath - The path to the Serverless configuration file.
 * @param {ServerlessPluginOptions | undefined} options - The options passed to the plugin.
 * @param {CreateNodesContext} context - The context for creating nodes.
 * @param {Record<string, string[]>} dependencies - The dependencies of the project.
 * @param {Record<string, ServerlessTargets>} targetsCache - The cache for Serverless targets.
 * @returns {Promise<{ projects: Record<string, ProjectConfiguration> }>} The created project nodes.
 */
async function createNodesInternal(
    configFilePath: string,
    options: ServerlessPluginOptions | undefined,
    context: CreateNodesContext,
    dependencies: Record<string, string[]>,
    targetsCache: Record<string, ServerlessTargets>
): Promise<{ projects: Record<string, ProjectConfiguration> }> {
    const projectRoot = dirname(configFilePath);
    const normalizedOptions = normalizeOptions(options);

    // We do not want to alter how the hash is calculated, so appending the config file path to the hash
    // to prevent overwriting the target cache created by the other plugins.
    const hash =
        (await calculateHashForCreateNodes(
            projectRoot,
            // We also make sure that the cache tracks projects dependencies graph.
            { ...options, dependencies },
            context,
            [getLockFileName(detectPackageManager(context.workspaceRoot))]
        )) + configFilePath;

    targetsCache[hash] ??= await buildServerlessTargets(
        projectRoot,
        normalizedOptions,
        dependencies,
        context
    );

    const { targets, metadata } = targetsCache[hash];
    const project: ProjectConfiguration = {
        root: projectRoot,
        targets,
        metadata,
    };

    return {
        projects: {
            [projectRoot]: project,
        },
    };
}

/**
 * Builds the targets for a Serverless project.
 *
 * @param {string} projectRoot - The root directory of the project.
 * @param {Required<ServerlessPluginOptions>} options - The normalized options for the plugin.
 * @param {Record<string, string[]>} dependencies - The dependencies of the project.
 * @param {CreateNodesContext} context - The context for creating nodes.
 * @returns {Promise<ServerlessTargets>} The targets and metadata for the Serverless project.
 */
async function buildServerlessTargets(
    projectRoot: string,
    options: Required<ServerlessPluginOptions>,
    dependencies: Record<string, string[]>,
    context: CreateNodesContext
): Promise<ServerlessTargets> {
    const targets: Record<string, TargetConfiguration> = {};
    const metadata = {};

    if (!isProject(context.workspaceRoot, projectRoot)) {
        return { targets, metadata };
    }

    const name = readJsonFile(join(context.workspaceRoot, projectRoot, 'project.json')).name;
    const namedInputs = getNamedInputs(projectRoot, context);

    targets[options.buildTargetName] = buildBuildTarget(name, projectRoot, namedInputs, [
        SERVERLESS_BUILD_OUTPUT,
    ]);

    targets[options.deployTargetName] = buildDeployTarget(name, projectRoot, namedInputs);

    targets[options.removeTargetName] = buildRemoveTarget(
        name,
        projectRoot,
        dependencies,
        namedInputs
    );

    return { targets, metadata };
}

/**
 * Normalizes the options for the Serverless plugin by providing default values for missing fields.
 *
 * @param {ServerlessPluginOptions | undefined} options - The options passed to the plugin.
 * @returns {Required<ServerlessPluginOptions>} The normalized options with default values.
 */
export function normalizeOptions(
    options: ServerlessPluginOptions | undefined
): Required<ServerlessPluginOptions> {
    return {
        buildTargetName: options?.buildTargetName || 'build',
        deployTargetName: options?.deployTargetName || 'deploy',
        removeTargetName: options?.removeTargetName || 'remove',
    };
}

/**
 * Determines if a directory is a valid Nx project by checking for the presence of a `project.json` file.
 *
 * @param {string} workspaceRoot - The root directory of the workspace.
 * @param {string} projectRoot - The root directory of the project.
 * @returns {boolean} `true` if the directory is a valid Nx project, otherwise `false`.
 */
function isProject(workspaceRoot: string, projectRoot: string): boolean {
    const siblingFiles = readdirSync(join(workspaceRoot, projectRoot));

    return siblingFiles.includes('project.json');
}

/**
 * Retrieves the Nx projects based on the provided Serverless configuration file paths.
 *
 * @param {string} workspaceRoot - The root directory of the workspace.
 * @param {readonly string[]} configFilePaths - The paths to the Serverless configuration files.
 * @returns {ProjectConfiguration[]} The Nx projects corresponding to the configuration files.
 */
function getProjects(
    workspaceRoot: string,
    configFilePaths: readonly string[]
): ProjectConfiguration[] {
    return configFilePaths
        .map(path => {
            const projectRoot = dirname(path);
            if (!isProject(workspaceRoot, projectRoot)) {
                return null;
            }

            return readJsonFile<ProjectConfiguration>(
                join(workspaceRoot, projectRoot, 'project.json')
            );
        })
        .filter(project => project !== null);
}

/**
 * Retrieves the dependencies for the provided Nx projects.
 *
 * @param {ProjectConfiguration[]} projects - The Nx projects.
 * @returns {Record<string, string[]>} A map of project names to their dependencies.
 */
function getDependencies(projects: ProjectConfiguration[]): Record<string, string[]> {
    const dependencies: Record<string, string[]> = {};

    projects.forEach(project => {
        if (project.name) {
            dependencies[project.name] = project.implicitDependencies || [];
        }
    });

    return dependencies;
}
