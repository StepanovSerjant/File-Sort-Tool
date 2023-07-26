const fs = require('fs');
const path = require('path');
const process = require('process');
const util = require('node:util');

const CURRENT_DIR = __dirname;
const CURRENT_FILEPATH = __filename;
const PARSER_ARGS = process.argv.slice(2);
const PARSER_OPTIONS = {
	dir: {
		type: 'string',
		short: 'd',
		default: CURRENT_DIR
	},
	recursive: {
		type: 'boolean',
		short: 'r',
		default: false
	}
};
const PARSER_CONFIG = {
	args: PARSER_ARGS,
	options: PARSER_OPTIONS,
	tokens: true,
	allowPositionals: true
};

function getFileExtension(fileName) {
	return path.extname(fileName).split('.')[1];
}

function getJoinedResolvedPath(paths) {
	return path.resolve(path.join(...paths));
}

function processDir(workDir, sortDir, extensionsToSort) {
	let sortedFiles = [];
	let dirs = [];
	const fileList = fs.readdirSync(workDir);

	for (const fileName of fileList) {
		const fileNamePath = getJoinedResolvedPath([workDir, fileName]);

		if (fileNamePath === CURRENT_FILEPATH) {
			continue;
		}

		if (fs.statSync(fileNamePath).isDirectory() === true) {
			dirs.push(fileNamePath);
			continue;
		}

		const fileExtension = getFileExtension(fileName);
		if (extensionsToSort.includes(fileExtension)) {
			const sortDirPath = getJoinedResolvedPath([sortDir, fileExtension.toUpperCase()]);
			if (!fs.existsSync(sortDirPath)) {
				fs.mkdirSync(sortDirPath);
			}

			fs.rename(
				fileNamePath,
				getJoinedResolvedPath([sortDirPath, fileName]),
				function(err) {
					if (err) throw err
				}
			)

			sortedFiles.push(fileNamePath);
			console.log(`Sorted ${fileNamePath} file.`);
		}
	}
	return {
		sortedFiles: sortedFiles,
		dirs: dirs
	}
}

function main() {
	const {
		values,
		positionals
	} = util.parseArgs(PARSER_CONFIG);
	const workDir = path.resolve(values.dir);
	const isRecursive = values.recursive;

	if (!positionals) {
		console.log('File extensions to sort not specified.');
	} else if (!fs.existsSync(workDir)) {
		console.log('Selected directory does not exists.');
	} else {
		console.log('Processing...')

		const processedWorkDir = processDir(workDir, workDir, positionals);
		let sortedFiles = processedWorkDir.sortedFiles;
		let foundDirs = processedWorkDir.dirs;

		if (isRecursive && foundDirs.length > 0) {
			while (foundDirs.length > 0) {
				const lastDirIndex = foundDirs.length - 1;
				const lastDir = foundDirs.pop(lastDirIndex);

				const processedDir = processDir(lastDir, workDir, positionals);
				const sortedLastDirFiles = processedDir.sortedFiles;
				const lastDirDirs = processedDir.dirs;
				if (lastDirDirs.length > 0) {
					foundDirs.push(...lastDirDirs);
				}
				if (sortedLastDirFiles.length > 0) {
					sortedFiles.push(...sortedLastDirFiles);
				}
			}
		}

		if (!sortedFiles.length) {
			console.log('Files to sort not found.');
		} else {
			console.log('Sorting finished.');
		}
	}
}

main();
