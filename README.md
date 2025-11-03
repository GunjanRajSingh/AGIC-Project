# Frontend Microservices (4x) + Helm + Kubernetes (Practice Project)

This is a **ready-to-practice** project that deploys 4 frontend microservices on Kubernetes using Helm.
Each frontend is a static site (vanilla HTML/JS) served via NGINX, with runtime config injected via `env.js`
from a Kubernetes ConfigMap.

## Services
- `auth-frontend`
- `user-frontend`
- `dashboard-frontend`
- `notification-frontend`

## What you'll learn
- Containerizing static frontends with NGINX
- Injecting runtime config via ConfigMap (`env.js`)
- Deploying multiple micro-frontends via a single Helm chart
- Ingress routing with path-based rules
- Environment-specific overrides via `values.yaml`

---

## 1) Build Docker Images

From each service directory:

```bash
# Example for auth-frontend
cd services/auth-frontend
docker build -t local/auth-frontend:v1 .

# Repeat for all four services
cd ../user-frontend       && docker build -t local/user-frontend:v1 .
cd ../dashboard-frontend  && docker build -t local/dashboard-frontend:v1 .
cd ../notification-frontend && docker build -t local/notification-frontend:v1 .
```

> If you are pushing to a registry (e.g., Docker Hub or ACR), change `local/...` in `helm/frontend/values.yaml`
> to your repo, e.g., `gunjanrepo/auth-frontend` and push the images.

---

## 2) Run on Kubernetes with Helm

Ensure you have:
- A running cluster (Minikube, kind, or AKS)
- `kubectl` configured
- `helm` installed
- An Ingress Controller (for Minikube: `minikube addons enable ingress`)

Deploy:

```bash
helm install frontend ./helm/frontend
```

Check:

```bash
kubectl get pods,svc,ingress
```

If using Minikube, add host entry (adjust based on `values.yaml`):
```
# /etc/hosts
127.0.0.1  myapp.local
```

Or for Minikube, use the minikube IP:
```
minikube ip
# Suppose it returns 192.168.49.2
# Add in /etc/hosts:
192.168.49.2  myapp.local
```

Now browse:
- http://myapp.local/auth
- http://myapp.local/user
- http://myapp.local/dashboard
- http://myapp.local/notify

---

## 3) Override API URLs per environment

Edit `helm/frontend/values.yaml`:

```yaml
frontends:
  - name: auth-frontend
    imageRepository: "local/auth-frontend"
    containerPort: 80
    path: /auth
    apiURL: "http://auth-api.default.svc.cluster.local:8080"
```

Each frontend gets an `env.js` at runtime:

```js
window.__CONFIG__ = {
  API_URL: "<your-api-url>"
};
```

Your `index.html` reads it via `<script src="env.js"></script>` and `app.js` will attempt `GET /health`.

---

## 4) Upgrade, Rollback, Uninstall

```bash
# Change values (like image tag), then:
helm upgrade frontend ./helm/frontend --set image.tag=v2

# Rollback a release
helm rollback frontend 1

# Uninstall
helm uninstall frontend
```

---

## 5) Troubleshooting

- 404 on routes? Ensure Ingress controller is installed and `ingress.enabled=true`.
- Can't reach API? Confirm the API Service DNS is correct and exposes `/health` (or ignore the health text).
- Pods CrashLoop? Run `kubectl logs <pod>` — NGINX logs may point to missing files or mount issues.

Happy shipping!
