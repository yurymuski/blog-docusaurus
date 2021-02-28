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
grep "sign-in" /var/log/nginx/domain.access.log |awk '{print $1}' |sort | uniq -c | sort -n | tail -n20
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

### Block attackers IPs

Identify attacker among regular user:
 - User Agent
 - Attack URI
 - GEO

#### Example:

requests on `sign-in`

```sh
# Take top 100 IPs by requests
grep "sign-in" /var/log/nginx/domain.access.log | grep "400 " |awk '{print $1}' |sort | uniq -c | sort -n | tail -n 100 > /tmp/list.txt

# Create nginx deny list
sed 's/$/;/g; s/^\s\+[0-9]\+\s/deny /g'  /tmp/list.txt > /etc/nginx/banned-ip-list-`date +%m%d%Y`.txt
```
Add to nginx config include of generated file and reload nginx

`include /etc/nginx/banned-ip-list-*.txt;`

---