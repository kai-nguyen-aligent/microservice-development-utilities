import { getPackageManagerCommand, joinPathFragments, TargetDependencyConfig } from '@nx/devkit';

const pmc = getPackageManagerCommand();

/**
 * Builds the configuration for the `build` target of a Serverless project.
 *
 * @param {string} name - The name of the project.
 * @param {string} projectRoot - The root directory of the project.
 * @param {Record<string, unknown>} namedInputs - The named inputs for the `build` target.
 * @param {string[]} outputs - The output paths for the `build` target.
 * @returns {object} The configuration object of the `build` target.
 */
export function buildBuildTarget(
    name: string,
    projectRoot: string,
    namedInputs: Record<string, unknown>,
    outputs: string[]
): object {
    const dependenciesConfig: TargetDependencyConfig = {
        projects: '{dependencies}',
        target: 'build',
        params: 'forward',
    };

    return {
        command: 'serverless package',
        options: { cwd: joinPathFragments(projectRoot) },
        cache: true,
        dependsOn: [dependenciesConfig],
        inputs: [
            ...('production' in namedInputs
                ? ['production', '^production']
                : ['default', '^default']),
            { externalDependencies: ['serverless'] },
        ],
        outputs,
        metadata: {
            technologies: ['Serverless'],
            description: `Build stack using Serverless`,
            help: {
                command: `${pmc.exec} nx run ${name}:build --help`,
                example: {
                    options: {
                        stage: 'dev',
                        profile: 'development',
                    },
                },
            },
        },
    };
}

/**
 * Builds the configuration for the `deploy` target of a Serverless project.
 *
 * @param {string} name - The name of the project.
 * @param {string} projectRoot - The root directory of the project.
 * @param {Record<string, unknown>} namedInputs - The named inputs for the `deploy` target.
 * @param {string[]} outputs - The output paths for the `deploy` target.
 * @returns {object} The configuration object of the `deploy` target.
 */
export function buildDeployTarget(
    name: string,
    projectRoot: string,
    namedInputs: Record<string, unknown>
): object {
    const dependenciesConfig: TargetDependencyConfig = {
        projects: '{dependencies}',
        target: 'deploy',
        params: 'forward',
    };

    return {
        command: 'serverless deploy',
        options: { cwd: joinPathFragments(projectRoot) },
        cache: false,
        dependsOn: [dependenciesConfig],
        inputs: [
            ...('production' in namedInputs
                ? ['production', '^production']
                : ['default', '^default']),
            { externalDependencies: ['serverless'] },
        ],
        metadata: {
            technologies: ['Serverless'],
            description: `Deploy stack using Serverless`,
            help: {
                command: `${pmc.exec} nx run ${name}:deploy --help`,
                example: {
                    options: {
                        stage: 'dev',
                        profile: 'development',
                    },
                },
            },
        },
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
): object {
    // Find and collect all the project names where this project is a dependency
    const projects = Object.keys(dependencies).filter(dep => dependencies[dep]?.includes(name));

    const dependenciesConfig: TargetDependencyConfig = {
        projects,
        target: 'remove',
        params: 'forward',
    };

    return {
        command: 'serverless remove',
        options: { cwd: joinPathFragments(projectRoot) },
        cache: false,
        dependsOn: [dependenciesConfig],
        inputs: [
            ...('production' in namedInputs
                ? ['production', '^production']
                : ['default', '^default']),
            { externalDependencies: ['serverless'] },
        ],
        metadata: {
            technologies: ['Serverless'],
            description: `Remove stack using Serverless`,
            help: {
                command: `${pmc.exec} nx run ${name}:remove --help`,
                example: {
                    options: {
                        stage: 'dev',
                        profile: 'development',
                    },
                },
            },
        },
    };
}
