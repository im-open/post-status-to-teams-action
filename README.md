# Post Build Status to Teams Action

This action will post the status of the build to Microsoft Teams.  

## Recompiling Action
If changes are made, you need to re-compile the action using `ncc`.

1. Install `ncc` globally
   - `npm install -g @zeit/ncc`
2. Change into the action directory
   - `cd ./.github/actions/post-build-status-to-teams`
3. Compile all the required dependencies so you do not have to commit your `node_modules` folder to source control.  `ncc` will place the file under the `dist` directory which is where `action.yml` references `index.js`.
   - `ncc build main.js`