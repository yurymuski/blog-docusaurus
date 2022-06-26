---
slug: /prometheus/
id: prometheus
title: prometheus useful
---

# Metric types

Usefull links:
 - https://prometheus.io/docs/tutorials/understanding_metric_types/
 - https://prometheus.io/docs/prometheus/latest/querying/functions/

## Counter

- Always increases or resets to 0
- Common fuctions: rate(), increase(), irate(), resets()
- Metrics mostly named as '*_count' or '*_total'
- Examples: number of requests, responses, errors

**rate()** - the per-second **average rate** of increase of the time series in the range vector.
`rate(some_metric[5m])` - average of all data points divided by 300 (seconds in 5m)

**irate()** - based on the **last two** data points.
irate should only be used when graphing volatile, fast-moving counters => **over 1m no sense**

**increase()** - the increase in the time series in the range vector.
`increase(http_requests_total[5m])` - the number of HTTP requests as measured over the last 5 minutes

**resets()** - the number of counter resets within the provided time range as an instant vector

## Gauge

- Can either go up or down
- Common fuctions: delta(), deriv()
- Examples: number of pods in a cluster, number of events in an queue

**delta()** - the difference between the first and last value of each time series element in a range vector

**deriv()** - the per-second derivative of the time series in a range vector. Similar for rate(), but for gauges

## Histogram

- Data based on buckets
- Common fuctions: histogram_quantile()
- Example: Latency

**histogram_quantile()** - counts quantile from Histogram metrics, can be combined with rate()


```sh
# count 0.9 quantile
histogram_quantile(0.9, sum(rate(request_duration_milliseconds_bucket[1m])) by (le,path))

# count bucket % over all
1 -
(
  sum(rate(request_duration_milliseconds_bucket{le="$slow_response_ms"}[1m])) by (path)
/
  sum(rate(request_duration_milliseconds_count[1m])) by (path)
)
> 0
```