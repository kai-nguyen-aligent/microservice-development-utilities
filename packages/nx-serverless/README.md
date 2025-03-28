# Nx Serverless

The `@aligent/nx-serverless` package provides Nx generators, executors and plugins for serverless development.

## Generators

- We support the following types of generators, and all generated services will be placed in the `services` folder. If the `services` folder does not exist, it will be created automatically.

- Our service generators requires a `brand` parameter which can be passed in when generating a service. However, for consistency, it's recommend that we configure the default value in `nx.json` file:

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "generators": {
    "@aligent/nx-serverless:service": {
      "brand": "brand-name"
    }
  }
}
```

### General:

- This generator creates a general service based on our predefined template.
- To generate a general service, run the command:
  ```bash
    nx generate @aligent/nx-serverless:service <service-name>
    # The command above is equivalent to 'nx g @aligent/nx-serverless:service <service-name> general'
  ```

### Notification:

- This generator creates a notification service designed to send messages to email or Slack channels when other services encounter errors. It helps in monitoring and alerting, ensuring quick responses to issues in the system.
- To generate a notification service, run the command:
  ```bash
    nx generate @aligent/nx-serverless:service <service-name> notification
  ```

## Executors

<!-- MI-198: To be implemented in near future -->

## Plugins

- This plugin identify our project by looking for `serverless.yml` file. For each project it can find, the following targets are added to the project:
  - `build`: build the project using `serverless package` command.
  - `deploy`: deploy the project using `serverless deploy` command.
  - `remove`: remove the project using `serverless remove` command.
  
<!-- MI-198: More to come in near future -->
