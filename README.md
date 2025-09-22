# Microservice Development Utilities

Aligent's monorepo for Microservice Development Utilities. For more details about each package, check out the read me file for each of them.

# Packages

- [Microservice Util Lib](/packages/microservice-util-lib/README.md)
- [Nx Openapi](/packages/nx-openapi/README.md)
- [Nx Serverless](/packages/nx-serverless/README.md)

# Release Process

Each of the packages in the monorepo have separate versioning and independent npm releases. To perform a release of one or more packages we use [Version Plans](https://nx.dev/recipes/nx-release/file-based-versioning-version-plans) to define the type of updates and provide change log. Nx will then detect the version plans and automatically update version numbers appropriately, as well as perform builds and deployments separately in the pipeline if a version plan is detected.

### Step-by-Step Guide

1. Start by creating a new branch from the latest `main` branch.

2. Create a new version plan: Run the following command to generate a version plan based on your changes:

   ```bash
   npm run release-plan
   ```

   Follow the prompts to select the type of change (patch, minor, major, etc.) and provide a description for each affected package. This will create a version plan file in the repository.

3. Merge to `main`:

   - Commit your changes, including the version plan file.
   - Open a pull request targeting the `main` branch.
   - Ensure your PR contains only one version plan file.
   - Once approved, merge your branch into `main`.

4. Manually run the `release` Pipeline
   - After merging, trigger the `release` pipeline manually (via Github Action UI).
   - The pipeline will:
     - Detect the version plan file.
     - Build and publish the affected packages to npm.
     - Remove the version plan file after a successful publish.

### Notes

- The `release` pipeline will fail if a version plan is not present in your merged changes. However, the `pull-request` pipeline does not check for version plan. We do this as there might be situations where we want to commit to main without a release.
- Nx is responsible for removing the version plans after a release. This is because **having multiple version plan files may produce unpredictable results**. For this reason make sure not to commit more than one version plan file.
- Always use the provided command to generate version plan files for uniqueness and correctness.
- Test 5 no version plan, no need to release etc.
