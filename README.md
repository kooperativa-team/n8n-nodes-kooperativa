# @kooperativa-team/n8n-nodes-kooperativa

n8n community node for the [Kooperativa](https://kooperativa.io) API. Enrich and search professional profiles and companies, track hiring signals and job changes, and manage webhook monitors, directly inside an n8n workflow.

## Installation

Requires a Kooperativa API key. Get one from your [account dashboard](https://kooperativa.io/api-keys).

Follow the n8n [community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) using the package name `@kooperativa-team/n8n-nodes-kooperativa`.

## Credentials

Create a **Kooperativa API** credential in n8n with your API key. The node authenticates every request with `Authorization: Bearer <your key>` against `https://kooperativa.io/api/v1`.

## Resources and operations

**Person**
- Enrich — full profile lookup by URL, username, or ID
- Check Exists — cheap existence check before a full lookup
- Search — filtered search across the people data lake
- Bulk Enrich — enrich up to 100 profiles in one call
- Get Colleagues — current coworkers of a person
- Get Similar — lookalike profiles by seniority/industry/country
- Get Job Changes — recently started new roles

**Company**
- Enrich — full company profile lookup
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

## License

MIT
