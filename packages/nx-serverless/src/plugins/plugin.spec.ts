import { CreateNodesContext } from '@nx/devkit';
import { TempFs } from '../internal/temp-fs';
import { createNodesV2 } from './plugin';

describe('@nx/nx-serverless plugin', () => {
    const createNodesFunction = createNodesV2[1];
    let context: CreateNodesContext;
    let tempFs: TempFs;

    beforeEach(() => {
        tempFs = new TempFs('test');
        context = {
            configFiles: [],
            nxJsonConfiguration: {
                namedInputs: {
                    default: ['{projectRoot}/**/*'],
                    production: ['!{projectRoot}/**/*.spec.ts'],
                },
            },
            workspaceRoot: tempFs.tempDir,
        };

        tempFs.createFileSync('my-app/random.json', '');
    });

    afterEach(() => {
        vi.resetModules();
        tempFs.cleanup();
    });

    it('should create nodes', async ({ expect }) => {
        tempFs.createFileSync('my-app/project.json', JSON.stringify({ name: 'my-app' }));
        const nodes = await createNodesFunction(
            ['my-app/serverless.yml'],
            {
                buildTargetName: 'build',
                deployTargetName: 'deploy',
                removeTargetName: 'remove',
            },
            context
        );

        expect(nodes).toMatchSnapshot();
    });

    it('should not create nodes when project.json is not present', async ({ expect }) => {
        const nodes = await createNodesFunction(
            ['my-app/serverless.yaml'],
            {
                buildTargetName: 'build',
                deployTargetName: 'deploy',
                removeTargetName: 'remove',
            },
            context
        );

        expect(nodes).toMatchInlineSnapshot(`
    [
      [
        "my-app/serverless.yaml",
        {
          "projects": {
            "my-app": {
              "metadata": {},
              "root": "my-app",
              "targets": {},
            },
          },
        },
      ],
    ]
  `);
    });
});
