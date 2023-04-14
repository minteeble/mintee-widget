# SLS-Back-End

# Starting

In order to make the application work, several commands have to be executed:

```bash
yarn clean-all # run this only if you made a major edit
yarn
yarn build
yarn install --force
```

Since our application runs on [Lerna](https://lerna.js.org/) , we are able to run various commands across all the services and the packages from the root. Here’s a listing of the commands we can use:

```json
"scripts": {
    "test": "lerna exec \"yarn run test\" --concurrency=1 --no-bail --ignore @ai-aggregator/testing-lib --ignore @ai-aggregator/services-configurator",
    "build": "lerna run clean-build",
    "start-offline": "lerna run start-offline --parallel --stream",
    "clean": "lerna run clean",
    "deploy": "lerna run deploy --concurrency=1 --stream",
    "configure": "services-configurator",
    "clean-modules": "lerna clean -y && rm -rf node_modules",
    "clean-all": "yarn clean && yarn clean-modules"
  }
```

# Project Structure

## Introduction

Our project lays on a monorepo foundational basis. We also made a distinction between **packages** and **services**. The main difference between them is that packages are **not** deployed, they are also used for misc and common utilities on services. Services, instead, are deployed and are projects that represent the single microservice in the application.

## Shared Resources Service

This is a service in which common libraries, functions, classes etc. are stored. One of the most important feature about this service is `servicesAPI.json` file. It contains info and a map of APIs generated by Swagger, it will then be used with Postman in order to test the APIs.

## Test Service

This is a service which is used to test lambdas.

## Service Configurator Package

This is a script made by us for managing the functionalities across the services. As of now, it allows us to generate Swagger API points in all services. The syntax for the command will be like this:

```bash
yarn configure generateSwagger --outpath=path
```

More functionalities will be added in the future.
