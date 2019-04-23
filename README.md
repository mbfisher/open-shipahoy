# open shipahoy

This is an open source version of shipahoy

## Install

Install yarn
```sh
npm install --global yarn
```
Install application dependencies
```sh
yarn install
```
In `env/` create a `.env` file, use `template.env` as a model.

## Run

### Development

Make sure that `NODE_ENV=development`.
```sh
yarn start
```
Application should be available at `http://localhost:3000`

### Production

Make sure that `NODE_ENV=production`.
```sh
yarn build
yarn prod
```
Application should be available at `http://localhost:3000`
