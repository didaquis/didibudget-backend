declare module 'jsonfile' {
	const jsonfile: {
		readFileSync: (file: string) => unknown;
	};
	export default jsonfile;
}
