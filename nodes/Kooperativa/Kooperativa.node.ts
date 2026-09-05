import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { personDescription } from './descriptions/person';
import { companyDescription } from './descriptions/company';
import { monitorDescription } from './descriptions/monitor';
import { accountDescription } from './descriptions/account';

export class Kooperativa implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'kooperativa.io',
		name: 'kooperativa',
		icon: 'file:kooperativa.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Enrich and search professional profiles and companies with the kooperativa.io API',
		usableAsTool: true,
		defaults: {
			name: 'kooperativa.io',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'kooperativaApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://kooperativa.io/api/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Person', value: 'person' },
					{ name: 'Company', value: 'company' },
					{ name: 'Monitor', value: 'monitor' },
					{ name: 'Account', value: 'account' },
				],
				default: 'person',
			},
			...personDescription,
			...companyDescription,
			...monitorDescription,
			...accountDescription,
		],
	};
}
