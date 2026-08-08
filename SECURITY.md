# Security Policy

## Public website boundary

This repository contains client-side files for a public website. Anything delivered to a visitor's browser—including HTML, CSS, JavaScript, images, public configuration, and displayed Sprite data—must be treated as public.

## Never commit

Do not commit Discord bot tokens, webhook URLs, Supabase service-role keys, database passwords, private API keys, staff notes, member records, moderation exports, backups, or unreleased internal information.

Use environment variables and a private backend repository for all secrets and privileged operations. Browser code must use only intentionally public/publishable credentials with server-side access controls.

## If a secret is exposed

Delete it from the current code, rotate or revoke it immediately, and review repository history because deleting a file does not remove it from earlier commits.

## Reporting

Report suspected exposure privately to the repository owner. Do not post credentials in public issues.
