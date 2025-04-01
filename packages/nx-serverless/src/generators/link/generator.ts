/* v8 ignore next */
import { getProjects, logger, Tree, updateProjectConfiguration } from '@nx/devkit';
import { hasNonExistProject } from '../../helpers/projects';
import { LinkGeneratorSchema } from './schema';

export async function linkGenerator(tree: Tree, options: LinkGeneratorSchema) {
    const { targets, dependencies } = options;
    const projects = getProjects(tree);

    const nonExistTargets = hasNonExistProject(projects, targets);
    const nonExistDependencies = hasNonExistProject(projects, dependencies);

    if (nonExistTargets.length || nonExistDependencies.length) {
        throw new Error(
            `Projects ${nonExistTargets.concat(nonExistDependencies).join(', ')} does not exist`
        );
    }

    for (const target of targets) {
        // This ensure we do not have circular dependencies
        const implicitDependencies = dependencies.filter(dep => dep != target);

        const current = projects.get(target);

        if (!current) {
            throw new Error(`Project ${target} does not exist`);
        }

        updateProjectConfiguration(tree, target, {
            ...current,
            implicitDependencies: Array.from(
                new Set((current.implicitDependencies || []).concat(implicitDependencies))
            ),
        });
    }

    logger.info(
        `Successfully added ${dependencies.join(', ')} as dependencies of  ${targets.join(', ')}`
    );
}

export default linkGenerator;
