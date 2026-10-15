// Assets fetched via HTTP inside a federated remote resolve against the HOST's
// origin (the current document), not this remote's own origin — so relative
// paths like 'assets/mock/x.json' 404 once this remote runs inside the host.
// This remote's own dev/Docker port is fixed across environments in this
// project, so a constant is enough (no need for Angular's environment files).
export const ASSETS_BASE_URL = 'http://localhost:4201';
