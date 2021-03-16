---
slug: /howto/deployment-readiness/
id: deployment-readiness
title: deployment readiness checklist
---

List of actions for checkup before deployment

## Readme.md

- How to build

- How to start

- Dependencies (DB, external services)

---
## Variables

The environment has higher priority over configuration files (but lower than the command line arguments)

---
## Docker

### Dockerfile

App is Dockerized and `docker-compose.yml` is present if needed

### .dockerignore

```sh
.git
.gitlab-ci.yml
Dockerfile
```


### Docker image size 

As small as possible <200mb is OK

- Alpine based

- multi-stage if needed

- clean cache `npm cache clean --force`

- only prod dependencies  `npm ci --production` better than `npm install --only=prod` or `npm prune --production` to clean after

### avoid running as root

e.g. `USER node`

### Only 1 process

exec to process directly (not `npm run`), `docker-entrypoint.sh` if needed

---
## Health and metrics routes

`/health` should act as a readinessProbe - has check for critical dependencies (DB)

`/` act as a livenessProbe (application is alive and not stuck) - otherwise it will be restarted

`/health-SRV` - checking 3rd party services availability

`/metrics` Prometheus metrics endpoint - requests per endpoint, error rate, request duration

---
## Logs and Errors

**NO** logs to file

All Logs in human-readable format to `STDOUT+STDERR`

Errors to **Sentry**

**Gelf** support, JSON logs

---
## Graceful shutdown

`SIGTERM` call should handle current requests, close keep-alive connections, close DB connections

App should **exit** in case of **critical/fatal** errors

---
## DB connection pool

DB connections should use pool

Pool size is managed by `env` vars

---
## CI

Gitlab-CI:

- Tag is not latest `DOCKER_IMAGE_TAG="$CI_COMMIT_REF_SLUG-$COMMIT_DATE-$CI_PIPELINE_ID"`

- lint

- test

- publish to dockerhub

- notification to slack

Dockerhub repo is switched to `PRIVATE` (public by default)

 


