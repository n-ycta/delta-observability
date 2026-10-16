# Delta Observability

Provide shared telemetry queries, observed connectivity history and the event journal as an independent service.

Independent headless Delta service. No browser, Web plugin, or graphical session is required. Web, Desktop and Android are optional clients; Android delegates desktop-only operations to a trusted paired desktop/VPS node.

## Install and use

Install **Delta Observability** from the official Delta plugin catalog on the node where this service should run. Compatible Web/native hosts show which optional service dependencies are installed, disabled or incompatible. Installing Web is not required to keep this service running.

For an owner-operated Core CLI installation:

```sh
delta call packages.install --json '{"id":"dev.delta.observability"}'
```

Install it on the intended observation/storage node and select that service node in the native host's connection settings. Dashboards, event views and history use the capability API below. Observed availability is not an assertion of complete uptime: intervals without observations are gaps, not downtime. The journal is not an OS-wide audit log of commands made outside Delta.

The supervisor owns service startup. Do not run a second manual copy against an active managed profile. Back up the profile before migration or incompatible upgrades; uninstalling a UI client is not a data backup.

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

## Development and verification

Run `npm ci` and `npm test` in this repository. Direct `npm start` is for a deliberately configured service environment; an ordinary UI client should not receive its service credential.


Automated tests use isolated fixtures. Physical desktop restart, phone lifecycle, and production VPS acceptance are not implied by a passing test suite.
