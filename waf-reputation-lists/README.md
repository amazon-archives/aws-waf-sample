# waf-reputation-lists
> **NOTE**: This solution has been integrated into the [AWS WAF Security Automations](https://aws.amazon.com/answers/security/aws-waf-security-automations/), and is now maintained in that repository: [https://github.com/awslabs/aws-waf-security-automations](https://github.com/awslabs/aws-waf-security-automations).
> Please refer suggestions for improvement to that repository.

An AWS CloudFormation template that creates an AWS WAF Web ACL, Rules, and IP Sets, an AWS Lambda function and CloudWatch Scheduled Event. The Lambda function imports multiple IP reputation lists and updates AWS WAF IP Sets in order to deny access from the IP ranges defined in those lists.
Amazon CloudWatch Scheduled Events is utilised to execute the function regularly in order to automate the update of the IP Sets as the lists are updated.

Full blog post: https://aws.amazon.com/blogs/security/how-to-import-ip-address-reputation-lists-to-automatically-update-aws-waf-ip-blacklists/

The templates expects a "ReputationLists" parameter providing a JSON object defining the URLs to the lists

```json
[
    {
        "url": "https://www.spamhaus.org/drop/drop.txt"
    },
    {
        "url": "https://check.torproject.org/exit-addresses",
        "prefix": "ExitAddress "
    },
    {
        "url": "https://rules.emergingthreats.net/fwrules/emerging-Block-IPs.txt"
    }
]
```

***

Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License"). You may not use this file except in compliance with the License.
A copy of the License is located at http://aws.amazon.com/asl/ or in the "license" file accompanying this file.
This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied.
See the License for the specific language governing permissions and limitations under the License.
