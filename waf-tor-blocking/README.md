# waf-tor-blocking
> **NOTE**: This solution has been integrated into the [AWS WAF Security Automations](https://aws.amazon.com/answers/security/aws-waf-security-automations/), and is now maintained in that repository: [https://github.com/awslabs/aws-waf-security-automations](https://github.com/awslabs/aws-waf-security-automations).
> Please refer suggestions for improvement to that repository.

An AWS Lambda function for importing the TOR exit node list (https://check.torproject.org/exit-addresses) and updating AWS WAF IP Sets in order to deny access from the TOR network.
Amazon CloudWatch Scheduled Events can be utilised to execute the function regularly in order to automate the update of the IP Sets as the list are updated.

The function expects to be passed an event containing the list if WAF IP Set IDs that it will populate with the IP addresses found in the list, using the following format:

```json
{
    "ipSetIds": [
        "<ip-set-1-id>",
        "<ip-set-2-id>"
    ]
}
```

Please see waf-reputation-lists for a solution that supports multiple reputation lists, including the Tor Exit Node.

***

Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
