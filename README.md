# Post Status to Teams Action

This action will post a status update to Microsoft Teams.
    
## Index 

- [Post Status to Teams Action](#post-status-to-teams-action)
  - [Index](#index)
  - [Layout](#layout)
  - [Inputs](#inputs)
  - [Example](#example)
  - [Contributing](#contributing)
    - [Recompiling](#recompiling)
    - [Incrementing the Version](#incrementing-the-version)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)

## Layout

**Default Layout**
![](images/Teams_Notification_Card.PNG)

**Layout when include-default-facts is set to false**
![](images/notification-without-default-facts.png)

## Inputs
| Parameter               | Is Required | Default | Description                                                                                                                                                                          |
| ----------------------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`                 | true        | N/A     | The title of the card posted to Teams.                                                                                                                                               |
| `workflow-status`       | true        | N/A     | The status to report. The values `success` and `failure` will result in green and red color indicators (respectively) on the Teams Card. Anything else will result in gray.          |
| `workflow-type`         | true        | N/A     | The type of workflow. Default to `Build`. The most common types are `Build` and `Deploy`, but the value isn't restricted so anything can be used.                                    |
| `teams-uri`             | true        | N/A     | The Teams webhook URI where notifications are sent.                                                                                                                                  |
| `custom-facts`          | false       | ''      | JSON-parseable string defining a list of objects with name and value to display on the facts table.                                                                                  |
| `custom-actions`        | false       | ''      | JSON-parseable string defining a list of objects with name and uri to include in the list of action buttons at the bottom of the card.                                               |
| `timezone`              | false       | UTC     | A valid database timezone name, e.g. America/Denver. Defaults to `UTC`.                                                                                                              |
| `environment`           | false       | ''      | Name of the environment. Won't be included if none.                                                                                                                                  |
| `fail-on-error`         | false       | false   | When set to true will return an exit code 1 should the action fail to send the Teams notification. Default to `false`.                                                               |
| `include-default-facts` | false       | true    | A flag determining whether or not to include the default facts. True and false are the expected values. The default facts are event type, status, and the repository and branch url. |


## Example

The most basic example using only the parameters that are required.
```yml
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Send Successful Build Notification
      # You may also reference just the major or major.minor version
        uses: im-open/post-status-to-teams-action@v1.3.2
        with:
          title: Successful build
          workflow-status: success
          workflow-type: Build
          teams-uri: ${{ secrets.MS_TEAMS_URI }}
          timezone: America/Denver
```

An example of not including the default facts in order to streamline the notification card to the bare minimum information.
```yml
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Send Successful Build Notification
        uses: im-open/post-status-to-teams-action@v1.3.2
        with:
          title: Successful build
          workflow-status: success
          workflow-type: Build
          teams-uri: ${{ secrets.MS_TEAMS_URI }}
          timezone: America/Denver
          include-default-facts: false
```

This example passes in `custom-facts` and `custom-actions`.
```yml
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Send Successful Deploy Notification
        uses: im-open/post-status-to-teams-action@v1.3.2
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

1. For major or minor changes, at least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version](#incrementing-the-version).
1. The action code does not contain sensitive information.

When a pull request is created and there are changes to code-specific files and folders, the build workflow will run and it will recompile the action and push a commit to the branch if the PR author has not done so. The usage examples in the README.md will also be updated with the next version if they have not been updated manually. The following files and folders contain action code and will trigger the automatic updates:

- action.yml
- package.json
- package-lock.json
- src/\*\*
- dist/\*\*

There may be some instances where the bot does not have permission to push changes back to the branch though so these steps should be done manually for those branches. See [Recompiling Manually](#recompiling-manually) and [Incrementing the Version](#incrementing-the-version) for more details.

### Recompiling Manually

If changes are made to the action's code in this repository, or its dependencies, the action can be re-compiled by running the following command:

```sh
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and
its dependencies into a single file located in the `dist` folder.

### Incrementing the Version

Both the build and PR merge workflows will use the strategies below to determine what the next version will be.  If the build workflow was not able to automatically update the README.md action examples with the next version, the README.md should be updated manually as part of the PR using that calculated version.

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

[git-version-lite]: https://github.com/im-open/git-version-lite
