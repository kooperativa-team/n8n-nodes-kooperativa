// tsc does not copy non-.ts assets (icons) into dist/, so this runs after
// the TypeScript build to place the node icon next to its compiled .js file,
// mirroring the path n8n expects (same directory as Kooperativa.node.js).
const fs = require('fs');
const path = require('path');

const files = [
	{
		from: path.join(__dirname, '..', 'nodes', 'Kooperativa', 'kooperativa.svg'),
		to: path.join(__dirname, '..', 'dist', 'nodes', 'Kooperativa', 'kooperativa.svg'),
	},
	{
		from: path.join(__dirname, '..', 'nodes', 'Kooperativa', 'kooperativa.dark.svg'),
		to: path.join(__dirname, '..', 'dist', 'nodes', 'Kooperativa', 'kooperativa.dark.svg'),
	},
];

for (const { from, to } of files) {
	fs.mkdirSync(path.dirname(to), { recursive: true });
	fs.copyFileSync(from, to);
	console.log(`Copied ${path.relative(process.cwd(), from)} -> ${path.relative(process.cwd(), to)}`);
}
