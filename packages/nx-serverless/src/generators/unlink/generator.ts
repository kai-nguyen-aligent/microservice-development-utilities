import {
    ProjectConfiguration,
    Tree,
    getProjects,
    logger,
    updateProjectConfiguration,
} from '@nx/devkit';
import { hasNonExistProject } from '../../helpers/projects';
import { UnlinkGeneratorSchema } from './schema';

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
