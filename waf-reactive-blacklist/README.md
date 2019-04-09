# waf-reactive-blacklist
> **NOTE**: This solution has been integrated into the [AWS WAF Security Automations](https://aws.amazon.com/answers/security/aws-waf-security-automations/), and is now maintained in that repository: [https://github.com/awslabs/aws-waf-security-automations](https://github.com/awslabs/aws-waf-security-automations).
> Please refer suggestions for improvement to that repository.

A solution that automatically detects unwanted requests based on request rate, and then updates configurations of AWS WAF (a web application firewall that protects any application deployed on Amazon CloudFront content delivery service) to block subsequent requests from those users. This process is executed by a lambda function that processes application’s access log files in order to identify bad requesters. This function also exposes execution metrics in CloudWatch so you can monitor how many request entries were processed and the number of origins blocked. Finally, the solution also support that you manually add IP ranges that you want to block in advance like well know bot networks.

***

Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
