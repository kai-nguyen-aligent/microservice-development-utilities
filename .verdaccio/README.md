Add the targets to `package.json`

```json
"nx": {
    "name": "microservice-development-utilities",
    "targets": {
      "start-local-registry": {
        "executor": "nx:run-commands",
        "options": {
          "commands": [
            "verdaccio --listen 4873 --config .verdaccio/config.yml",
            "npm set registry http://localhost:4873/ --location project"
          ]
        }
      },
      "stop-local-registry": {
        "executor": "nx:run-commands",
        "options": {
          "commands": [
            "npm set registry https://registry.npmjs.org/ --location project",
            "kill $(lsof -t -i:4873)"
          ]
        }
      }
    }
    "includedScripts": []
  }

```
