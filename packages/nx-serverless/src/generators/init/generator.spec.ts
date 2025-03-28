import { NxJsonConfiguration, readNxJson, Tree, updateJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { initGenerator } from './generator';

describe('@aligent/nx-serverless:init', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should add target defaults for test', async () => {
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
});
