# File sorting terminal tool

A simple commandline utility that allows you to recursively sort files in directories by its extensions.

## Installation

All you have to do is install NodeJS. [https://nodejs.org/en/download/package-manager]

**Attention!** NodeJS version required >= 18.3

## Usage

Sorting txt and jpg files in current dir

```sh
node fsort.js txt jpg
```

Recursively sorting txt files in specified directory

```sh
node fsort.js txt --dir /foo/dir -r
```

### Options
| Flag  | Long Flag           | Usage                                                                 |
| ----- | ------------------- | --------------------------------------------------------------------- |
| -d    | --dir               | takes valid path argument of directory that should be processed       |
| -r    | --recursive         | boolean flag to make sorting recursive                                |
