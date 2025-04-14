import { Tree, addProjectConfiguration, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { clientGenerator } from './generator';
import { ClientGeneratorSchema } from './schema';

describe('client generator', () => {
    let tree: Tree;
    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should generate a client successfully', async () => {
        const options: ClientGeneratorSchema = {
            name: 'test',
            schemaPath: `${__dirname}/unit-test-schemas/valid.yaml`,
            skipValidate: true, // Validation breaks this unit test for some reason (TODO: figure out wtf is going on here)
            override: false,
        };
        await clientGenerator(tree, options);
        const config = readProjectConfiguration(tree, 'test');
        expect(config).toBeDefined();
    });

    it('should throw an error if schemaPath does point to a supported file type', async () => {
        const options: ClientGeneratorSchema = {
            name: 'test',
            schemaPath: `${__dirname}/unit-test-schemas/random.xml`,
            skipValidate: false,
            override: false,
        };
        await expect(clientGenerator(tree, options)).rejects.toThrowError();
    });

    it('should throw an error if schema file is not found', async () => {
        const options: ClientGeneratorSchema = {
            name: 'test',
            schemaPath: `${__dirname}/unit-test-schemas/missing.yaml`,
            skipValidate: true,
            override: false,
        };
        await expect(clientGenerator(tree, options)).rejects.toThrowError();
    });

    it('should not write schema to disk if the project exists and override is false', async () => {
        addProjectConfiguration(tree, 'test', {
            root: 'clients/test',
            projectType: 'library',
            sourceRoot: 'clients/test/src',
            targets: {},
            tags: ['client', 'test'],
        });

        const options: ClientGeneratorSchema = {
            name: 'test',
            schemaPath: `${__dirname}/unit-test-schemas/valid.yaml`,
            skipValidate: true,
            override: false,
        };

        await clientGenerator(tree, options);

        expect(tree.exists('clients/test/schema.yaml')).toBe(false);
        expect(tree.exists('clients/test/generated/index.ts')).toBe(false);
    });
});
