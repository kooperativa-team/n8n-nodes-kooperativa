# @kooperativa_team/n8n-nodes-kooperativa

n8n community node for the [Kooperativa](https://kooperativa.io) API. Enrich and search professional profiles and companies, track hiring signals and job changes, and manage webhook monitors, directly inside an n8n workflow.

## Installation

Requires a Kooperativa API key. Get one from your [account dashboard](https://kooperativa.io/api-keys).

Follow the n8n [community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) using the package name `@kooperativa_team/n8n-nodes-kooperativa`.

## Credentials

Create a **Kooperativa API** credential in n8n with your API key. The node authenticates every request with `Authorization: Bearer <your key>` against `https://kooperativa.io/api/v1`.

## Resources and operations

**Person**
- Enrich — full profile lookup by URL, username, or ID
- Enrich (Realtime) — same, but from the live source, **metered**, see Billing below
- Check Exists — cheap existence check before a full lookup
- Search — filtered search across the people data lake
- Bulk Enrich — enrich up to 100 profiles in one call
- Get Colleagues — current coworkers of a person
- Get Similar — lookalike profiles by seniority/industry/country
- Get Job Changes — recently started new roles

**Company**
- Enrich — full company profile lookup
- Enrich (Realtime) — same, but from the live source, **metered**, see Billing below
- Check Exists — cheap existence check before a full lookup
- Search — filtered search across the company data lake
- Get Current Employees — people currently at a company
- Get Past Employees — people who used to work at a company
- Get Headcount by Seniority — indexed headcount breakdown
- Get Hiring Signals — recently joined employees

**Monitor**
- List — active webhook monitors
- Create — subscribe to change events on a profile/company
- Delete — remove a webhook monitor

**Account**
- Get Info — license status and usage breakdown
- Health Check — API liveness probe

Full parameter reference: [docs.kooperativa.io](https://docs.kooperativa.io).

## Billing

Every operation above is included in the workspace license, with no per-request charge, except the two **Enrich (Realtime)** ones. Those read from the live source rather than from the Kooperativa data lake, and are metered at **$0.001 per call** on top of the license, which is still required.

Worth knowing before you put one in a loop over items:

- **A miss still costs.** A call is billed whenever the live source actually answered, so a not-found result costs the same as a hit, because the lookup happened either way. Only a `503`, meaning the source could not be reached at all, is not billed.
- **A billed call can still fail the node.** A not-found returns `404`, which fails the item unless you enable *Continue On Fail*, and it has been charged regardless.
- **There is no cache.** A workflow that runs Enrich (Realtime) over 1,000 items costs $1 each time it runs, not once. The result is written back to the data lake, so a plain Enrich afterwards is free and returns what the realtime call fetched.

Reach for **Enrich** first: it is included, and roughly 4x faster. Use the realtime variant when the record is missing from the lake, or when its `fetched_at` is not recent enough for what you are building.

## License

MIT
