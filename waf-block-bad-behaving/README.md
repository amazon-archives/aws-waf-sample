# waf-block-bad-behaving

A Lambda function that automatically parses CloudFront access logs as they are delivered to Amazon S3, counts the number of bad requests from unique sources (IP addresses), and updates AWS WAF to block further requests from those IP addresses. A CloudFormation template is included that creates the web access control list (ACL), rule sets, Lambda function, and logging S3 bucket.
Full blog post: http://blogs.aws.amazon.com/security/post/Tx223ZW25YRPRKV/How-to-Use-AWS-WAF-to-Block-IP-Addresses-That-Generate-Bad-Requests

***

Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/asl/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions and limitations under the License.
