/*
Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/asl/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions and limitations under the License.
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
