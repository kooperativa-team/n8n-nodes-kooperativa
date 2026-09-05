import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPerson = {
	resource: ['person'],
};

export const personOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: showOnlyForPerson,
	},
	options: [
		{
			name: 'Enrich',
			value: 'enrich',
			action: 'Enrich a person',
			description: "Return a person's full professional profile by URL, username, or ID",
			routing: {
				request: {
					method: 'GET',
					url: '/person',
				},
			},
		},
		{
			name: 'Check Exists',
			value: 'check',
			action: 'Check if a person exists',
			description: 'Cheaply check whether Kooperativa holds this profile, without fetching the full record',
			routing: {
				request: {
					method: 'GET',
					url: '/person/check',
				},
			},
		},
		{
			name: 'Search',
			value: 'search',
			action: 'Search people',
			description: 'Search the data lake of profiles using any combination of filters',
			routing: {
				request: {
					method: 'POST',
					url: '/people/search',
				},
			},
		},
		{
			name: 'Bulk Enrich',
			value: 'bulkEnrich',
			action: 'Bulk enrich people',
			description: 'Enrich up to 100 profiles in a single request',
			routing: {
				request: {
					method: 'POST',
					url: '/people/bulk-enrich',
				},
			},
		},
		{
			name: 'Get Colleagues',
			value: 'colleagues',
			action: "Get a person's colleagues",
			description: 'Return the current colleagues of a person, everyone at the same company right now',
			routing: {
				request: {
					method: 'GET',
					url: '/person/colleagues',
				},
			},
		},
		{
			name: 'Get Similar',
			value: 'similar',
			action: 'Get similar people',
			description: 'Find people with a similar seniority, industry, and country to a given person',
			routing: {
				request: {
					method: 'GET',
					url: '/person/similar',
				},
			},
		},
		{
			name: 'Get Job Changes',
			value: 'jobChanges',
			action: 'Get recent job changes',
			description: 'People who recently started a new job, optionally filtered by previous employer',
			routing: {
				request: {
					method: 'GET',
					url: '/person/job-changes',
				},
			},
		},
	],
	default: 'enrich',
};

// ── Enrich / Check: one of linkedin_url, username, or id (all resolve the same profile) ─

const enrichOrCheckOps = {
	resource: ['person'],
	operation: ['enrich', 'check'],
};

export const personEnrichFields: INodeProperties[] = [
	{
		displayName: 'Profile URL',
		name: 'linkedinUrl',
		type: 'string',
		default: '',
		placeholder: 'https://www.example.com/in/username',
		description: 'Full profile URL. Provide exactly one of Profile URL, Username, or ID.',
		displayOptions: { show: enrichOrCheckOps },
		routing: {
			send: { type: 'query', property: 'linkedin_url' },
		},
	},
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		default: '',
		placeholder: 'satyanadella',
		description: 'Profile slug, the part after /in/. Fastest lookup.',
		displayOptions: { show: enrichOrCheckOps },
		routing: {
			send: { type: 'query', property: 'username' },
		},
	},
	{
		displayName: 'Kooperativa ID',
		name: 'id',
		type: 'string',
		default: '',
		description: 'Kooperativa internal profile ID, from a previous search or enrich call',
		displayOptions: { show: enrichOrCheckOps },
		routing: {
			send: { type: 'query', property: 'id' },
		},
	},
];

// ── Search ─────────────────────────────────────────────────────────────

const searchOps = {
	resource: ['person'],
	operation: ['search'],
};

