#!/usr/bin/env node
/*
Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Amazon Software License (the "License"). You may not use this file except in compliance with the License.
A copy of the License is located at http://aws.amazon.com/asl/ or in the "license" file accompanying this file. 
This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. 
See the License for the specific language governing permissions and limitations under the License.
*/

var readline = require('readline');
var aws = require('aws-sdk');
var https = require('https');
var async = require('async');

// configure API retries
aws.config.update({
    maxRetries: 3,
    retryDelayOptions: {
        base: 1000
    }
});
var waf = new aws.WAF();

/**
 * Maximum number of IP descriptors per IP Set
 */
var maxDescriptorsPerIpSet = 1000;

/**
 * Maximum number of IP descriptors updates per call
 */
var maxDescriptorsPerIpSetUpdate = 1000;

/**
 * URL for TOR exit node list
 */
var url = 'https://check.torproject.org/exit-addresses';

/**
 * Call context.done, logging message to console
 * @param {Context} context - Lambda context object
 * @param {Error} err - Error object
 * @param {String} message - Message
 */
function done(context, err, message) {
    if (err) {
        console.error(message, err);
    } else {
        console.log(message);
    }
    context.done(err, message);
}

/**
 * Main handler
 */
exports.handler = function (event, context) {
    console.log('event: ' + JSON.stringify(event));
    if (!event || !event.ipSetIds || (event.ipSetIds.length === 0)) {
        done(context, null, 'No IP Set IDs defined in event object');
    } else {
        async.parallel([
            // download list and parse for addresses
            function (callback) {
                var addresses = [];
                https.get(url, function (response) {
                    // create a reader object to read the list one line at a time
                    var reader = readline.createInterface({ terminal: false, input: response });
                    var regex = new RegExp('^ExitAddress ((?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])(?:/(?:3[0-2]|[1-2][0-9]|[0-9]))?)');
                    reader.on('line', function (line) {
                        var result = regex.exec(line);
                        // if there is a result, an address has been found
                        if (result) {
                            var address = result[1];
                            // add the address if it is not a duplicate
                            if (addresses.indexOf(address) === -1) {
                                addresses.push(result[1]);
                            }
                        }
                    });
                    reader.on('close', function () {
                        console.log(addresses.length + ' addresses read from the TOR exit list at ' + url);
                        callback(null, addresses);
                    });
                }).on('error', function (err) {
                    console.error('Error downloading TOR exit list at ' + url, err);
                    callback(err);
                });
            },
            // get each waf ip set 
            function (callback) {
                async.map(event.ipSetIds, function (IPSetId, callback) {
                    waf.getIPSet({ IPSetId: IPSetId }, callback);
                }, function (err, ipSets) {
                    if (err) {
                        console.error('Error getting IP sets', err);
                    } else {
                        // ipSets is an array of objects with an IPSet property, so 'flatten' it
                        ipSets = ipSets.map(function (ipSet) {
                            return ipSet.IPSet;
                        });
                        console.log(ipSets.length + ' IP Sets in total');
                    }
                    callback(err, ipSets);
                });
            }
        ], function (err, addressesAndIPSets) {
            if (err) {
                done(context, err, 'Error getting addresses from TOR exit list and/or IP sets');
            } else {
                // addressesAndIPSets is an array with two elements - the first is an array of addresses, the second an array of IPSets
                var addresses = addressesAndIPSets[0];
                var ipSets = addressesAndIPSets[1];
                var tasks = [];
                ipSets.forEach(function (ipSet, index) {
                    var ipSetName = ipSet.Name;
                    var ipSetDescriptors = ipSet.IPSetDescriptors;
                    var begin = index * maxDescriptorsPerIpSet;
                    var addressesSlice = addresses.slice(begin, begin + maxDescriptorsPerIpSet);
                    console.log('IP Set ' + ipSetName + ' currently has ' + ipSetDescriptors.length + ' descriptors; it should have ' + addressesSlice.length);
                    var updates = [];
                    ipSetDescriptors.forEach(function (ipSetDescriptor) {
                        var cidr = ipSetDescriptor.Value;
                        var found;
                        // try to find the descriptor in the addresses slice for the IP Set
                        for (var i = 0; i < addressesSlice.length; i++) {
                            if (addressesSlice[i] + '/32' === cidr) {
                                addressesSlice.splice(i, 1);
                                found = true;
                                break;
                            }
                        }
                        // if this descriptor is not found in the addresses, delete it 
                        if (!found) updates.push({ Action: 'DELETE', IPSetDescriptor: ipSetDescriptor });
                    });
                    // all the addresses left are inserted into the IP Set
                    Array.prototype.push.apply(updates, addressesSlice.map(function (address) {
                        return { Action: 'INSERT', IPSetDescriptor: { Type: 'IPV4', Value: address + '/32' } };
                    }));
                    var updatesLength = updates.length;
                    if (updatesLength > 0) {
                        console.log('IP Set ' + ipSetName + ' requires ' + updatesLength + ' updates');
                        // limit the number of IPSetDescriptor updates in a single update call by batching them
                        var batches = [];
                        while (updates.length) {
                            batches.push(updates.splice(0, maxDescriptorsPerIpSetUpdate));
                        }
                        Array.prototype.push.apply(tasks, batches.map(function(updateBatch) {
                            return function (callback) {
                                async.waterfall([
                                    // in order to make an update to the IPSet, we need to obtain a change token first
                                    function (callback) {
                                        waf.getChangeToken({}, callback);
                                    },
                                    function (response, callback) {
                                        console.log('Updating IP set ' + ipSetName + ' with ' + updateBatch.length + ' updates');
                                        waf.updateIPSet({
                                            ChangeToken: response.ChangeToken,
                                            IPSetId: ipSet.IPSetId,
                                            Updates: updateBatch
                                        }, callback);
                                    }
                                ], function (err) {
                                    if (err) {
                                        console.error('Error updating IP set ' + ipSetName, err);
                                    } else {
                                        console.log('Updated IP set ' + ipSetName);
                                    }
                                    callback(err);
                                });
                            };
                        }));
                    } else {
                        // there are no updates for this IP Set
                        console.log('No update required for IP set' + ipSetName);
                    }
                });
                if (tasks.length > 0) {
                    // there are update tasks to be performed and IP Sets that require updating
                    async.series(tasks, function (err) {
                        var unusedAddressCount = addresses.length - (ipSets.length * maxDescriptorsPerIpSet);
                        done(context, err, err ? 'Error updating IP sets' : 'Updated IP sets' + (unusedAddressCount > 0 ? ', ' + unusedAddressCount + ' addresses unable to fit in IP sets' : ''));
                    });
                } else {
                    done(context, null, 'No updates required for IP sets');
                }
            }
        });
    }
};