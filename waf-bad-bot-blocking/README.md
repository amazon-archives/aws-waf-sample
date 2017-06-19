# waf-bad-bot-blocking
> **NOTE**: This solution has been integrated into the [AWS WAF Security Automations](https://aws.amazon.com/answers/security/aws-waf-security-automations/), and is now maintained in that repository: [https://github.com/awslabs/aws-waf-security-automations](https://github.com/awslabs/aws-waf-security-automations).
> Please refer suggestions for improvement to that repository.

A solution for detecting bad bots and content scrapers and blocking their access. The detector relies on a honeypot URL. This is usually a piece of content that good actors know their not supposed to access, either because it's disallowed by the robots.txt file, or the link to it is hidden from human viewers. An Amazon API Gateway endpoint maps to the honeypot URL and triggers a AWS Lambda function once a request is received. The Lambda function then adds the source IP address of the request to a blacklist implemented using AWS WAF (a web application firewall that protects any application deployed on Amazon CloudFront content delivery service). The AWS Lambda function also issues an Amazon SNS notification on a topic you can subscribe to, and receive notifications anytime IPs are added to the blacklist.

***

Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/asl/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions and limitations under the License.
