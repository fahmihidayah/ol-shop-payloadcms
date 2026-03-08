# MailHog Setup for Email Testing

## What is MailHog?

MailHog is a local email testing tool that captures emails sent from your application without actually sending them to real email addresses. Perfect for development and testing.

## Installation

### Using Docker (Recommended)

```bash
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

### Using Homebrew (macOS)

```bash
brew install mailhog
mailhog
```

### Using Go

```bash
go install github.com/mailhog/MailHog@latest
MailHog
```

## Configuration

### 1. Update your `.env` file

Add or update these environment variables:

```env
# Email Configuration
EMAIL_FROM_NAME=Online Store
EMAIL_FROM_ADDRESS=noreply@example.com

# MailHog SMTP Configuration
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false

# Leave SMTP_USER and SMTP_PASS empty for MailHog (no authentication needed)
# SMTP_USER=
# SMTP_PASS=
```

### 2. Access MailHog Web Interface

Once MailHog is running, open your browser and go to:

```
http://localhost:8025
```

This web interface will display all emails captured by MailHog.

## Testing the Setup

### 1. Start MailHog

```bash
# If using Docker
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# If installed via Homebrew or Go
mailhog
```

### 2. Start your application

```bash
pnpm dev
```

### 3. Register a new user

1. Go to your registration page
2. Fill in the registration form
3. Submit the form

### 4. Check MailHog

1. Open http://localhost:8025
2. You should see the welcome email in the MailHog inbox

## Ports

- **SMTP Port**: 1025 (used by your application to send emails)
- **Web UI Port**: 8025 (used to view captured emails)

## Troubleshooting

### Error: "Error verifying Nodemailer transport"

**Cause**: MailHog is not running or wrong configuration

**Solution**:
1. Make sure MailHog is running on port 1025
2. Check your `.env` file has correct SMTP settings:
   - `SMTP_HOST=localhost`
   - `SMTP_PORT=1025`
   - `SMTP_SECURE=false`
3. Restart your application after changing `.env`

### Emails not appearing in MailHog

**Solution**:
1. Check MailHog is running: `curl http://localhost:8025`
2. Check application logs for email sending errors
3. Verify environment variables are loaded correctly

### Cannot connect to MailHog

**Solution**:
1. Check if port 1025 is available: `lsof -i :1025`
2. Try restarting MailHog
3. Check firewall settings

## Production Configuration

Remember to change these settings for production:

```env
# Production SMTP (example with Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

Or use a dedicated email service like:
- **Resend** (recommended)
- SendGrid
- Mailgun
- AWS SES
- Postmark
