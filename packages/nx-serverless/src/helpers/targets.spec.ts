import { joinPathFragments } from '@nx/devkit';
import { buildBuildTarget, buildDeployTarget, buildRemoveTarget } from './targets';

describe('buildBuildTarget', () => {
    it('should return a valid build target configuration for production', () => {
        const name = 'test-project';
        const projectRoot = 'apps/test-project';
        const namedInputs = { production: ['default', '!{projectRoot}/eslint.config.m[jt]s'] };
        const outputs = ['dist/apps/test-project'];

        const result = buildBuildTarget(name, projectRoot, namedInputs, outputs);

        expect(result).toEqual({
            command: 'serverless package',
            options: { cwd: joinPathFragments(projectRoot) },
            cache: true,
            dependsOn: [
                {
                    dependencies: true,
                    target: 'build',
                    params: 'forward',
                },
            ],
            inputs: ['production', '^production', { externalDependencies: ['serverless'] }],
            outputs,
            metadata: {
                technologies: ['Serverless'],
                description: `Build stack using Serverless`,
                help: {
                    command: expect.stringContaining('nx run test-project:build --help'),
                    example: {
                        options: {
                            stage: 'dev',
                            profile: 'development',
                        },
                    },
                },
            },
        });
    });

    it('should return a valid build target configuration for non-production', () => {
        const name = 'test-project';
        const projectRoot = 'apps/test-project';
        const namedInputs = { test: ['default', '!{projectRoot}/eslint.config.m[jt]s'] };
        const outputs = ['dist/apps/test-project'];

        const result = buildBuildTarget(name, projectRoot, namedInputs, outputs);

        expect(result).toEqual({
            command: 'serverless package',
            options: { cwd: joinPathFragments(projectRoot) },
            cache: true,
            dependsOn: [
                {
                    dependencies: true,
                    target: 'build',
                    params: 'forward',
                },
            ],
            inputs: ['default', '^default', { externalDependencies: ['serverless'] }],
            outputs,
            metadata: {
                technologies: ['Serverless'],
                description: `Build stack using Serverless`,
                help: {
                    command: expect.stringContaining('nx run test-project:build --help'),
                    example: {
                        options: {
                            stage: 'dev',
                            profile: 'development',
                        },
                    },
                },
            },
        });
    });
});

describe('buildDeployTarget', () => {
    it('should return a valid deploy target configuration for production', () => {
        const name = 'test-project';
        const projectRoot = 'apps/test-project';
        const namedInputs = { production: ['default', '!{projectRoot}/eslint.config.m[jt]s'] };

        const result = buildDeployTarget(name, projectRoot, namedInputs);

        expect(result).toEqual({
            command: 'serverless deploy',
            options: { cwd: joinPathFragments(projectRoot) },
            cache: false,
            dependsOn: [
                {
                    dependencies: true,
                    target: 'deploy',
                    params: 'forward',
                },
            ],
            inputs: ['production', '^production', { externalDependencies: ['serverless'] }],
            metadata: {
                technologies: ['Serverless'],
                description: `Deploy stack using Serverless`,
                help: {
                    command: expect.stringContaining('nx run test-project:deploy --help'),
                    example: {
                        options: {
                            stage: 'dev',
                            profile: 'development',
                        },
                    },
                },
            },
        });
    });

    it('should return a valid deploy target configuration for non-production', () => {
        const name = 'test-project';
        const projectRoot = 'apps/test-project';
        const namedInputs = { staging: ['default', '!{projectRoot}/eslint.config.m[jt]s'] };

        const result = buildDeployTarget(name, projectRoot, namedInputs);

        expect(result).toEqual({
            command: 'serverless deploy',
            options: { cwd: joinPathFragments(projectRoot) },
            cache: false,
            dependsOn: [
                {
                    dependencies: true,
                    target: 'deploy',
                    params: 'forward',
                },
            ],
            inputs: ['default', '^default', { externalDependencies: ['serverless'] }],
            metadata: {
                technologies: ['Serverless'],
                description: `Deploy stack using Serverless`,
                help: {
                    command: expect.stringContaining('nx run test-project:deploy --help'),
                    example: {
                        options: {
                            stage: 'dev',
                            profile: 'development',
                        },
                    },
                },
            },
        });
    });
});

describe('buildRemoveTarget', () => {
    it('should return a valid remove target configuration', () => {
        const name = 'test-project';
        const projectRoot = 'apps/test-project';
        const dependencies = {
            'dependent-project-1': ['test-project'],
            'dependent-project-2': ['test-project'],
        };
        const namedInputs = { production: ['default', '!{projectRoot}/eslint.config.m[jt]s'] };

        const result = buildRemoveTarget(name, projectRoot, dependencies, namedInputs);

        expect(result).toEqual({
            command: 'serverless remove',
            options: { cwd: joinPathFragments(projectRoot) },
            cache: false,
            dependsOn: [
                {
                    projects: ['dependent-project-1', 'dependent-project-2'],
                    target: 'remove',
                    params: 'forward',
                },
            ],
            inputs: ['production', '^production', { externalDependencies: ['serverless'] }],
            metadata: {
                technologies: ['Serverless'],
                description: `Remove stack using Serverless`,
                help: {
                    command: expect.stringContaining('nx run test-project:remove --help'),
                    example: {
                        options: {
                            stage: 'dev',
                            profile: 'development',
                        },
                    },
                },
            },
        });
    });
});
