##  Problems Faced & Solutions

### 1. Jenkins Unable to Install Node Dependencies
```
npm was missing on server.  
✔ Installed Node & npm manually.
```
### 2. Application CrashLoopBackOff
```
Pod kept restarting due to syntax errors.  
✔ Debugged using docker run locally → fixed issues.
```
### 3. Latest Tag Not Updating
```
Pods didn't pull new image due to IfNotPresent and latest tag.  
✔ Switched to immutable tagging using commit SHA.
```
### 4. Prometheus Not Scraping App
```
ServiceMonitor couldn't match target.  
✔ Added correct labels + annotations + release=prom.
```
### 5. Webhook Not Triggering Jenkins
```
App folder had .git inside it.  
✔ Deleted nested git folder.
```
### 6. Locked Out of EKS
```
IAM identity was not mapped to RBAC.  
✔ Added access using aws_eks_access_entry.
```
