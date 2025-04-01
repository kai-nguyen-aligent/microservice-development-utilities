/* v8 ignore next */
import { Tree, getProjects, logger, updateProjectConfiguration } from '@nx/devkit';
import { hasNonExistProject } from '../../helpers/projects';
import { UnlinkGeneratorSchema } from './schema';

export async function unlinkGenerator(tree: Tree, options: UnlinkGeneratorSchema) {
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
        const current = projects.get(target);

        if (!current) {
            throw new Error(`Project ${target} does not exist`);
        }

        const implicitDependencies = current.implicitDependencies || [];

        const updatedImplicitDependencies = implicitDependencies.filter(
            dep => !dependencies.includes(dep)
        );

        updateProjectConfiguration(tree, target, {
            ...current,
            implicitDependencies: updatedImplicitDependencies,
        });
    }

    logger.info(
        `Successfully removed ${dependencies.join(', ')} as dependencies of  ${targets.join(', ')}`
    );
}

export default unlinkGenerator;
