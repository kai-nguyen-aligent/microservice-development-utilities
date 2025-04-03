import { getPackageManagerCommand, joinPathFragments, TargetConfiguration } from '@nx/devkit';
import { InputDefinition, TargetMetadata } from 'nx/src/config/workspace-json-project-json';

const pmc = getPackageManagerCommand();

/**
 * Builds the configuration for the `build` target of a Serverless project.
 *
 * @param {string} name - The name of the project.
 * @param {string} projectRoot - The root directory of the project.
 * @param {Record<string, unknown>} namedInputs - The named inputs for the `build` target.
 * @param {string[]} outputs - The output paths for the `build` target.
 * @returns {TargetConfiguration} The configuration object of the `build` target.
 */
export function buildBuildTarget(
    name: string,
    projectRoot: string,
    namedInputs: Record<string, unknown>,
    outputs: string[]
): TargetConfiguration {
    return {
        command: 'serverless package',
        options: { cwd: joinPathFragments(projectRoot) },
        cache: true,
        dependsOn: [{ dependencies: true, target: 'build', params: 'forward' }],
        inputs: constructInputs(namedInputs),
        outputs,
        metadata: constructMetaData(name, 'build', 'Build stack using Serverless'),
    };
}

/**
 * Builds the configuration for the `deploy` target of a Serverless project.
 *
 * @param {string} name - The name of the project.
 * @param {string} projectRoot - The root directory of the project.
 * @param {Record<string, unknown>} namedInputs - The named inputs for the `deploy` target.
 * @param {string[]} outputs - The output paths for the `deploy` target.
 * @returns {TargetConfiguration} The configuration object of the `deploy` target.
 */
export function buildDeployTarget(
    name: string,
    projectRoot: string,
    namedInputs: Record<string, unknown>
): TargetConfiguration {
    return {
        command: 'serverless deploy',
        options: { cwd: joinPathFragments(projectRoot) },
        cache: false,
        dependsOn: [{ dependencies: true, target: 'deploy', params: 'forward' }],
        inputs: constructInputs(namedInputs),
        metadata: constructMetaData(name, 'deploy', 'Deploy stack using Serverless'),
    };
}

/**
 * Builds the configuration for the `remove` target of a Serverless project.
 *
 * @param {string} name - The name of the project.
 * @param {string} projectRoot - The root directory of the project.
 * @param {Record<string, unknown>} namedInputs - The named inputs for the `remove` target.
 * @param {string[]} outputs - The output paths for the `remove` target.
 * @returns {object} The configuration object of the `remove` target.
 */
export function buildRemoveTarget(
    name: string,
    projectRoot: string,
    dependencies: Record<string, string[]>,
    namedInputs: Record<string, unknown>
): TargetConfiguration {
    // Find and collect all the project names where this project is a dependency
    const projects = Object.keys(dependencies).filter(dep => dependencies[dep]?.includes(name));

    return {
        command: 'serverless remove',
        options: { cwd: joinPathFragments(projectRoot) },
        cache: false,
        dependsOn: [{ projects, target: 'remove', params: 'forward' }],
        inputs: constructInputs(namedInputs),
        metadata: constructMetaData(name, 'remove', `Remove stack using Serverless`),
    };
}

/**
 * Constructs the inputs for a target.
 *
 * @param {Record<string, unknown>} namedInputs - The named inputs for the target.
 * @returns {Array} An array containing the inputs for the target.
 */
function constructInputs(namedInputs: Record<string, unknown>): Array<InputDefinition | string> {
    return [
        ...('production' in namedInputs ? ['production', '^production'] : ['default', '^default']),
        { externalDependencies: ['serverless'] },
    ];
}

/**
 * Constructs the metadata for a target.
 *
 * @param {string} projectName - The name of the project.
 * @param {string} targetName - The name of the target.
 * @param {string} description - The description of the target.
 * @returns {TargetMetadata} The metadata object for the target.
 */
function constructMetaData(
    projectName: string,
    targetName: string,
    description: string
): TargetMetadata {
    return {
        technologies: ['Serverless'],
        description,
        help: {
            command: `${pmc.exec} nx run ${projectName}:${targetName} --help`,
            example: {
                options: {
                    stage: 'dev',
                    profile: 'development',
                },
            },
        },
    };
}
