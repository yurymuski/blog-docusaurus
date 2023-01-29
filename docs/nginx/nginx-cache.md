---
slug: /nginx/cache/
id: nginx-cache
title: Nginx cache
---

Using nginx cache for `proxy_pass` + [ngx_http_proxy_module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html) is **the bad idea** by default.

## Why is it bad?
- The proxied applicatation is not aware of this extra cache layer, it may have endpoints that should not be cached, or/and have internal logic for caching
 - You are not aware how endusers use the proxied applicatation. The same location may be used different and valid ways. For example `api/getSomeData?userId=123` and `api/getSomeData` + userId as header
- Nginx Cache also cache response headers. You should be super careful with session cookies
- Nginx Cache may be longer than the proxied applicatation session max time. In that case the enduser may be unauthrized due to all requests may hit cache and do not refresh session on the backend app.
- Purging cache is not obvious and should be extra configured with `proxy_cache_purge`

## Possible/acceptable solution

We can solve the main issue by moving cache logic to the proxied applicatation. Besides common solutions like redis or memcached the backend app may manage nginx cache via `X-Accel-Expires` header.

In such setup [proxy_cache_valid](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_valid) is not used. The proxied app adds `X-Accel-Expires` header and sets caching time of a response in seconds. The zero value disables caching for a response.

### Example config:

```conf

# Nginx Cache http block
proxy_cache_path /tmp/nginx-cache/nginx-{{app}}-{{ env }}  levels=1:2  keys_zone={{app}}-{{env}}:50m  max_size=500m inactive=10m use_temp_path=off;

# Nginx Cache server/location block
proxy_cache_key $scheme$proxy_host$request_uri;
proxy_cache {{app}}-{{env}};
proxy_cache_revalidate on;
proxy_cache_min_uses 1;
proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
proxy_cache_background_update on;
proxy_cache_lock on;
proxy_cache_lock_age 1s;
proxy_cache_bypass $http_x_no_cache $http_x_cache_update;
proxy_no_cache $http_authorization $http_x_no_cache;
proxy_cache_methods GET HEAD;
add_header X-Cache-Status $upstream_cache_status;
```

### Tips:

- `add_header X-Cache-Status $upstream_cache_status`: will add Miss or HIT to the response header
- `proxy_cache_path`:

    |  SubKey | Description |  
    | -------- | --------- |
    |`keys_zone={{app}}-{{env}}:50m`  | RAM usage |
    |`max_size=500m`                  | Max Disk usage |
    |`inactive=10m`                   | Expiry & Remove time |
    |`use_temp_path=off`              | Temp files will be put directly in the cache directory |

### Useful info:
- [Nginx Doc](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Habr post (RU)](https://habr.com/ru/post/428127/)
- [Nginx Cache overview](https://www.sheshbabu.com/posts/nginx-caching-proxy/)
