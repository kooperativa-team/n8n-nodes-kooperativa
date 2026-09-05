import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAccount = {
	resource: ['account'],
};

export const accountOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: showOnlyForAccount,
	},
	options: [
		{
			name: 'Get Info',
			value: 'getInfo',
			action: 'Get account info',
			description: 'License status and usage breakdown for the authenticated account',
			routing: {
				request: {
					method: 'GET',
					url: '/me',
				},
			},
		},
		{
			name: 'Health Check',
			value: 'healthCheck',
			action: 'Health check',
			description: 'Simple liveness probe for the Kooperativa API. No authentication required.',
			routing: {
				request: {
					method: 'GET',
					url: '/health',
				},
			},
		},
	],
	default: 'getInfo',
};

export const accountDescription: INodeProperties[] = [accountOperations];
