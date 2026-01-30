# AgentFlow Security Hardening Plan

**Document Owner:** Hamish Nicklin
**Last Updated:** 2026-01-30
**Status:** Draft - Implementation Pending

---

## Executive Summary

This document outlines the security improvements required to make AgentFlow's Discovery and Copilot Check-up tools enterprise-ready. The plan is based on a comprehensive security audit and prioritises fixes by urgency and cost.

**Current State:** Good security fundamentals with critical gaps in credential management, audit logging, and data retention policies.

**Target State:** Enterprise-ready platform with signed DPAs, comprehensive audit trails, and documented security posture suitable for mid-market and enterprise clients.

---

## Tools in Scope

| Tool | Repo | APIs Used |
|------|------|-----------|
| **Copilot Check-up** | agentflow-insight-pulse | Supabase, Anthropic |
| **Discovery (Opportunity Finder)** | AF_DiscoveryProcess_Agent | Supabase, Anthropic, Deepgram |

---

## Phase 1: Critical Fixes (Week 1)

### 1.1 Rotate Compromised API Keys

**Priority:** CRITICAL
**Cost:** Free
**Time:** 1 hour

The `.env` file was committed to git with live API keys exposed.

**Actions:**
- [ ] Rotate Supabase anon key (Supabase Dashboard > Settings > API)
- [ ] Rotate Supabase service role key
- [ ] Rotate Anthropic API key (console.anthropic.com)
- [ ] Rotate Deepgram API key (console.deepgram.com)
- [ ] Generate new VITE_ADMIN_API_KEY (random 64-char hex)
- [ ] Update all keys in Supabase Edge Function secrets
- [ ] Update local .env files (do NOT commit)

### 1.2 Remove .env from Git History

**Priority:** CRITICAL
**Cost:** Free
**Time:** 30 mins

**Actions:**
- [ ] Add `.env` to `.gitignore` in both repos
- [ ] Use BFG Repo-Cleaner to remove .env from git history:
  ```bash
  # Install BFG
  brew install bfg

  # Clone a fresh copy
  git clone --mirror git@github.com:goagentflow/AF_DiscoveryProcess_Agent.git

  # Remove .env from all history
  bfg --delete-files .env AF_DiscoveryProcess_Agent.git

  # Clean up
  cd AF_DiscoveryProcess_Agent.git
  git reflog expire --expire=now --all && git gc --prune=now --aggressive

  # Force push (coordinate with team)
  git push --force
  ```
- [ ] Repeat for agentflow-insight-pulse repo if applicable

### 1.3 Move Admin Whitelist to Environment Variable

**Priority:** CRITICAL
**Cost:** Free
**Time:** 1 hour

**Current (insecure):**
```typescript
const ADMIN_WHITELIST = [
  'hamish@goagentflow.com',
  'stephen@goagentflow.com',
];
```

**Target:**
```typescript
const ADMIN_WHITELIST = (Deno.env.get('ADMIN_WHITELIST') || '').split(',');
```

**Actions:**
- [ ] Update `/supabase/functions/admin-api/index.ts`
- [ ] Add `ADMIN_WHITELIST` to Supabase Edge Function secrets
- [ ] Update agentflow-insight-pulse useAuth.ts admin check similarly
- [ ] Deploy and test

### 1.4 Add Audit Logging for Admin Actions

**Priority:** CRITICAL
**Cost:** Free
**Time:** 4 hours

**Actions:**
- [ ] Create `admin_audit_log` table in Supabase:
  ```sql
  CREATE TABLE admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_email TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    metadata JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX idx_admin_audit_actor ON admin_audit_log(actor_email);
  CREATE INDEX idx_admin_audit_created ON admin_audit_log(created_at);
  ```
- [ ] Add logging helper function to admin-api
- [ ] Log: project views, interview access, CSV exports, analysis triggers
- [ ] Test logging works for all admin endpoints

---

## Phase 2: High Priority (Weeks 2-4)

### 2.1 Sign Data Processing Agreements (DPAs)

**Priority:** HIGH
**Cost:** Free (standard DPAs) / £500-2000 (legal review)
**Time:** 2-4 hours + legal review time

| Vendor | DPA Location | Status |
|--------|--------------|--------|
| **Supabase** | Dashboard > Org Settings > Legal | [ ] Signed |
| **Anthropic** | console.anthropic.com > Settings > Legal | [ ] Signed |
| **Deepgram** | Request via support@deepgram.com | [ ] Requested |

