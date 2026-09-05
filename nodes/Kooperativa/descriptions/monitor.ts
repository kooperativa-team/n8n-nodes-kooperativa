import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMonitor = {
	resource: ['monitor'],
};

export const monitorOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: showOnlyForMonitor,
	},
	options: [
		{
			name: 'List',
			value: 'list',
			action: 'List monitors',
			description: 'Return all active webhook monitors for the workspace',
			routing: {
				request: {
					method: 'GET',
					url: '/monitors',
				},
			},
		},
		{
			name: 'Create',
			value: 'create',
			action: 'Create a monitor',
			description: 'Subscribe to change events on a profile or company URL',
			routing: {
				request: {
					method: 'POST',
					url: '/monitors',
				},
			},
		},
		{
			name: 'Delete',
			value: 'delete',
			action: 'Delete a monitor',
			description: 'Stop monitoring a profile or company and delete the monitor',
			routing: {
				request: {
					method: 'DELETE',
					url: '/monitors',
				},
			},
		},
	],
	default: 'list',
};

const createOps = {
	resource: ['monitor'],
	operation: ['create'],
};

export const monitorCreateFields: INodeProperties[] = [
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'Person', value: 'person' },
			{ name: 'Company', value: 'company' },
		],
		default: 'person',
		required: true,
		description: 'What kind of entity to monitor',
		displayOptions: { show: createOps },
		routing: { send: { type: 'body', property: 'type' } },
	},
	{
		displayName: 'Subject URL',
		name: 'subjectUrl',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'https://www.example.com/in/username',
		description: 'Full profile or company URL to monitor',
		displayOptions: { show: createOps },
		routing: { send: { type: 'body', property: 'subject_url' } },
	},
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'https://your-app.com/webhooks/kooperativa',
		description: 'HTTPS endpoint that will receive change events. Must start with https://.',
		displayOptions: { show: createOps },
		routing: { send: { type: 'body', property: 'webhook_url' } },
	},
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		default: '',
		description: 'Optional human-readable name for this monitor',
		displayOptions: { show: createOps },
		routing: { send: { type: 'body', property: 'label' } },
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'string',
		default: '',
		placeholder: 'person.job_changed,person.title_changed',
		description:
			'Comma-separated event types to subscribe to. Defaults to all events for the given type if left empty.',
		displayOptions: { show: createOps },
		routing: {
			send: {
				type: 'body',
				property: 'events',
				value: '={{$value ? $value.split(",").map(v => v.trim()) : undefined}}',
			},
		},
	},
];

const deleteOps = {
	resource: ['monitor'],
	operation: ['delete'],
};

export const monitorDeleteFields: INodeProperties[] = [
	{
		displayName: 'Monitor ID',
		name: 'monitorId',
		type: 'string',
		default: '',
		required: true,
		description: 'Monitor ID to delete (UUID)',
		displayOptions: { show: deleteOps },
		routing: { send: { type: 'query', property: 'id' } },
	},
];

export const monitorDescription: INodeProperties[] = [
	monitorOperations,
	...monitorCreateFields,
	...monitorDeleteFields,
];
