import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCompany = {
	resource: ['company'],
};

export const companyOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: showOnlyForCompany,
	},
	options: [
		{
			name: 'Enrich',
			value: 'enrich',
			action: 'Enrich a company',
			description: "Return a company's full profile by URL, username, company ID, or ID",
			routing: {
				request: {
					method: 'GET',
					url: '/company',
				},
			},
		},
		{
			name: 'Check Exists',
			value: 'check',
			action: 'Check if a company exists',
			description: 'Cheaply check whether Kooperativa holds this company, without fetching the full record',
			routing: {
				request: {
					method: 'GET',
					url: '/company/check',
				},
			},
		},
		{
			name: 'Search',
			value: 'search',
			action: 'Search companies',
			description: 'Search the data lake of companies by name, location, industry, and headcount',
			routing: {
				request: {
					method: 'POST',
					url: '/companies/search',
				},
			},
		},
		{
			name: 'Get Current Employees',
			value: 'currentEmployees',
			action: 'Get current employees',
			description: 'List people currently working at a company',
			routing: {
				request: {
					method: 'GET',
					url: '/company/current-employees',
				},
			},
		},
		{
			name: 'Get Past Employees',
			value: 'pastEmployees',
			action: 'Get past employees',
			description: 'List people who previously worked at a company, with their past role there',
			routing: {
				request: {
					method: 'GET',
					url: '/company/past-employees',
				},
			},
		},
		{
			name: 'Get Headcount by Seniority',
			value: 'headcountBySeniority',
			action: 'Get headcount by seniority',
			description: "Breakdown of a company's indexed profiles by seniority level",
			routing: {
				request: {
					method: 'GET',
					url: '/company/headcount-by-seniority',
				},
			},
		},
		{
			name: 'Get Hiring Signals',
			value: 'hiringSignals',
			action: 'Get hiring signals',
			description: 'People who recently joined this company, a signal of growth or expansion',
			routing: {
				request: {
					method: 'GET',
					url: '/company/hiring-signals',
				},
			},
		},
	],
	default: 'enrich',
};

// ── Enrich / Check ─────────────────────────────────────────────────────

const enrichOrCheckOps = {
	resource: ['company'],
	operation: ['enrich', 'check'],
};

export const companyEnrichFields: INodeProperties[] = [
	{
		displayName: 'Profile URL',
		name: 'linkedinUrl',
		type: 'string',
		default: '',
		placeholder: 'https://www.example.com/company/acme-corp',
		description: 'Full company profile URL. Provide exactly one of Profile URL, Username, Company ID, or ID.',
		displayOptions: { show: enrichOrCheckOps },
		routing: { send: { type: 'query', property: 'linkedin_url' } },
	},
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		default: '',
		placeholder: 'argus-media',
		description: 'Company slug, the part after /company/. Fastest lookup.',
		displayOptions: { show: enrichOrCheckOps },
		routing: { send: { type: 'query', property: 'username' } },
	},
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		default: '',
		description: 'Numeric company ID',
		displayOptions: { show: enrichOrCheckOps },
		routing: { send: { type: 'query', property: 'company_id' } },
	},
	{
		displayName: 'Kooperativa ID',
		name: 'id',
		type: 'string',
		default: '',
		description: 'Kooperativa internal company ID',
		displayOptions: { show: enrichOrCheckOps },
		routing: { send: { type: 'query', property: 'id' } },
	},
];

// ── Search ─────────────────────────────────────────────────────────────

const searchOps = {
	resource: ['company'],
	operation: ['search'],
};

export const companySearchFields: INodeProperties[] = [
	{
		displayName: 'Country Code',
		name: 'country',
		type: 'string',
		default: '',
		placeholder: 'US',
		description: 'HQ country code, ISO 2-letter. Full country names return 0 results.',
		displayOptions: { show: searchOps },
		routing: { send: { type: 'body', property: 'country' } },
	},
	{
		displayName: 'Industry',
		name: 'industry',
		type: 'string',
		default: '',
		placeholder: 'Software Development',
		description: 'Exact industry label using the company taxonomy (differs from Person Search industry values)',
		displayOptions: { show: searchOps },
		routing: { send: { type: 'body', property: 'industry' } },
	},
	{
		displayName: 'Min Staff',
		name: 'minStaff',
		type: 'number',
		default: 0,
		description: 'Minimum employee count, inclusive',
		displayOptions: { show: searchOps },
		routing: { send: { type: 'body', property: 'min_staff' } },
	},
	{
		displayName: 'Max Staff',
		name: 'maxStaff',
		type: 'number',
		default: 0,
		description: 'Maximum employee count, inclusive',
		displayOptions: { show: searchOps },
		routing: { send: { type: 'body', property: 'max_staff' } },
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
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Full-text search across company name and tagline',
				routing: { send: { type: 'body', property: 'query' } },
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'HQ city name',
				routing: { send: { type: 'body', property: 'city' } },
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				routing: { send: { type: 'body', property: 'page' } },
			},
			{
				displayName: 'Per Page',
				name: 'perPage',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 50 },
				default: 10,
				routing: { send: { type: 'body', property: 'per_page' } },
			},
		],
	},
];

// ── Employees / Headcount / Hiring signals: all keyed by numeric Company ID ─

const companyIdOps = {
	resource: ['company'],
	operation: ['currentEmployees', 'pastEmployees', 'headcountBySeniority', 'hiringSignals'],
};

const pagedOps = {
	resource: ['company'],
	operation: ['currentEmployees', 'pastEmployees', 'hiringSignals'],
};

export const companyRelatedFields: INodeProperties[] = [
	{
		displayName: 'Company ID',
		name: 'companyIdRequired',
		type: 'string',
		default: '',
		required: true,
		description: 'Numeric company ID, from Enrich Company or Search Companies',
		displayOptions: { show: companyIdOps },
		routing: { send: { type: 'query', property: 'company_id' } },
	},
	{
		displayName: 'Days',
		name: 'days',
		type: 'number',
		typeOptions: { maxValue: 365 },
		default: 90,
		description: 'Look-back window in days',
		displayOptions: { show: { resource: ['company'], operation: ['hiringSignals'] } },
		routing: { send: { type: 'query', property: 'days' } },
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		displayOptions: { show: pagedOps },
		routing: { send: { type: 'query', property: 'page' } },
	},
	{
		displayName: 'Per Page',
		name: 'perPage',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 25,
		displayOptions: { show: pagedOps },
		routing: { send: { type: 'query', property: 'per_page' } },
	},
];

export const companyDescription: INodeProperties[] = [
	companyOperations,
	...companyEnrichFields,
	...companySearchFields,
	...companyRelatedFields,
];
