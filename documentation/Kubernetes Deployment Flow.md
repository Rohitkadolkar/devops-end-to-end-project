## Kubernetes Deployment Flow
```
1. *Helm Chart → values.yaml*  
   Defines:
   - image repo & tag
   - replicas
   - env variables
   - resource limits
   - HPA settings

2. *Deployment*  
   Creates pods with readiness & liveness probes.

3. *Service (LoadBalancer)*  
   Exposes the app publicly via AWS ALB.

4. *ConfigMap & Secret*  
   APP_ENV, APP_NAME, SECRET_KEY injected into pods.

5. *Horizontal Pod Autoscaler (HPA)*  
   Automatically scales based on CPU.

6. *ServiceMonitor (Monitoring)*  
   Prometheus fetches metrics from /metrics.

7. *Rolling Updates*  
   With each Jenkins deployment, only changed pods restart.
```
