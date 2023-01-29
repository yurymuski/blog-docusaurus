---
slug: /nginx/cors/
id: nginx-cors
title: Nginx cors
---

## CORS setup

What is CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

Possible Issue: `Access to fetch at *** from origin *** has been blocked by CORS policy: No 'Access-Control-Allow-Origin'`

Setup CORS for 2 domains:

```nginx
    # allow CORS FIRST_DOMAIN and SECOND_DOMAIN
    set $cors '';
    set $cors_allowed_methods 'GET, POST, OPTIONS, DELETE, PUT';

    if ($http_origin ~ '.*FIRST_DOMAIN|SECOND_DOMAIN)') {
        set $cors 'origin_matched';
    }

    # Preflight requests
    if ($request_method = OPTIONS) {
        set $cors '${cors} & preflight';
    }

    if ($cors = 'origin_matched') {
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Methods $cors_allowed_methods;
        add_header Access-Control-Allow-Credentials 'true' always;
    }

    if ($cors = 'origin_matched & preflight') {
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Methods $cors_allowed_methods;
        add_header Access-Control-Allow-Credentials 'true' always;
        add_header Content-Type text/plain;
        add_header Content-Length 0;
        return 204;
    }

```