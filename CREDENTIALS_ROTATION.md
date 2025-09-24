# Credentials Rotation Playbook

## When to Rotate
- Leak suspected or confirmed
- Team change
- Regular schedule (quarterly)

## Steps
1) Identify scope (service, token type, usage).
2) Issue new token/secret; update consumers (CI, dashboards).
3) Revoke old token.
4) Verify access; log rotation in this file (date, owner, service).

## Rotation Log
- 2025-01-XX: Gumroad password rotated (leak detected)
- 2025-01-XX: Linux WSL credentials rotated (leak detected)  
- 2025-01-XX: VIP account password rotated (leak detected)





















