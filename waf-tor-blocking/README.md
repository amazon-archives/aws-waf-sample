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

Licensed under the Amazon Software License (the "License"). You may not use this file except in compliance with the License.
A copy of the License is located at http://aws.amazon.com/asl/ or in the "license" file accompanying this file.
This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied.
See the License for the specific language governing permissions and limitations under the License.
