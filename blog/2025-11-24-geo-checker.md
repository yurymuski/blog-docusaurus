---
slug: geo-checker/
title: Introducing Geo-Checker
author: Yury Muski
author_title: Lead DevOps Engineer / SRE
author_url: https://yurets.pro
author_image_url: https://yurets.pro/avatar.webp
tags: [geo-checker, docker, kubernetes, geoip, nginx]
---

# Geo-Checker: The Simple, High-Performance GeoIP Lookup Server for Docker & Kubernetes

![Geo-Checker Image](../static/img/geo-checker.png)

In the world of microservices and containerized applications, having a reliable and fast way to determine the geolocation of your users is crucial. Whether for content localization, analytics, or security compliance, GeoIP data is a fundamental building block. Enter **Geo-Checker**, a lightweight, high-performance GeoIP lookup server designed specifically for Docker and Kubernetes environments.

## Why Geo-Checker?

Geo-Checker stands out by combining simplicity with raw performance. Built on top of **OpenResty (Nginx)** and leveraging **MaxMind's GeoIP databases**, it offers a robust solution that fits perfectly into modern infrastructure stacks.

### Key Advantages

*   **High Performance**: By utilizing Nginx and OpenResty, Geo-Checker delivers extremely low latency responses, making it suitable for high-traffic applications.
*   **Automatic Updates**: One of the biggest pain points with GeoIP services is keeping the database fresh. Geo-Checker includes a built-in cron job that automatically updates the MaxMind databases, ensuring your data is always accurate without manual intervention.
*   **Docker & Kubernetes Ready**: With a pre-built Docker image and a Helm chart, deploying Geo-Checker to your cluster is a matter of minutes.
*   **Flexible Integration**: Whether you need to look up an IP via a simple API call or inspect headers from a reverse proxy, Geo-Checker handles it all.

## Getting Started

Deploying Geo-Checker is straightforward. First, you'll need to [register for a MaxMind account](https://www.maxmind.com/en/geolite2/signup) to obtain a license key. Once you have that, you can run it directly with Docker:

```shell
docker run -d \
  -e GEOIP_ACCOUNTID=$GEOIP_ACCOUNTID \
  -e GEOIP_LICENSEKEY=$GEOIP_LICENSEKEY \
  -e GEOIP_EDITIONID=$GEOIP_EDITIONID \
  --name geo-checker \
  -p 8080:80 \
  ymuski/geo-checker:latest
```

Or install it via Helm in your Kubernetes cluster:

```shell
helm repo add geo-checker https://yurymuski.github.io/geo-checker/helm/
helm repo update
helm install my-geo-checker geo-checker/geo-checker \
  --set maxmind.geoipAccountid="YourAccountID" \
  --set maxmind.geoipLicensekey="YourLicenseKey"
```

## API Reference

Geo-Checker provides a clean, JSON-based API for all your lookup needs.

### 1. Lookup by IP Address

Get geolocation data for a specific IP address.

**Endpoint:** `GET /ip/{ip_address}`

**Example:**
```shell
curl localhost:8080/ip/8.8.8.8
```

**Response:**
```json
{"IP":"8.8.8.8","iso2Code":"US","name":"United States"}
```

### 2. Detailed City Lookup

If you need more granular data, including city and subdivision information.

**Endpoint:** `GET /ip/city/{ip_address}`

**Example:**
```shell
curl localhost:8080/ip/city/2a03:2880:f189:80:face:b00c:0:25de
```

**Response:**
```json
{
  "ip": "2a03:2880:f189:80:face:b00c:0:25de",
  "country_iso_code": "GB",
  "country_name": "United Kingdom",
  "city_name": "London",
  "continent_name": "Europe",
  "subdivision_iso_code": "ENG",
  "subdivision_name": "England"
}
```

### 3. Lookup "My IP" (Header-Based)

Perfect for determining the location of the client making the request. Geo-Checker intelligently checks standard headers like `X-Real-Ip` and `CF-Connecting-IP`.

**Endpoint:** `GET /myip`

**Example:**
```shell
curl localhost:8080/myip -H "X-Real-Ip: 8.8.8.8"
```

## Conclusion

Geo-Checker removes the complexity of managing your own GeoIP infrastructure. It's fast, self-updating, and ready for production.

**Ready to give it a try?** Check out the [GitHub repository](https://github.com/yurymuski/geo-checker), pull the image from [Docker Hub](https://hub.docker.com/r/ymuski/geo-checker), or find it on [Artifact Hub](https://artifacthub.io/packages/helm/geo-checker/geo-checker).
