# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Coolify
- **API**: `http://localhost:8000/api/v1/`
- **Token**: `1|lyM0bCJlu9KyMFbuF9E4jpDHLmB1VwNZ4ko8wtgO343c7e48`
- **Server UUID** (abds-server): `pokoc8wcgcg8o0gk8gocog0c`
- **Traefik dashboard**: `http://localhost:8088`
- **Note**: Port 443 bound to LAN IP (192.168.178.126) due to Tailscale conflict

## Servers
- **abds-server**: 192.168.178.126 (LAN), 100.116.70.63 (Tailscale), 10.0.1.1 (Docker bridge)
- **abds-vm**: 100.116.189.97 (Tailscale) - secondary, often unreachable

## Hetzner Cloud
- **API Key**: `yHnAktMRxjH8ulbyYW6gPJYSmwwxQTPiHklHCHHpN9vQxWqIwcKAUouh6ki9Gfwj`
- **API Endpoint**: `https://api.hetzner.cloud/v1`

## Cloudflare
- **API Token**: `vGUUBkyQTWCDaUVGa8P-iukcCB84yG2dI_a6SqWC`
- **Account ID**: `9d92d016263e2e4324b9eeb1994a8148`
- **Account**: drbobber.techtools@gmail.com
- **API Endpoint**: `https://api.cloudflare.com/client/v4`
- **Capabilities**: DNS management, CDN, SSL, Workers

## Google AI (Gemini)
- **API Key**: Configured in Clawdbot (needs verification)
- **Account**: drbobber.techtools@gmail.com
- **Note**: Check Google AI Studio for active key

## GitHub
- **Username**: drbobber
- **Email**: 183760114+drbobber@users.noreply.github.com
- **Status**: Needs authentication token
- **Setup Guide**: `/home/abds/GITHUB_SETUP.md`

---

## Business Operations
- **Location**: `/home/abds/business-ops/`
- **Strategy**: `STRATEGY.md` - Business goals and KPIs
- **Products**: `products/digital/PRODUCTS.md` - Product catalog
- **Tracking**: `data/metrics/TRACKING.md` - Daily metrics

### Agents (Lean Version)
| Agent | Trigger | Model | Role |
|-------|---------|-------|------|
| Content Creator | @content | GLM-4.7 | Social media content |
| Sales Specialist | @sales | Opus (on-demand) | Conversions & funnels |
| Analytics Expert | @analytics | GLM-4.7 | Metrics & reporting |

### Key Files
- `/home/abds/business-ops/README.md` - Overview
- `/home/abds/business-ops/STRATEGY.md` - Business strategy
- `/home/abds/business-ops/workflows/` - Automated workflows
- `/home/abds/business-ops/products/digital/` - Product info

### Tools & Services
- **Designrr** (app.designrr.io) - Ebook formatting & design
  - Account: bhouri.ayssen@gmail.com
  - Use for: Converting content to professional ebook PDFs

---

Add whatever helps you do your job. This is your cheat sheet.
