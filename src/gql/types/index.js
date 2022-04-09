'use strict';

const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const typesArray = loadFilesSync(__dirname, { extensions: ['js'], ignoreIndex: true });

module.exports = mergeTypeDefs(typesArray);
