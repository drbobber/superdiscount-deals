# GitHub Templates Report: Next.js + Supabase + shadcn/ui

*Report generated: 2026-02-02*
*Purpose: Speed up software development workflow with production-ready templates*

---

## 🏆 Top Templates Ranked by Popularity

### 1. **Next.js Boilerplate** by ixartz
- **Stars**: ⭐ 12,595
- **Forks**: 2,358
- **Last Updated**: Feb 2, 2026
- **Link**: https://github.com/ixartz/Next-js-Boilerplate
- **Stack**: Next.js 16, TypeScript, Tailwind CSS 4, Drizzle ORM, Playwright, Storybook
- **Best For**: General-purpose production apps with full DX tooling

**Features**:
- App Router + Page Router support
- Full TypeScript setup with strict mode
- ESLint, Prettier, Husky, Lint-Staged pre-configured
- Testing: Vitest, Testing Library, Playwright
- Storybook for component development
- Sentry integration for error tracking
- PostCSS + Tailwind CSS 4

**Pros**:
- Most popular (proven, battle-tested)
- Extremely comprehensive DX tooling
- Very active maintenance
- MIT License

**Cons**:
- Heavy weight (might be overkill for simple projects)
- No built-in auth or payments (you add those yourself)
- Not SaaS-focused out of the box

---

### 2. **Next.js Landing Page Template** by ixartz
- **Stars**: ⭐ 2,100
- **Forks**: 719
- **Last Updated**: Feb 1, 2026
- **Link**: https://github.com/ixartz/Next-JS-Landing-Page-Starter-Template
- **Stack**: Next.js 14, TypeScript, Tailwind CSS 3
- **Best For**: Marketing pages, landing pages, product showcases

**Features**:
- Modern, responsive landing page design
- Tailwind CSS 3 + TypeScript
- ESLint, Prettier, Husky configured
- Optimized for SEO
- Multiple section templates

**Pros**:
- Beautiful, production-ready design
- Quick start for marketing pages
- Very popular (proven design patterns)
- Easy to customize

**Cons**:
- Not a full app template
- No auth, database, or business logic

---

### 3. **Next.js SaaS Starter Kit** by michaelshimeles
- **Stars**: ⭐ 3,015
- **Forks**: 757
- **Last Updated**: Feb 2, 2026
- **Link**: https://github.com/michaelshimeles/nextjs-starter-kit
- **Stack**: Next.js 15, TypeScript, Tailwind CSS 4, shadcn/ui, Neon PostgreSQL, Drizzle ORM, Better Auth, Polar.sh
- **Best For**: SaaS products with subscriptions

**Features**:
- **Auth**: Better Auth v1.2.8 + Google OAuth
- **Payments**: Polar.sh subscriptions (2 tiers)
- **AI**: OpenAI chatbot integration
- **UI**: shadcn/ui + Radix UI + dark mode
- **DB**: Neon PostgreSQL + Drizzle ORM
- **Storage**: Cloudflare R2 for file uploads
- **Analytics**: PostHog integration
- **Dashboard**: Full protected dashboard area

**Pros**:
- Complete SaaS stack (auth, payments, storage, analytics)
- Modern tech (Next.js 15, Tailwind 4, Better Auth)
- AI integration built-in
- Production-ready with all SaaS features
- Very active (updated Feb 2026)

**Cons**:
- Multiple service dependencies (Neon, R2, Polar.sh, OpenAI)
- Polar.sh may not be your preferred payment provider
- More complex setup

---

### 4. **Saas-Kit-Supabase** by Saas-Starter-Kit
- **Stars**: ⭐ 103
- **Forks**: 28
- **Last Updated**: Dec 23, 2025
- **Link**: https://github.com/Saas-Starter-Kit/Saas-Kit-supabase
- **Stack**: Next.js, TypeScript, Tailwind, Shadcn, Stripe, Supabase
- **Best For**: SaaS apps using Supabase backend

**Features**:
- Admin Dashboard
- Full Auth + Google Social Login
- User Profile Management
- Checkout Pages
- Landing & Pricing Page template
- Playwright testing setup
- Stripe subscription payments
- CRUD operations

**Pros**:
- Supabase native (matches your current stack preference)
- Stripe integration (most popular payment provider)
- Has a Pro version with more features
- Good documentation

**Cons**:
- Less popular than other templates
- Less frequent updates
- Basic compared to Next.js SaaS Starter Kit

---

### 5. **Next.js + Supabase + shadcn/ui Boilerplate** by Barty-Bart *(Your example)*
- **Stars**: ⭐ 48
- **Forks**: N/A
- **Last Updated**: Jan 31, 2026
- **Link**: https://github.com/Barty-Bart/nextjs-supabase-shadcn-boilerplate
- **Stack**: Next.js, Supabase, shadcn/ui
- **Best For**: Simple apps with Supabase backend

**Features**:
- Minimal boilerplate
- Auth + dashboard sidebar
- Supabase integration
- shadcn/ui components

**Pros**:
- Simple and lightweight
- Supabase + shadcn/ui (your preferred stack)
- Recently updated
- Good starting point

**Cons**:
- Limited features compared to full SaaS kits
- No payments, analytics, or advanced features
- Small community (only 48 stars)

---

## 📊 Feature Comparison Table