**Actions:**
- [ ] Sign Supabase DPA (requires Pro plan - $25/mo)
- [ ] Sign Anthropic DPA
- [ ] Request and sign Deepgram DPA
- [ ] Store signed copies in company records
- [ ] Optional: Have solicitor review DPAs (£500-2000)

### 2.2 Reduce Data Retention Periods

**Priority:** HIGH
**Cost:** Free
**Time:** 2 hours

**Current:**
- Interview transcripts: 90 days
- Results tokens: 30 days
- Analysis output: 90 days

**Target:**
- Interview transcripts: 30 days
- Results tokens: 7 days
- Analysis output: 30 days

**Actions:**
- [ ] Update migration `20260120100300_add_data_retention.sql`:
  ```sql
  -- Change default retention from 90 to 30 days
  ALTER TABLE discovery_interview
  ALTER COLUMN expires_at SET DEFAULT (now() + interval '30 days');
  ```
- [ ] Update `run-analysis/index.ts` token TTL:
  ```typescript
  const intervieweeTokenTtlDays = isLeadGenAssessment ? 7 : 7; // Was 30
  ```
- [ ] Run migration on production
- [ ] Verify cleanup function runs daily

### 2.3 Add Third-Party Data Sharing Consent

**Priority:** HIGH
**Cost:** Free
**Time:** 4 hours

Users need to know their interview data is processed by Anthropic and Deepgram.

**Actions:**
- [ ] Add consent checkbox before interview starts:
  > "Your responses will be processed by AI services (Anthropic, Deepgram) to generate insights. These services have signed data processing agreements with AgentFlow. [Learn more](/privacy)"
- [ ] Store consent timestamp in `discovery_interviewee.third_party_consent_at`
- [ ] Block interview start if consent not given
- [ ] Update Privacy Policy with sub-processor list

### 2.4 Implement Token Revocation

**Priority:** HIGH
**Cost:** Free
**Time:** 3 hours

**Actions:**
- [ ] Add `revoked_at` column to interview tokens
- [ ] Add admin UI to revoke compromised tokens
- [ ] Update token validation to check revocation status
- [ ] Log all revocation events

---

## Phase 3: Medium Priority (Months 1-3)

### 3.1 Strengthen Row Level Security (RLS)

**Priority:** MEDIUM
**Cost:** Free
**Time:** 8 hours

**Current Issue:**
```sql
-- Too permissive
CREATE POLICY "Allow anon to read orgs" ON org
  FOR SELECT TO anon USING (true);
```

**Actions:**
- [ ] Audit all RLS policies across both apps
- [ ] Remove blanket allow policies
- [ ] Implement user-org relationship enforcement
- [ ] Add RLS tests to CI pipeline

### 3.2 Implement PII Masking Before AI Transmission

**Priority:** MEDIUM
**Cost:** Free
**Time:** 6 hours

Before sending transcripts to Claude for analysis, mask obvious PII.

**Actions:**
- [ ] Create PII detection regex patterns (emails, phone numbers, names)
- [ ] Add masking function to run-analysis:
  ```typescript
  function maskPII(text: string): string {
    return text
      .replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL]')
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]')
      // ... more patterns
  }
  ```
- [ ] Apply before Claude API call
- [ ] Store both masked and original (original for admin, masked for AI)

### 3.3 Hash Results Tokens in Database

**Priority:** MEDIUM
**Cost:** Free
**Time:** 4 hours

Currently tokens stored in plaintext. If database breached, all tokens exposed.

**Actions:**
- [ ] Hash tokens before storage using SHA-256
- [ ] Update validation to hash incoming token before comparison
- [ ] Migrate existing tokens (generate new, invalidate old)

### 3.4 Implement Right-to-Deletion Workflow

**Priority:** MEDIUM
**Cost:** Free
**Time:** 6 hours

GDPR Article 17 requires data deletion on request.

**Actions:**
- [ ] Add "Request Data Deletion" link to results page
- [ ] Create deletion request table
- [ ] Build admin workflow to process requests
- [ ] Implement hard delete (not just anonymisation) of:
  - Interview transcripts
  - Analysis output
  - Interviewee PII
- [ ] Send confirmation email when complete

### 3.5 Clean Up Console Logging

