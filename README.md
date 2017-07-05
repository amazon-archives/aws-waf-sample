# aws-waf-sample
Examples of sets of rules for the AWS WAF service and scripts to automate the management and configuration of AWS WAF rule sets. These examples include SDK usage, AWS CloudFormation templates and automations using AWS Lambda functions.

## waf-owasp-top-10
This example AWS CloudFormation template contains an AWS WAF web access control list (ACL) and condition types and rules that illustrate various mitigations against application flaws described in the OWASP Top 10. However, note that this template is designed only as a starting point and may not provide sufficient protection to every workload. You should customize the template’s rules for each workload. For more information, please review the [Use AWS WAF to Mitigate OWASP's Top 10 Web Application Vulnerabilities](https://d0.awsstatic.com/whitepapers/Security/aws-waf-owasp.pdf) whitepaper.

## waf-example-rules
This examples AWS CloudFormation templates contains basic AWS WAF rule examples.

## waf-reactive-blacklist
> **NOTE**: This solution has been integrated into the [AWS WAF Security Automations](https://aws.amazon.com/answers/security/aws-waf-security-automations/), and is now maintained in that repository: [https://github.com/awslabs/aws-waf-security-automations](https://github.com/awslabs/aws-waf-security-automations).
> Please refer suggestions for improvement to that repository.

A solution that automatically detects unwanted requests based on request rate, and then updates configurations of AWS WAF (a web application firewall that protects any application deployed on Amazon CloudFront content delivery service) to block subsequent requests from those users. This process is executed by a lambda function that processes application’s access log files in order to identify bad requesters. This function also exposes execution metrics in CloudWatch so you can monitor how many request entries were processed and the number of origins blocked. Finally, the solution also support that you manually add IP ranges that you want to block in advance like well know bot networks.

## waf-bad-bot-blocking
> **NOTE**: This solution has been integrated into the [AWS WAF Security Automations](https://aws.amazon.com/answers/security/aws-waf-security-automations/), and is now maintained in that repository: [https://github.com/awslabs/aws-waf-security-automations](https://github.com/awslabs/aws-waf-security-automations).
> Please refer suggestions for improvement to that repository.

A solution for detecting bad bots and content scrapers and blocking their access. The detector relies on a honeypot URL. This is usually a piece of content that good actors know their not supposed to access, either because it's disallowed by the robots.txt file, or the link to it is hidden from human viewers. An Amazon API Gateway endpoint maps to the honeypot URL and triggers a AWS Lambda function once a request is received. The Lambda function then adds the source IP address of the request to a blacklist implemented using AWS WAF (a web application firewall that protects any application deployed on Amazon CloudFront content delivery service). The AWS Lambda function also issues an Amazon SNS notification on a topic you can subscribe to, and receive notifications anytime IPs are added to the blacklist.

## waf-block-bad-behaving
> **NOTE**: This solution has been integrated into the [AWS WAF Security Automations](https://aws.amazon.com/answers/security/aws-waf-security-automations/), and is now maintained in that repository: [https://github.com/awslabs/aws-waf-security-automations](https://github.com/awslabs/aws-waf-security-automations).
> Please refer suggestions for improvement to that repository.

A solution that automatically parses CloudFront access logs as they are delivered to Amazon S3 by using Lambda, counts the number of bad requests from unique sources (IP addresses), and updates AWS WAF to block further requests from those IP addresses. A CloudFormation template is included that creates the web access control list (ACL), rule sets, Lambda function, and logging S3 bucket.
Full blog post: http://blogs.aws.amazon.com/security/post/Tx223ZW25YRPRKV/How-to-Use-AWS-WAF-to-Block-IP-Addresses-That-Generate-Bad-Requests

## waf-reputation-lists
> **NOTE**: This solution has been integrated into the [AWS WAF Security Automations](https://aws.amazon.com/answers/security/aws-waf-security-automations/), and is now maintained in that repository: [https://github.com/awslabs/aws-waf-security-automations](https://github.com/awslabs/aws-waf-security-automations).
> Please refer suggestions for improvement to that repository.

An AWS CloudFormation template that creates an AWS WAF Web ACL, Rules, and IP Sets, an AWS Lambda function and CloudWatch Scheduled Event. The Lambda function imports multiple IP reputation lists and updates AWS WAF IP Sets in order to deny access from the IP ranges defined in those lists.
Amazon CloudWatch Scheduled Events is utilised to execute the function regularly in order to automate the update of the IP Sets as the lists are updated. Full blog post: https://aws.amazon.com/blogs/security/how-to-import-ip-address-reputation-lists-to-automatically-update-aws-waf-ip-blacklists/


***

Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/asl/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions and limitations under the License.
