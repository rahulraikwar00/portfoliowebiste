---
title: S3 Security Guide for Production
date: October 20, 2023
slug: s3-security-guide-2023
---

S3 bucket misconfigurations cause a disproportionate number of cloud security incidents. The Verizon Data Breach report consistently finds storage misconfiguration as a leading cause of cloud data breaches. Every S3 bucket in production should follow these practices. I've audited dozens of AWS accounts, and the same misconfigurations appear repeatedly.

## Block Public Access

This is the single most important setting. S3's "Block Public Access" settings at the account level override all bucket policies and ACLs. Enable all four settings at the account level. Then explicitly enable public access only for buckets that genuinely need it — static website hosting, public data sets, CDN origins.

```bash
aws s3control put-public-access-block --account-id 123456789012 \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,\
  BlockPublicPolicy=true,RestrictPublicBuckets=true
```

This prevents any user in the account from making a bucket public. Even if someone creates a bucket policy that allows public access, this setting blocks it. It's the safety net. I've found publicly accessible S3 buckets in accounts where every engineer swore they'd never make a bucket public. The Block Public Access settings were the only thing preventing data exposure.

## Use Bucket Policies With Conditions

When you need cross-account access or service-specific access, use bucket policies with conditions:

- `aws:SourceArn` restricts which resources can access the bucket. For CloudFront origins or Lambda functions, this ensures only the expected service can read objects.
- `aws:SourceAccount` restricts which AWS account can access the bucket. This prevents confused deputy attacks where a service in another account tricks yours into granting access.
- `aws:SecureTransport` enforces HTTPS. Deny requests where this is false.
- `s3:x-amz-server-side-encryption` enforces encryption at rest for uploaded objects. Deny `PutObject` without the encryption header.

## Enable Encryption on Every Bucket

Enable SSE-S3 (AES-256) as the default encryption on every bucket. If you need customer-managed keys (for compliance requirements or separation of duties), use SSE-KMS. The KMS option costs ~$1/month per key plus $0.03 per 10,000 requests. SSE-S3 is free.

Enforce encryption in transit with a bucket policy condition: deny requests where `aws:SecureTransport` is false. This ensures all API calls use HTTPS. Without this, objects can be read over plain HTTP if someone makes an unencrypted request.

## Enable Versioning and Object Lock

Versioning protects against accidental deletion and overwrite. When versioning is enabled, overwriting an object creates a new version instead of replacing the old one. Deleting an object adds a delete marker instead of removing the object. This means you can recover from accidental deletions within the version retention period.

Object Lock (retention and legal hold) prevents deletion even by account root users. For critical data (logs, audit records, compliance data), enable Object Lock with a retention period. This creates a write-once-read-many (WORM) storage model that satisfies regulatory requirements.

## Enable Access Logging

Send S3 access logs to a separate bucket in a different account or with restricted access. The access log records every request made to the bucket — who accessed it, what action they took, what object they accessed, the response status, and the request IP address. Use AWS CloudTrail for data events if you need real-time monitoring.

## Delete Unused Buckets

Old S3 buckets from past projects accumulate. They have unknown configurations and unknown data. Find and delete them. Use AWS Config rules to identify buckets that haven't been accessed in 90 days. Tag buckets with expiration dates for ephemeral environments. I've found buckets containing production database backups that were three years old and hadn't been accessed in two years. No one knew they existed. No one knew what permissions they had.

S3 security is straightforward. The practices are well understood. The risk isn't in the technology — it's in neglecting the basics. Ten minutes of configuration per bucket prevents months of incident response.