**Priority:** MEDIUM
**Cost:** Free
**Time:** 2 hours

**Actions:**
- [ ] Audit all console.log statements in edge functions
- [ ] Remove PII from log messages (emails, names)
- [ ] Ensure sensitive logs use [SECURITY] prefix only
- [ ] Set up log retention policy in Supabase (90 days max)

---

## Phase 4: Long-Term / Enterprise (3-6 Months)

### 4.1 Penetration Testing

**Priority:** LOW (unless client requires)
**Cost:** £2,000-5,000
**Time:** 1-2 weeks

**Actions:**
- [ ] Engage pen testing firm (CREST certified)
- [ ] Scope: Both apps, Supabase config, edge functions
- [ ] Remediate findings
- [ ] Obtain certificate for client assurance

### 4.2 SOC 2 Type II Certification

**Priority:** LOW (only if losing enterprise deals)
**Cost:** £30,000-60,000
**Time:** 6-12 months

**Prerequisites:**
- All Phase 1-3 items complete
- Documented security policies
- Employee security training
- Incident response plan

**Actions:**
- [ ] Engage SOC 2 readiness consultant
- [ ] Implement required controls
- [ ] Undergo audit
- [ ] Maintain certification annually

### 4.3 EU Data Residency Option

**Priority:** LOW (unless EU enterprise clients)
**Cost:** ~$50/month additional
**Time:** 1 week

**Actions:**
- [ ] Create EU Supabase project (Frankfurt region)
- [ ] Migrate EU client data
- [ ] Update DNS/routing for EU clients
- [ ] Document data residency in security docs

---

## Documentation Deliverables

### To Create (Free, I Can Draft)

| Document | Purpose | Status |
|----------|---------|--------|
| **Data Flow Diagram** | Visual of what data goes where | [ ] Draft |
| **Sub-Processor List** | Table of all third parties with DPA status | [ ] Draft |
| **Data Retention Policy** | What's stored, how long, deletion process | [ ] Draft |
| **Security Overview** | One-pager for client security questionnaires | [ ] Draft |
| **Privacy Policy Update** | Add third-party processing disclosure | [ ] Draft |
| **Incident Response Plan** | What to do if breach occurs | [ ] Draft |

---

## Cost Summary

| Phase | Items | Cost | Timeline |
|-------|-------|------|----------|
| **Phase 1** | Key rotation, git cleanup, audit logging | Free | Week 1 |
| **Phase 2** | DPAs, retention, consent, revocation | Free - £2,000 | Weeks 2-4 |
| **Phase 3** | RLS, PII masking, token hashing, deletion | Free | Months 1-3 |
| **Phase 4** | Pen test, SOC 2, EU residency | £2,000 - £60,000 | Months 3-6+ |

**Minimum viable enterprise-ready:** Phases 1-2 = ~£2,000 (mostly legal review)

**Full enterprise certification:** All phases = ~£40,000-70,000

---

## Progress Tracker

### Phase 1 Checklist
- [ ] 1.1 Rotate all API keys
- [ ] 1.2 Remove .env from git history
- [ ] 1.3 Move admin whitelist to env var
- [ ] 1.4 Add admin audit logging

### Phase 2 Checklist
- [ ] 2.1 Sign all DPAs
- [ ] 2.2 Reduce retention to 30/7 days
- [ ] 2.3 Add third-party consent UI
- [ ] 2.4 Implement token revocation

### Phase 3 Checklist
- [ ] 3.1 Strengthen RLS policies
- [ ] 3.2 Implement PII masking
- [ ] 3.3 Hash tokens in database
- [ ] 3.4 Right-to-deletion workflow
- [ ] 3.5 Clean up logging

### Phase 4 Checklist
- [ ] 4.1 Penetration test
- [ ] 4.2 SOC 2 certification
- [ ] 4.3 EU data residency

---

## Appendix: Vendor Security Links

| Vendor | Security Page | DPA | Certifications |
|--------|---------------|-----|----------------|
| **Supabase** | [supabase.com/security](https://supabase.com/security) | Dashboard | SOC 2 Type II, GDPR |
| **Anthropic** | [anthropic.com/security](https://www.anthropic.com/security) | Console | SOC 2 Type II |
| **Deepgram** | [deepgram.com/security](https://deepgram.com/security) | Request | SOC 2 Type II, GDPR |

---

*This document should be reviewed quarterly and updated as security posture improves.*
