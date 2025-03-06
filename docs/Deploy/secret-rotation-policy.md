# Secret Rotation Policy

## Overview
This document defines the policies and procedures for rotating secrets in the Airys Video platform.

## Scope
- Service Account Keys
- Application Secrets
- Encryption Keys
- API Keys and Tokens

## Regular Rotation Schedule

### Service Account Keys
- Rotation Interval: 90 days
- Method: Automated via Cloud Scheduler
- Services Affected:
  * Video Processor (airys-video-processor)
  * Cloud Run Service (airys-cloud-run)
  * Storage Manager (airys-storage-manager)

### Cloud KMS Keys
- Rotation Interval: 365 days
- Method: Automated via Cloud KMS automatic rotation
- Keys Affected:
  * service-account-key
  * app-secrets-key

### Application Secrets
- Rotation Interval: 180 days
- Method: Manual review and rotation
- Notification: 14 days before expiration

## Emergency Rotation Procedures

### Triggering Events
1. Security incident or breach
2. Unauthorized access detection
3. Employee departure (for manually managed secrets)
4. System compromise

### Emergency Response
1. Immediate key revocation
2. Generation of new keys
3. Update of all dependent services
4. Security incident documentation
5. Post-incident review

## Monitoring and Alerts

### Access Monitoring
- Cloud Audit Logs enabled for all secret access
- Anomaly detection for unusual access patterns
- Regular access review (monthly)

### Alert Conditions
1. Failed access attempts > 3 times in 5 minutes
2. Access from unauthorized IP ranges
3. Access outside business hours
4. Multiple version changes in short period

## Implementation

### Automated Rotation
```yaml
Schedule:
  - Service Account Keys:
      Cron: "0 0 1 */3 *"  # First day of every 3rd month
      Job: secret-management.sh rotate-key
      Notification: ops@airys.com.br
  
  - KMS Keys:
      Auto-rotation: Enabled
      Period: 365 days
      Notification: security@airys.com.br
```

### Manual Rotation Steps
1. Generate new secret version
2. Update applications with new secret
3. Verify application functionality
4. Archive old secret version
5. Document rotation in security log

## Recovery Procedures

### Rotation Failure
1. Immediate notification to security team
2. Rollback to previous version if needed
3. Investigation of failure cause
4. Rescheduling of rotation

### Service Impact Mitigation
- Maintain minimum 15-minute overlap of old/new secrets
- Perform rotations during maintenance windows
- Test all dependent services after rotation

## Compliance and Audit

### Documentation Requirements
- Record all rotation events
- Maintain audit trail of access
- Document emergency rotations
- Keep rotation history for 1 year

### Regular Review
- Monthly review of rotation logs
- Quarterly policy review
- Annual security assessment 