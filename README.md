
# Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

## Installation

```sh
# generate project skeleton
docker run -it --rm -p 3000:3000 --user node -w /opt/blog-docusaurus -v ${PWD}/:/opt/ --entrypoint /bin/sh node:lts-alpine
npx @docusaurus/init@latest init blog-docusaurus classic
```

## Local Development

```sh
cd blog-docusaurus/

# enter sh
docker run -it --rm -p 3000:3000 --user node -w /opt/blog-docusaurus -v ${PWD}/:/opt/blog-docusaurus/ --entrypoint /bin/sh node:lts-alpine

# start
docker run -it --rm -p 3000:3000 --user node -w /opt/blog-docusaurus -v ${PWD}/:/opt/blog-docusaurus/  node:lts-alpine npm start -- --host 0.0.0.0
```

This command starts a local development server. Go to `http://localhost:3000`. 

Most changes are reflected live without having to restart the server.

<!-- 
## Build

```console
npm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

```console
GIT_USER=<Your GitHub username> USE_SSH=true npm deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch. 
-->
