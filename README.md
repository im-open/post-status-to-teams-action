# Post Status to Teams Action

This action will post a status update to Microsoft Teams.

  - [Layout](#layout)
  - [Inputs](#inputs)
  - [Example](#example)
  - [Contributing](#contributing)
    - [Recompiling](#recompiling)
    - [Incrementing the Version](#incrementing-the-version)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)

## Layout

![](images/Teams_Notification_Card.PNG)

## Inputs
| Parameter         | Is Required | Description                                                                                                                                                                 |
| ----------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`           | true        | The title of the card posted to Teams.                                                                                                                                      |
| `workflow-status` | true        | The status to report. The values `success` and `failure` will result in green and red color indicators (respectively) on the Teams Card. Anything else will result in gray. |
| `workflow-type`   | true        | The type of workflow. Default to `Build`. The most common types are `Build` and `Deploy`, but the value isn't restricted so anything can be used.                           |
| `teams-uri`       | true        | The Teams webhook URI where notifications are sent.                                                                                                                         |
| `custom-facts`    | false       | JSON-parseable string defining a list of objects with name and value to display on the facts table.                                                                         |
| `custom-actions`  | false       | JSON-parseable string defining a list of objects with name and uri to include in the list of action buttons at the bottom of the card.                                      |
| `timezone`        | false       | A valid database timezone name, e.g. America/Denver. Defaults to `UTC`.                                                                                                     |
| `environment`     | false       | Name of the environment. Won't be included if none.                                                                                                                         |
| `fail-on-error`   | false       | When set to true will return an exit code 1 should the action fail to send the Teams notification. Default to `false`.                                                      |


## Example

The most basic example using only the parameters that are required.
```yml
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Send Successful Build Notification
        uses: im-open/post-status-to-teams-action@v1.0.1
        with:
          title: Successful build
          workflow-status: success
          workflow-type: Build
          teams-uri: ${{ secrets.MS_TEAMS_URI }}
          timezone: America/Denver
```

This example passes in `custom-facts` and `custom-actions`.
```yml
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Send Successful Deploy Notification
        uses: im-open/post-status-to-teams-action@v1.0.1
        with:
          title: Successfully deployed
          workflow-status: success
          workflow-type: Deploy
          teams-uri: ${{ secrets.MS_TEAMS_URI }}
          timezone: America/Denver
          custom-facts: |
            [
              { "name": "Custom Fact", "value": "Number 1" },
              { "name": "Custom Fact", "value": "Number 2" }
            ]
          custom-actions: |
            [
              { "name": "Go to Google", "uri": "https://www.google.com/" }
            ]
```

## Contributing
When creating new PRs please ensure:
1. The action has been recompiled.  See the [Recompiling](#recompiling) section below for more details.
2. For major or minor changes, at least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version](#incrementing-the-version).
3. The `README.md` example has been updated with the new version.  See [Incrementing the Version](#incrementing-the-version).
4. The action code does not contain sensitive information.

### Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```sh
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and
its dependencies into a single file located in the `dist` folder.

### Incrementing the Version

This action uses [git-version-lite] to examine commit messages to determine whether to perform a major, minor or patch increment on merge.  The following table provides the fragment that should be included in a commit message to active different increment strategies.
| Increment Type | Commit Message Fragment                     |
| -------------- | ------------------------------------------- |
| major          | +semver:breaking                            |
| major          | +semver:major                               |
| minor          | +semver:feature                             |
| minor          | +semver:minor                               |
| patch          | *default increment type, no comment needed* |

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2021, Extend Health, LLC. Code released under the [MIT license](LICENSE).