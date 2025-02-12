This is the client-side code for the [Borogove](https://borogove.app) IDE.


## Tech stack

The main technologies used:

* [TypeScript](https://www.typescriptlang.org) programming language
* [React](https://reactjs.org) user interface library
* [MobX](https://mobx.js.org) state management
* [SASS](https://sass-lang.com) for writing CSS
* [Node](https://nodejs.org) (version 14 or higher) for build tools

Adding new features requires knowing or learning more or less all of the above, but for making modifications you might get by with general programming skills, depending on the task.

Additionally [Storybook](https://storybook.js.org) is used for building and testing UI components.


## Setup

To set up the project locally you need [Node.js](https://nodejs.org) and either npm or [Yarn](https://yarnpkg.com) installed. Npm should be included in the Node.js installation.

* Clone the repository locally (`git clone` (recommended) or download and unpack the source code)
* `npm install` (or `yarn install`) in the project directory
* Create a file called `.env` to the project root and use `.env.example` as a template for its contents
* For Firebase integration (publishing games and the Snippets variant) add Firebase configuration to the src/services/firebase/firebase.config.ts file using the firebase.config.ts.example as a template. If you don't use Firebase, instead copy the contents of firebase.config.ts.empty to firebase.config.ts.

The .env file contains values that vary between development and production environments. If you create a file called `.env.production` its values are used in the production build.

After the initial setup, use `npm start` (or `yarn start`) to start the development server. It runs the app in the browser at localhost:3000. The snippets feature can be started with `npm start:snippets`.


## Storybook

[Storybook](https://storybook.js.org) shows a list of UI components in the app. The Storybook service can be run with `npm run storybook` (or `yarn storybook`.) It opens in the browser the same way as the actual app at localhost:6006.

Storybook definitions for UI components are located in files with the same name as the component in the same directory, but with a `.stories.tsx` extension (`MyComponent.stories.tsx` for `MyComponent.tsx` component.)


## Building and publishing

The `npm run build` (or `yarn build` or `npm run build:snippets` to build the snippets feature) command creates a complete web site in the `build` directory. This directory can then be copied as is to web hosting of your choice.

The build process is quite slow, so don't panic if it doesn't seem to do anything for a few minutes.


### Deploying to Firebase hosting

The `npm run deploy:prod` and `npm run deploy:dev` commands (or `yarn deploy:prod` / `yarn deploy:dev`) build and deploy the project to [Firebase](https://firebase.google.com) hosting. If you'd like to deploy to your own Firebase project, edit the .firebaserc file and replace the project ids with your own project ids created in the Firebase console. The ids in the default .firebaserc file refer to the "official" borogove.app hosting, which naturally won't work without proper credentials.

The .firebaserc file contains two separate projects, one for development or testing releases, and the other for production releases. If you only have one Firebase project you can use the production variant (`npm run deploy:prod`) and ignore the development variant.

