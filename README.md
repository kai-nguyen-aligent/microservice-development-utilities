# Microservice Development Utilities

Aligent's monorepo for Microservice Development Utilities. For more details about each package, check out the read me file for each of them.

# Packages

- [Microservice Util Lib](/packages/microservice-util-lib/README.md)
- [Nx Openapi](/packages/nx-openapi/README.md)
- [Nx Serverless](/packages/nx-serverless/README.md)

# Release Process

Each of the packages in the monorepo have seperate versioning and independent npm releases. To perform a release of one or more packages we use Version Plans to define the type of updates and provide messages. Nx will then detect the version plans and automatically update version numbers appropriately, as well as perform seperate builds and deployments in the pipeline if a version plan is detected.

### To create a release:

- `npm run release-plan` to create a release plan based on the detected changes in one or more services. This will prompt you to provide the type of change for each package (patch, minor, major etc.) and the description of the changes. This generates a version-plan file.
- Commit the changes to the repository.
- Upon merge the release pipeline will use the version file to perform the independent releases to npm

[!WARNING]
Nx is responsible for removing the version plans after a publish occurs. This is because **having multiple version plan files may produce unpredicible results**. For this reason make sure dont commit more than 1 version file. Its also good practice to create version files via the CLI tool rather than manually, as they will have more unique identifiers attached to their file names.
