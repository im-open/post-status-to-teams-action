# Post Status to Teams Action

This action will post a status update to Microsoft Teams.

## Index <!-- omit in toc -->

- [Post Status to Teams Action](#post-status-to-teams-action)
  - [Layout](#layout)
  - [Inputs](#inputs)
  - [Usage Examples](#usage-examples)
  - [Contributing](#contributing)
    - [Incrementing the Version](#incrementing-the-version)
    - [Source Code Changes](#source-code-changes)
    - [Recompiling Manually](#recompiling-manually)
    - [Updating the README.md](#updating-the-readmemd)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)

## Layout

**Default Layout**
![](images/Teams_Notification_Card.PNG)

**Layout when include-default-facts is set to false**
![](images/notification-without-default-facts.png)

## Inputs

| Parameter               | Is Required | Default | Description                                                                                                                                                                          |
|-------------------------|-------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`                 | true        | N/A     | The title of the card posted to Teams.                                                                                                                                               |
| `workflow-status`       | true        | N/A     | The status to report. The values `success` and `failure` will result in green and red color indicators (respectively) on the Teams Card. Anything else will result in gray.          |
| `workflow-type`         | true        | N/A     | The type of workflow. Default to `Build`. The most common types are `Build` and `Deploy`, but the value isn't restricted so anything can be used.                                    |
| `teams-uri`             | true        | N/A     | The Teams webhook URI where notifications are sent.                                                                                                                                  |
| `custom-facts`          | false       | ''      | JSON-parseable string defining a list of objects with name and value to display on the facts table.                                                                                  |
| `custom-actions`        | false       | ''      | JSON-parseable string defining a list of objects with name and uri to include in the list of action buttons at the bottom of the card.                                               |
| `timezone`              | false       | UTC     | A valid database time zone name, e.g. America/Denver. Defaults to `UTC`.                                                                                                             |
| `environment`           | false       | ''      | Name of the environment. Won't be included if none.                                                                                                                                  |
| `fail-on-error`         | false       | false   | When set to true will return an exit code 1 should the action fail to send the Teams notification. Default to `false`.                                                               |
| `include-default-facts` | false       | true    | A flag determining whether or not to include the default facts. True and false are the expected values. The default facts are event type, status, and the repository and branch url. |

## Usage Examples

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
        uses: im-open/post-status-to-teams-action@v1.4.0
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
        uses: im-open/post-status-to-teams-action@v1.4.0
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
        uses: im-open/post-status-to-teams-action@v1.4.0
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

When creating PRs, please review the following guidelines:

- [ ] The action code does not contain sensitive information.
- [ ] At least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version] for major and minor increments.
- [ ] The action has been recompiled.  See [Recompiling Manually] for details.
- [ ] The README.md has been updated with the latest version of the action.  See [Updating the README.md] for details.

### Incrementing the Version

This repo uses [git-version-lite] in its workflows to examine commit messages to determine whether to perform a major, minor or patch increment on merge if [source code] changes have been made.  The following table provides the fragment that should be included in a commit message to active different increment strategies.

| Increment Type | Commit Message Fragment                     |
|----------------|---------------------------------------------|
| major          | +semver:breaking                            |
| major          | +semver:major                               |
| minor          | +semver:feature                             |
| minor          | +semver:minor                               |
| patch          | *default increment type, no comment needed* |

### Source Code Changes

The files and directories that are considered source code are listed in the `files-with-code` and `dirs-with-code` arguments in both the [build-and-review-pr] and [increment-version-on-merge] workflows.  

If a PR contains source code changes, the README.md should be updated with the latest action version and the action should be recompiled.  The [build-and-review-pr] workflow will ensure these steps are performed when they are required.  The workflow will provide instructions for completing these steps if the PR Author does not initially complete them.

If a PR consists solely of non-source code changes like changes to the `README.md` or workflows under `./.github/workflows`, version updates and recompiles do not need to be performed.

### Recompiling Manually

This command utilizes [esbuild] to bundle the action and its dependencies into a single file located in the `dist` folder.  If changes are made to the action's [source code], the action must be recompiled by running the following command:

```sh
# Installs dependencies and bundles the code
npm run build
```

### Updating the README.md

If changes are made to the action's [source code], the [usage examples] section of this file should be updated with the next version of the action.  Each instance of this action should be updated.  This helps users know what the latest tag is without having to navigate to the Tags page of the repository.  See [Incrementing the Version] for details on how to determine what the next version will be or consult the first workflow run for the PR which will also calculate the next version.

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/main/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2024, Extend Health, LLC. Code released under the [MIT license](LICENSE).

<!-- Links -->
[Incrementing the Version]: #incrementing-the-version
[Recompiling Manually]: #recompiling-manually
[Updating the README.md]: #updating-the-readmemd
[source code]: #source-code-changes
[usage examples]: #usage-examples
[build-and-review-pr]: ./.github/workflows/build-and-review-pr.yml
[increment-version-on-merge]: ./.github/workflows/increment-version-on-merge.yml
[esbuild]: https://esbuild.github.io/getting-started/#bundling-for-node
[git-version-lite]: https://github.com/im-open/git-version-lite
