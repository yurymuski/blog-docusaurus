---
slug: /k8s/
id: k8s
title: k8s useful
---

##  Full access k8s node POD using nsenter

`nsenter` - run program in different namespaces. It may be used to access POD ns from host and to access host from POD. We just need to set params and add security permissions to POD.

### Params:

- ` -t 1` - target NS is PID 1 
- ` -m` - Enter the mount (filesystem) namespace
- ` -u` - Enter the UTS (UNIX Timesharing System) namespace
- ` -i` - Enter the IPC (Interprocess Communication) namespace
- ` -n` - Enter the network namespace

### POD securityContext:

```yaml
  securityContext:
    privileged: true
```
Privileged containers share namespaces with the host system, eschew cgroup restrictions, and do not offer any security.

https://kubesec.io/basics/containers-securitycontext-privileged-true/
>    Processes within the container get almost the same privileges that are available to processes outside a container
    Privileged containers have significantly fewer kernel isolation features
    root inside a privileged container is close to root on the host as User Namespaces are not enforced
    Privileged containers shared /dev with the host, which allows mounting of the host’s filesystem
    They can also interact with the kernel to load kernel and alter settings (including the hostname), interfere with the network stack, and many other subtle permissions


### Pod Security Policies:
NOTE: PodSecurityPolicy was deprecated in Kubernetes v1.21, and removed from Kubernetes in v1.25.

```yaml
  hostIPC: true
  hostNetwork: true
  hostPID: true
```

### POD extra config:
```yaml
  restartPolicy: Never
  terminationGracePeriodSeconds: 0
  nodeSelector:
    kubernetes.io/hostname: sportsbook-prod-ws-pool-7p86b


  tolerations:
  - effect: NoExecute
    key: node.kubernetes.io/not-ready
    operator: Exists
    tolerationSeconds: 300
  - effect: NoExecute
    key: node.kubernetes.io/unreachable
    operator: Exists
    tolerationSeconds: 300
```

### SumUp:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: node-shell
  namespace: kube-system
spec:
  nodeSelector:
    kubernetes.io/hostname: NODE_NAME
  hostIPC: true
  hostNetwork: true
  hostPID: true
  restartPolicy: Never
  terminationGracePeriodSeconds: 0
  containers:
  - name: node-shell
    image: docker.io/alpine:3.13
    imagePullPolicy: IfNotPresent
    command:
    - nsenter
    args:
    - -t
    - "1"
    - -m
    - -u
    - -i
    - -n
    - sleep
    - "3600"
    resources: {}
    securityContext:
      privileged: true

```

```sh
# Set nodeSelector NODE_NAME you want to access
kubectl apply -f FILENAME.yaml
kubectl exec -n kube-system -it node-shell -- bash
kubectl delete po  -n kube-system node-shell
```
