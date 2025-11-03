(function(){
  // env.js defines window.__CONFIG__ at runtime (mounted from ConfigMap in k8s)
  const api = (window.__CONFIG__ && window.__CONFIG__.API_URL) || "http://localhost:8080";
  document.getElementById("apiUrl").textContent = api;

  // Try a simple health check (will work if API exposes /health)
  const el = document.getElementById("health");
  fetch(api.replace(/\/$/, '') + "/health", { method: "GET" })
    .then(r => {
      el.textContent = r.ok ? ("OK (" + r.status + ")") : ("Error (" + r.status + ")");
    })
    .catch(err => { el.textContent = "Not reachable"; });
})();
