# Delta Observability

Independent headless Delta service. No browser, Web plugin, or graphical session is required.

## Runtime

Requires Node.js 22+ and Delta Core >=0.4.3 <0.5.0. Run `npm ci --omit=dev`, then `npm start` with `DELTA_HOME`, `DELTA_URL`, and a service `DELTA_TOKEN`. Executable services are trusted host code, not an OS sandbox.

## API

- `observability.query`
- `observability.history`
- `observability.uptime`
- `observability.events`
- `observability.status`
- `observability.audit`

Core authenticates API calls. Forwarded calls retain the original principal through a live, component-bound invocation; the caller is never trusted from JSON arguments. A caller must be authorized for both the compatibility endpoint and the destination capability. Existing owner access is unchanged; narrowly scoped keys may need the new service scopes.

## Data and migration

The journal retains `DELTA_HOME/data/events`. Existing telemetry source IDs are deliberately preserved so historical metrics remain readable. Storage provider selection uses `STORAGE_COMPONENT`; the event journal works independently of Storage.

## Verification

Automated tests use isolated fixtures. Physical desktop restart, phone lifecycle, and production VPS acceptance are not implied by a passing test suite.
