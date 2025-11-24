## Monitoring Dashboard Description
```
Monitoring is implemented using *kube-prometheus-stack*:
```
### Prometheus:
```
- Scrapes metrics from:
  - Kubernetes nodes
  - Pods
  - System metrics
  - Todo app /metrics endpoint
```
### Grafana:
```
Custom dashboard includes:
- Total number of requests
- Requests per route (GET / POST / DELETE)
- Status code breakdown (200,400,500)
- Pod CPU & memory usage
- Node resource usage
- Latency graphs

Prometheus discovers your app via:
- ServiceMonitor  
- Labels on the Kubernetes Service
```
