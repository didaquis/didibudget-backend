import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const typesArray = loadFilesSync(import.meta.dirname, { extensions: ['ts', 'js'], ignoreIndex: true });

export default mergeTypeDefs(typesArray);
