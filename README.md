# What is this

This repository serves as a starting point whenever you need to create an application written in Typescript
and React. How?

```bash
git clone https://github.com/sutamatej/react-template.git
cd react-template
npm install
npm run dev
```

Go to http://localhost:8000/ to see the template application.

Create your components, build your application, conquer the world.

## Why
Using React without a framework is [no longer a practice recommended by the React team](https://react.dev/learn/start-a-new-react-project).
However, you might still want to keep things simple without being dependent on a third party framework.
If that is the case, then this repository might be a good place to start.

Secondly, I wanted to have a project built with React and Typescript with blazing fast build times and
I wanted to find out if all these tools could work together well to provide a productive developer experience.

## Goals
* always up-to-date
* minimize the number of dependencies
* configuration that is easy to understand, modify and experiment with, therefore easy to learn
* extremely fast builds thanks to [esbuild](https://esbuild.github.io/)
* [React](https://react.dev/) & [Typescript](https://www.typescriptlang.org/) support
* live reloading (NOT hot reloading)

## Missing features
* Unit testing of components with Jest or react-testing-library
* Production builds with minification/bundling/lazy loading/...
