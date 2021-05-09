---
slug: /php/
id: php
title: php useful
---

### Tuning php-fpm

```sh
# Get current ram usage per process
ps --no-headers -o "rss,cmd" -C php-fpm7.3 | awk '{ sum+=$1 } END { printf ("%d%s\n", sum/NR/1024,"Mb") }'

# Get current config
php-fpm7.3 -tt

# Get demon status and config location
service php7.3-fpm status

```

Update config:

```ini
[www]

; logs in json
access.format = "{\"script_filename\":\"%f\", \"method\":\"%m\", \"URI\":\"%{REQUEST_SCHEME}e://%{HTTP_HOST}e%{REQUEST_URI}e\", \"status\":\"%s\", \"remote_ip\":\"%{REMOTE_ADDR}e\", \"useragent\":\"%{HTTP_USER_AGENT}e\", \"duration_ms\":\"%{mili}d\", \"content_length\":\"%l\", \"pid\":\"%p\", \"mem_mb\":\"%{mega}M\", \"cpu_percent\":\"%C\"}"


; possible to use calc https://spot13.com/pmcalculator/
pm = dynamic

; Issue in logs: 
; WARNING: [pool www] server reached pm.max_children setting (), consider raising it
; WARNING: [pool www] seems busy (you may need to increase pm.start_servers, or pm.min/max_spare_servers)
pm.max_children = 100
pm.start_servers = 30 ; [30% of max_children]
pm.min_spare_servers = 30 ; [30% of max_children]
pm.max_spare_servers = 70 ; [70% of max_children]

; The timeout for serving a single request after which the worker process will be killed.
request_terminate_timeout = 30s

; The number of requests each child process should execute before respawning. This can be useful to work around memory leaks in 3rd party libraries.
pm.max_requests = 1000

; limited by listen.backlog, default 511
listen.backlog = 511

; open file descriptor rlimit 
rlimit_files = 1310720
rlimit_core = unlimited

```

### PHP CLI Issues

```sh

# Get current php cli config
php -ii | grep memory

# check config location
php -ii | grep '.ini'

# unlimited for php console commands
sed 's/memory_limit=128M/memory_limit = -1/g' -i /etc/php/7.3/cli/php.ini
```