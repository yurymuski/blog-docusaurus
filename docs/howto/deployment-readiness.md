---
slug: /howto/deployment-readiness/
id: deployment-readiness
title: deployment readiness checklist
---

List of actions for checkup before deployment

## Readme.md

- [ ]  About App (its purpose)

- [ ]  How to build

- [ ]  How to start

- [ ]  Dependencies (DB, external services)

---
## Variables

- [ ] App should be configured via ENV vars + .env or config file

- [ ] APP should  have configurable PORT env variable

- [ ] The environment has higher priority over configuration files (but lower than the command line arguments)

- [ ] For static FE apps vars should be configured in runtime via config.json file, avoid setting vars on CI step

---
## Docker

- [ ] App is Dockerized and `docker-compose.yml` is present for dependencies if any

- [ ] `.dockerignore`

```sh
.git
.gitlab-ci.yml
Dockerfile
```

- [ ] avoid running as root e.g. `USER node`

- [ ] Only 1 process. exec to process directly (not `npm run`)

- [ ] docker-entrypoint.sh if app has separate runtime logic on board (e.g web + some workers ) or has migrations

### Docker image size

As small as possible <200mb is OK

- [ ] Alpine based if possible

- [ ] multi-staged ( separate builder part )

- [ ] clean cache `npm cache clean --force`

- [ ] only prod dependencies  `npm ci --production` better than `npm install --only=prod` or `npm prune --production` to clean after



---
## APP runtime

- [ ] app should be horizontal scalable

- [ ] If app has separate logic (web + worker) it should be executed in separate processes, to be able to scale independently

- [ ] healthcheks should be separated also

---
## Health and metrics routes

- [ ] `/health` should act as a readinessProbe - has check for critical dependencies (DB)

- [ ]  `/`  or `/status` act as a livenessProbe (application is alive and not stuck) - otherwise it will be restarted - some static info about app/build

- [ ] `/health-SRV` - checking 3rd party services availability

- [ ] `/metrics` Prometheus metrics endpoint - requests per endpoint, error rate, request duration

---
## Logs and Errors

More logs = great

- [ ]  all requests should be logged with extra messages for responses

- [ ]  utilize log lvls: debug, info, warn, error

- [ ]  **NO** logs to file

- [ ]  All Logs in human-readable format to `STDOUT+STDERR`

- [ ]  Errors to **Sentry**

- [ ]  **Gelf** support, JSON logs

---
## Metrics

- [ ] requests & responses counter by method, endpoint and status code

- [ ] responses quantile summary metric

- [ ] requests duration histogram

- [ ] any other important measurements app specific, core logic

Clients: https://prometheus.io/docs/instrumenting/clientlibs/


e.g:

https://github.com/siimon/prom-client

https://github.com/766b/chi-prometheus


---
## Alerts

check for anomaly diff, preferred: app metric, possible: nginx/linkerd

- [ ] request rate

- [ ] error rate

- [ ] latency

- [ ] cpu/ram



---
## Tracing

- [ ] app should  handle X-Request-ID header, if not present generate random string or uuid

- [ ] add value  to request_id log field to all logs


- [ ] add Application Performance Monitoring (APM)

- [ ] cover all external calls with traces (other apps, DBs, queues, etc)



any vendor, elastic as example:

https://www.elastic.co/guide/en/apm/agent/index.html


---
## Graceful shutdown

- [ ] `SIGINT`*(ctrl+c)* and `SIGTERM` call should handle current requests, close keep-alive connections, close DB connections

- [ ] App should **exit** in case of **critical/fatal** errors

---
## DB

- [ ] DB connections should use pool

- [ ] Pool size is managed by `env` vars

- [ ] All DB resources ( tables, indexes, fc, policies, etc) should be created via DB migration job

---
## CI

Gitlab-CI:

- [ ]  Builds inside docker containers

- [ ]  Tag is not latest `DOCKER_IMAGE_TAG="$CI_COMMIT_REF_SLUG-$COMMIT_DATE-$CI_PIPELINE_ID"`

- [ ]  lint & test steps

- [ ]  publish to dockerhub

- [ ]  notification to slack

- [ ]  Dockerhub repo is switched to `PRIVATE` (public by default)

- [ ]  utilize gitlab envs:  environment.name and environment.url

- [ ]  Cleanup step with removing created images and intermediate build images
