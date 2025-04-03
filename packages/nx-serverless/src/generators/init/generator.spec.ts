import { NxJsonConfiguration, readNxJson, Tree, updateJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { initGenerator } from './generator';

describe('@aligent/nx-serverless:init', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should add plugin configuration with default options', async () => {
        updateJson<NxJsonConfiguration>(tree, 'nx.json', json => {
            json.namedInputs ??= {};
            json.namedInputs.production = ['default'];
            return json;
        });

        await initGenerator(tree, {});

        const nxJson = readNxJson(tree);

        expect(nxJson).toMatchInlineSnapshot(`
            {
              "affected": {
                "defaultBase": "main",
              },
              "namedInputs": {
                "production": [
                  "default",
                ],
              },
              "plugins": [
                {
                  "options": {},
                  "plugin": "@aligent/nx-serverless/plugin",
                },
              ],
              "targetDefaults": {
                "build": {
                  "cache": true,
                },
                "lint": {
                  "cache": true,
                },
              },
            }
        `);
    });

    it('should not overwrite existing plugin configuration', async () => {
        updateJson<NxJsonConfiguration>(tree, 'nx.json', json => {
            json.namedInputs ??= {};
            json.namedInputs.production = ['default'];
            json.plugins ??= [
                {
                    plugin: '@aligent/nx-serverless/plugin',
                    options: {
                        buildTargetName: 'build',
                        deployTargetName: 'deploy',
                        removeTargetName: 'remove',
                    },
                },
            ];
            return json;
        });

        await initGenerator(tree, {});

        const nxJson = readNxJson(tree);

        expect(nxJson).toMatchInlineSnapshot(`
            {
              "affected": {
                "defaultBase": "main",
              },
              "namedInputs": {
                "production": [
                  "default",
                ],
              },
              "plugins": [
                {
                  "options": {
                    "buildTargetName": "build",
                    "deployTargetName": "deploy",
                    "removeTargetName": "remove",
                  },
                  "plugin": "@aligent/nx-serverless/plugin",
                },
              ],
              "targetDefaults": {
                "build": {
                  "cache": true,
                },
                "lint": {
                  "cache": true,
                },
              },
            }
        `);
    });

    it('should not overwrite existing short form plugin configuration', async () => {
        updateJson<NxJsonConfiguration>(tree, 'nx.json', json => {
            json.namedInputs ??= {};
            json.namedInputs.production = ['default'];
            json.plugins ??= ['@aligent/nx-serverless/plugin'];
            return json;
        });

        await initGenerator(tree, {});

        const nxJson = readNxJson(tree);

        expect(nxJson).toMatchInlineSnapshot(`
            {
              "affected": {
                "defaultBase": "main",
              },
              "namedInputs": {
                "production": [
                  "default",
                ],
              },
              "plugins": [
                "@aligent/nx-serverless/plugin",
              ],
              "targetDefaults": {
                "build": {
                  "cache": true,
                },
                "lint": {
                  "cache": true,
                },
              },
            }
        `);
    });
});
