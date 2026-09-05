import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class KooperativaApi implements ICredentialType {
	name = 'kooperativaApi';
	displayName = 'kooperativa.io API';
	documentationUrl = 'https://docs.kooperativa.io';
	icon: ICredentialType['icon'] = { light: 'file:../nodes/Kooperativa/kooperativa.svg', dark: 'file:../nodes/Kooperativa/kooperativa.svg' };

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Kooperativa API key, from https://kooperativa.io/api-keys. Starts with kk_live_.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://kooperativa.io/api/v1',
			url: '/me',
			method: 'GET',
		},
	};
}