export const personSearchFields: INodeProperties[] = [
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		placeholder: 'VP of Sales',
		description: 'Job title keywords. Multiple space-separated words match with OR.',
		displayOptions: { show: searchOps },
		routing: { send: { type: 'body', property: 'title' } },
	},
	{
		displayName: 'Location (Country Code)',
		name: 'location',
		type: 'string',
		default: '',
		placeholder: 'US',
		description: 'ISO 2-letter country code, e.g. US. Comma-separate multiple codes, e.g. US,CA,GB.',
		displayOptions: { show: searchOps },
		routing: {
			send: {
				type: 'body',
				property: 'location',
				value: '={{$value.includes(",") ? $value.split(",").map(v => v.trim()) : $value}}',
			},
		},
	},
	{
		displayName: 'Company Name',
		name: 'company',
		type: 'string',
		default: '',
		description: 'Current company name, exact match. Prefer Company ID when known.',
		displayOptions: { show: searchOps },
		routing: { send: { type: 'body', property: 'company' } },
	},
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		default: '',
		description: 'Company ID, exact match, preferred over Company Name',
		displayOptions: { show: searchOps },
		routing: { send: { type: 'body', property: 'company_id' } },
	},
	{
		displayName: 'Industry',
		name: 'industry',
		type: 'string',
		default: '',
		placeholder: 'Computer Software',
		description: 'Exact industry name as stored on the profile',
		displayOptions: { show: searchOps },
		routing: { send: { type: 'body', property: 'industry' } },
	},
	{
		displayName: 'Seniority',
		name: 'seniority',
		type: 'options',
		options: [
			{ name: 'C-Level', value: 'c-level' },
			{ name: 'VP', value: 'vp' },
			{ name: 'Director', value: 'director' },
			{ name: 'Manager', value: 'manager' },
		],
		default: 'manager',
		displayOptions: { show: searchOps },
		routing: { send: { type: 'body', property: 'seniority' } },
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		displayOptions: { show: searchOps },
		routing: { send: { type: 'body', property: 'page' } },
	},
	{
		displayName: 'Per Page',
		name: 'perPage',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 50 },
		default: 10,
		displayOptions: { show: searchOps },
		routing: { send: { type: 'body', property: 'per_page' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: searchOps },
		options: [
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'city' } },
			},
			{
				displayName: 'Skills',
				name: 'skills',
				type: 'string',
				default: '',
				description: 'Comma-separated list. Match people who list any of these skills.',
				routing: {
					send: {
						type: 'body',
						property: 'skills',
						value: '={{$value.split(",").map(v => v.trim())}}',
					},
				},
			},
			{
				displayName: 'Past Company',
				name: 'pastCompany',
				type: 'string',
				default: '',
				description: 'Match people who previously worked at this company',
				routing: { send: { type: 'body', property: 'past_company' } },
			},
			{
				displayName: 'Education (School Name)',
				name: 'education',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'education' } },
			},
			{
				displayName: 'Tenure Minimum (Months)',
				name: 'tenureMinMonths',
				type: 'number',
				default: 0,
				description: 'Only people who have held their current role for at least this many months',
				routing: { send: { type: 'body', property: 'tenure_min_months' } },
			},
			{
				displayName: 'Job Changed After (Unix Timestamp)',
				name: 'jobChangedAfter',
				type: 'number',
				default: 0,
				description: 'Only people whose current role started after this Unix timestamp (seconds)',
				routing: { send: { type: 'body', property: 'job_changed_after' } },
			},
		],
	},
];

// ── Bulk Enrich ────────────────────────────────────────────────────────

const bulkOps = {
	resource: ['person'],
	operation: ['bulkEnrich'],
};

export const personBulkEnrichFields: INodeProperties[] = [
	{
		displayName: 'Profiles',
		name: 'profilesJson',
		type: 'json',
		default: '[\n  { "username": "example-user" },\n  { "linkedin_url": "https://www.example.com/in/another-user" }\n]',
		description:
			'Array of up to 100 identifiers. Each item must have exactly one of id, username, or linkedin_url.',
		displayOptions: { show: bulkOps },
		routing: {
			send: {
				type: 'body',
				property: 'profiles',
				value: '={{JSON.parse($value)}}',
			},
		},
	},
];

// ── Colleagues / Similar: require Kooperativa ID ──────────────────────

const requireIdOps = {
	resource: ['person'],
	operation: ['colleagues', 'similar'],
};

export const personRelatedFields: INodeProperties[] = [
	{
		displayName: 'Kooperativa ID',
		name: 'personId',
		type: 'string',
		default: '',
		required: true,
		description: 'Kooperativa profile ID, from Enrich or Search',
		displayOptions: { show: requireIdOps },
		routing: { send: { type: 'query', property: 'id' } },
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		displayOptions: { show: requireIdOps },
		routing: { send: { type: 'query', property: 'page' } },
	},
	{
		displayName: 'Per Page',
		name: 'perPage',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 25,
		displayOptions: { show: requireIdOps },
		routing: { send: { type: 'query', property: 'per_page' } },
	},
];

// ── Job Changes ─────────────────────────────────────────────────────────

const jobChangesOps = {
	resource: ['person'],
	operation: ['jobChanges'],
};

export const personJobChangesFields: INodeProperties[] = [
	{
		displayName: 'Days',
		name: 'days',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 365 },
		default: 90,
		description: 'Lookback window in days, default 90, max 365',
		displayOptions: { show: jobChangesOps },
		routing: { send: { type: 'query', property: 'days' } },
	},
	{
		displayName: 'Previous Company ID',
		name: 'companyId',
		type: 'string',
		default: '',
		description: 'Filter to people who previously worked at this company',
		displayOptions: { show: jobChangesOps },
		routing: { send: { type: 'query', property: 'company_id' } },
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		displayOptions: { show: jobChangesOps },
		routing: { send: { type: 'query', property: 'page' } },
	},
	{
		displayName: 'Per Page',
		name: 'perPage',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 25,
		displayOptions: { show: jobChangesOps },
		routing: { send: { type: 'query', property: 'per_page' } },
	},
];

export const personDescription: INodeProperties[] = [
	personOperations,
	...personEnrichFields,
	...personSearchFields,
	...personBulkEnrichFields,
	...personRelatedFields,
	...personJobChangesFields,
];
