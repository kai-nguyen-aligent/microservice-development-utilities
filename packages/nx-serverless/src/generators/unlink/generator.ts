import {
    ProjectConfiguration,
    Tree,
    getProjects,
    logger,
    updateProjectConfiguration,
} from '@nx/devkit';
import { hasNonExistProject } from '../../helpers/projects';
import { UnlinkGeneratorSchema } from './schema';

/**
 * Unlinks the specified dependencies from the given targets.
 *
 * This generator will throw errors if any of the specified targets or dependencies do not exist.
 * It will then remove the specified dependencies from the specified targets.
 *
 * @param {Tree} tree - The file system tree representing the current project.
 * @param {UnlinkGeneratorSchema} options - The options passed to the generator, containing the targets and dependencies.
 * @returns {Promise<void>} A promise that resolves when the generator has completed its task.
 */
export async function unlinkGenerator(tree: Tree, options: UnlinkGeneratorSchema) {
    const { targets, dependencies } = options;
    const projects = getProjects(tree);

    const nonExistTargets = hasNonExistProject(projects, targets);
    const nonExistDependencies = hasNonExistProject(projects, dependencies);

    if (nonExistTargets.length || nonExistDependencies.length) {
        throw new Error(
            `Projects ${nonExistTargets.concat(nonExistDependencies).join(', ')} do not exist`
        );
    }

    for (const target of targets) {
        // We're 99% sure that target project exist so it's safe to cast type
        const current = projects.get(target) as ProjectConfiguration;

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
        `Successfully removed ${dependencies.join(', ')} from dependencies of ${targets.join(', ')}`
    );
}

export default unlinkGenerator;
