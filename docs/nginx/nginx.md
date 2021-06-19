---
slug: /nginx/
id: nginx
title: Nginx useful
---

## DDOS protection

Nginx frees 1 slot per time set in rate: 1r/s = 1 slot free per second, 10r/s = 10 slots per second;

Burst - requests excess of the rate;

Nodelay - drop extra requests;

10m - 10 megabytes of RAM for IP list


### Limit requests for specific location
```nginx
# set 4 request per minute limit
limit_req_zone $binary_remote_addr  zone=limit_req_by_remote_ip_sign_in:10m             rate=4r/m;
limit_req_status 429;

location /sign-in {
  # apply limit to location
  limit_req zone=limit_req_by_remote_ip_sign_in    burst=4    nodelay;
  proxy_pass http://backend;
}

```

### Limit requests and connections with whitelist

When the first parameter to the limit_req_zone directory (the key) is an empty string, the limit is not applied, so allowlisted IP addresses ( 192.168.0.0/24 subnet) are not limited.

```nginx

# Whitelisted IP (e.g internal networks)
# 0 to $limit for IP addresses in the allowlist and 1 for all others.
geo $limit {
    default 1;
    192.168.0.0/24 0;
    # any your IP 0;
}


# If $limit is 0, $limit_key is set to the empty string
# If $limit is 1, $limit_key is set to the client’s IP address in binary format

map $limit $limit_key {
        0 "";
        1 $binary_remote_addr;
}

#Limit requests:
limit_req_zone $limit_key zone=limit_req_by_remote_ip:10m rate=1r/s;
limit_req_status 429;

#Limit connections:
limit_conn_zone $limit_key zone=limit_conn_by_remote_ip:10m;
limit_conn_status 429;

# Apply limits:
# 1 RPS with 1st 100 request ignored
limit_req zone=limit_req_by_remote_ip       burst=100  nodelay;
# 15 TCP connetions from 1 IP
limit_conn limit_conn_by_remote_ip 15;


```

Analyze limit amount needed:
```sh
# Count requests per IP for 1 (sign-in) location
DOMAIN="your.domain"
grep "sign-in" /var/log/nginx/$DOMAIN.access.log |awk '{print $1}' |sort | uniq -c | sort -n | tail -n20
# Get current connections to 443, COUNT - IP
netstat -natupl | grep ":443 " |awk '{print $5}' | cut -f1 -d":" | sort |uniq -c  | sort -n | tail -n20
```

usefull links:
```
https://bobcares.com/blog/nginx-ddos-prevention/
https://nginx.org/en/docs/http/ngx_http_limit_req_module.html
http://nginx.org/ru/docs/http/ngx_http_limit_conn_module.html
https://www.nginx.com/blog/rate-limiting-nginx/
```

### Block attacker

Identify attacker among regular user:
 - User Agent
 - Attack URI
 - GEO

---
#### Block IP:

requests on `sign-in`

```sh
# Take top 100 IPs by requests
DOMAIN="your.domain"
grep "sign-in" /var/log/nginx/$DOMAIN.access.log | grep "400 " |awk '{print $1}' |sort | uniq -c | sort -n | tail -n 100 > /tmp/list.txt

# Create nginx deny list (format: 'deny IP;')
sed 's/$/;/g; s/^\s\+[0-9]\+\s/deny /g'  /tmp/list.txt > /etc/nginx/banned-ip-list-`date +%d.%m.%Y`.txt
```
Add to nginx config include of generated file and reload nginx

`include /etc/nginx/banned-ip-list-*.txt;`

---
#### Block XFF:

requests on `sign-in`

```sh
# Take top 100 IPs by requests
DOMAIN="your.domain"
grep "sign-in" /var/log/nginx/$DOMAIN.access.log | grep "400 " |awk '{print $1}' |sort | uniq -c | sort -n | tail -n 100 > /tmp/list.txt

# Create nginx deny list for XFF (format: 'IP 1;')
sed 's/$/ 1;/g; s/^\s\+[0-9]\+\s/  /g'  /tmp/list.txt > /etc/nginx/banned-XFF-MAP-`date +%d.%m.%Y`.txt
```
Add to nginx config include of generated file and reload nginx

```nginx
map $http_x_forwarded_for $banned_xff {
 default 0;
 include /etc/nginx/banned-XFF-MAP-*.txt;
}

server {
...
  if ($banned_xff) {
    return 403;
  }
}
```

---
#### Block User Agent:

requests on `sign-in`

```sh
# Take top 50 User Agents by requests
DOMAIN="your.domain"
grep "sign-in" /var/log/nginx/$DOMAIN.access.log | grep "400 " |awk -F '"' '{print $6}' | sort | uniq -c | sort -n | tail -n 50
```

```nginx
# Block array of User Agents
map $http_user_agent $bot_agents {
  default 0;
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1' 1;
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1' 1;
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1' 1;
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1' 1;
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1' 1;
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1' 1;
}

if ($bot_agents) {
  return 403;
}

# Block 1 User Agent
  if ($http_user_agent = "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko"){
      return 403;
  }
```

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