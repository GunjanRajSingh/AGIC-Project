// This file is overridden in Kubernetes via a ConfigMap volume mount.
// You can edit this for local testing (docker run) if needed.
window.__CONFIG__ = {
  API_URL: "http://localhost:8080"
};
