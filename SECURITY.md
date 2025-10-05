# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.3.7.x | :white_check_mark: |
| < 0.3.7 | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly:

### How to Report

1. **Email**: Send details to `security@getlifeundo.com`
2. **Telegram**: Contact [@GetLifeUndoSupport](https://t.me/GetLifeUndoSupport)
3. **GitHub**: Create a private security advisory (if you have access)

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 72 hours  
- **Fix Timeline**: Depends on severity (1-30 days)
- **Public Disclosure**: After fix is deployed

## Security Features

### Data Protection
- **100% Local Storage**: All user data stays in the browser
- **No Telemetry**: No data is sent to external servers
- **Encrypted Storage**: Sensitive data is encrypted locally

### Payment Security
- **FreeKassa Integration**: PCI DSS compliant payment processor
- **No Card Storage**: We never store payment card information
- **Secure API**: All payment APIs use HTTPS and proper authentication

### Extension Security
- **Minimal Permissions**: Only requests necessary browser permissions
- **Content Security Policy**: Strict CSP headers prevent XSS
- **Regular Updates**: Security patches released promptly

## Security Headers

Our website implements comprehensive security headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Vulnerability Disclosure

We follow responsible disclosure practices:

1. **Private Report**: Vulnerabilities are reported privately first
2. **Fix Development**: We develop and test fixes before disclosure
3. **Coordinated Release**: Security updates are released with patches
4. **Public Disclosure**: After fixes are deployed, we may disclose details

## Security Best Practices

### For Users
- Keep your browser and extensions updated
- Use strong, unique passwords
- Enable two-factor authentication where possible
- Be cautious with browser permissions

### For Developers
- Follow secure coding practices
- Regular security audits
- Dependency vulnerability scanning
- Penetration testing

## Contact

- **Security Email**: security@getlifeundo.com
- **General Support**: support@getlifeundo.com
- **Telegram**: [@GetLifeUndoSupport](https://t.me/GetLifeUndoSupport)
- **Website**: [getlifeundo.com](https://getlifeundo.com)

---

**Last Updated**: October 2025