| Template | Stars | Auth | Payments | Database | UI | Analytics | Best For |
|----------|-------|------|----------|----------|-----|-----------|----------|
| Next.js Boilerplate | 12,595 | ❌ | ❌ | Drizzle | Basic | Sentry | General apps |
| Landing Page Template | 2,100 | ❌ | ❌ | ❌ | Tailwind | ❌ | Marketing pages |
| SaaS Starter Kit | 3,015 | Better Auth | Polar.sh | Neon + Drizzle | shadcn/ui | PostHog | SaaS products |
| Saas-Kit-Supabase | 103 | Supabase Auth | Stripe | Supabase | Shadcn | ❌ | Supabase SaaS |
| Barty-Bart Boilerplate | 48 | Supabase Auth | ❌ | Supabase | shadcn/ui | ❌ | Simple apps |

---

## 🎯 Recommendations by Use Case

### For **Full SaaS Product** (Auth + Payments + Database):
**#1 Choice: Next.js SaaS Starter Kit**
- Complete stack out of the box
- Modern tech (Next.js 15, Tailwind 4)
- AI integration ready
- Polar.sh for subscriptions (easily swap for Stripe if needed)

**#2 Choice: Saas-Kit-Supabase**
- If you prefer Supabase over Neon
- Stripe integration (more popular than Polar.sh)
- Simpler setup than SaaS Starter Kit

### For **Landing Page / One-Pager**:
**Choice: Next.js Landing Page Template**
- Beautiful, proven design
- Quick to customize
- SEO optimized

### For **General Web App** (No SaaS features needed):
**Choice: Next.js Boilerplate**
- Most comprehensive DX tooling
- Proven, popular
- Add auth/payments as needed

### For **Supabase + shadcn/ui Quick Start**:
**Choice: Barty-Bart Boilerplate** (your example)
- Good starting point
- Recently updated
- Matches your preferred stack

---

## 💡 Can We Create a Custom Template?

**Yes! Absolutely.** Here's my recommendation:

### 🏗️ The "Ayssen Stack" Template

Based on your preferences (Supabase, shadcn/ui) and the best features from existing templates:

**Core Stack**:
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS 4
- shadcn/ui components
- Supabase (Auth + Database + Storage)

**Features to Include**:
1. **Authentication**: Supabase Auth (email + Google OAuth)
2. **Payments**: Stripe integration (more popular than Polar.sh)
3. **UI Components**: shadcn/ui (Button, Card, Input, Form, Dialog, etc.)
4. **Dashboard**: Protected route with sidebar layout
5. **User Management**: Profile page, settings
6. **Database**: Supabase with example schemas (users, subscriptions)
7. **Storage**: Supabase Storage for file uploads
8. **Analytics**: PostHog or Plausible integration
9. **SEO**: Next.js metadata API
10. **Testing**: Playwright setup
11. **Deployment**: Vercel-ready with env variables

**Benefits of Custom Template**:
- ✅ Matches your exact stack preferences
- ✅ No unnecessary dependencies
- ✅ Can reuse for every new project
- ✅ Save 20-40 hours per project
- ✅ Consistent code patterns across projects

### Implementation Plan:

**Phase 1: Foundation** (2-3 hours)
1. Initialize Next.js 15 + TypeScript + Tailwind 4
2. Set up shadcn/ui
3. Configure Supabase client
4. Create basic layout components

**Phase 2: Core Features** (4-6 hours)
1. Auth flows (login, register, OAuth)
2. Protected routes middleware
3. Dashboard layout
4. User profile management

**Phase 3: Business Logic** (4-6 hours)
1. Stripe checkout pages
2. Subscription management
3. Webhook handlers
4. Billing portal

**Phase 4: Polish** (2-3 hours)
1. Analytics integration
2. Error boundaries
3. Loading states
4. Documentation

**Total Time**: ~12-18 hours

**Return on Investment**: If you build 5+ projects/year, you save ~100-200 hours/year

---

## 🚀 Next Steps

### Option A: Use Existing Template
- Clone **Next.js SaaS Starter Kit** (most complete)
- Swap Polar.sh for Stripe (4-6 hours work)
- Start building your product

### Option B: Create Custom Template
- I can help you build the "Ayssen Stack" template
- We document it and reuse it for all future projects
- Estimated time: 12-18 hours to build once

### Option C: Hybrid Approach
- Start with **Barty-Bart's boilerplate** (quick start)
- Gradually add missing features as you need them
- Evolve into your custom template over time

---

## 📚 Additional Resources

### Related Templates Found:
- **tailwind-nextjs-starter-blog** (10,362 stars) - Blog templates
- **nextjs-starter-medusa** (2,610 stars) - E-commerce
- **typescript-nextjs-starter** (1,441 stars) - Minimal TypeScript starter
- **react-three-next** (2,813 stars) - 3D web apps

### Tools to Consider:
- **Clerk** - Drop-in auth (alternative to Supabase Auth)
- **Lemon Squeezy** - MoR payments (alternative to Stripe)
- **Prisma** - ORM (alternative to Drizzle/Supabase)
- **Resend** - Transactional emails

---

## ❓ Questions for You

1. **Auth Preference**: Supabase Auth or Better Auth or Clerk?
2. **Payment Provider**: Stripe, Polar.sh, or Lemon Squeezy?
3. **Database**: Supabase (PostgreSQL) or Neon (PostgreSQL)?
4. **Storage**: Supabase Storage or Cloudflare R2?
5. **Analytics**: PostHog, Plausible, or Google Analytics?

Answer these and I can help you choose the right template or build your custom one!

---

*Report compiled by Sikimimi 🎯*
