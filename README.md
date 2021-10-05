
# Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

<a href="https://docs.yurets.pro" target="_blank">Live demo</a>

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


## Build

```sh
# build static content served by nginx
docker build -t ymuski/blog-docusaurus .

# run
docker run -d --restart=always -m 200m -p 8888:80 --name blog-docusaurus ymuski/blog-docusaurus

# push to dockerhub
docker push ymuski/blog-docusaurus
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details