/*
// Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0.
*/

/*jslint node: true */
"use strict";

// init Grunt
var grunt = require('grunt');

// load modules
grunt.loadNpmTasks('grunt-aws-lambda');

// define configuration
grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	lambda_invoke: {
		default: {
			options: {
				file_name: 'function.js',
				handler: 'handler',
				event: 'testing/event.json'
			}
		}
	},
	lambda_package: {
		default: {
			options: {
				include_files: [],
				include_time: false,
				package_folder: './',
				dist_folder: 'dist',
			}
		}
	}
});
