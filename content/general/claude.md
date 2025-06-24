# Claude Content Management Rules

## Core Imperatives

### 0. Single Source of Truth Protocol

**EXCLUSIVE CONTENT AUTHORITY**: These four documents ARE the complete content system:

- **`content-specification.md`** - Current approved website content (THE ONLY TRUTH)
- **`qa-decisions.md`** - Complete decision history (NEVER modify existing entries)
- **`technical-constraints.md`** - Immutable technical boundaries (CANNOT be changed)
- **THIS FILE** - Content management process (THE LAW)

**FORBIDDEN ACTIONS**:

- Never modify content-specification.md without explicit Q&A approval
- Never change qa-decisions.md existing entries (ONLY append)
- Never implement content changes without going through Q&A process
- Never reference old content.md file (DEPRECATED)

### 1. Priority-First Content Analysis

When Konstantin requests content changes, you MUST:

- **First**: Identify the content area with the HIGHEST PRIORITY (biggest improvement opportunity or gap in understanding)
- **Then**: Present 2-4 strategic options for that priority area
- **Always**: Focus on the most impactful change, not the most obvious one

### 2. Strategic Choice Framework

For every content request:

1. **Analyze for highest-impact opportunity**: What change would most improve conversion, credibility, or competitive positioning?
2. **Present strategic options** with this format:

```
Q[number]: [Question about highest priority content area]

Priority Analysis: [Why this area has highest impact]

Option A: [Choice name]
- Impact: [Business/conversion impact]
- Pros: [Benefits]
- Cons: [Trade-offs]
- Constraint check: [Technical limitations]

Option B: [Alternative choice]
[Same structure]

Recommendation: [Your suggested option with rationale]
```

3. **Wait for Konstantin's decision** - NEVER implement without explicit choice
4. **Record verbatim in qa-decisions.md**
5. **Update content-specification.md** with change markers

### 3. File Governance Rules

#### content-specification.md

- **AUTHORITATIVE SOURCE**: The ONLY document containing current approved website content
- **READ-ONLY EXCEPT**: After explicit Q&A decision with Konstantin's approval
- **Change Protocol**: Add markers `[Updated: YYYY-MM-DD via Q{number}]` when modified
- **FORBIDDEN**: Direct edits, assumptions, or content "fixes" without Q&A process

#### qa-decisions.md

- **APPEND-ONLY**: NEVER modify existing entries (Q1-Q73)
- **VERBATIM PRESERVATION**: Record exact questions, options, decisions, and rationale
- **CONTINUE NUMBERING**: Next Q&A starts at Q74
- **COMPLETE CONTEXT**: Include timestamps, constraint checks, and full reasoning

#### technical-constraints.md

- **IMMUTABLE FOUNDATION**: Technical requirements that content MUST respect
- **REFERENCE FIRST**: Check constraints before proposing any content changes
- **MODIFICATION FORBIDDEN**: Only Konstantin can alter technical requirements
- **INCLUDES**: POM selectors, character limits, template constraints, mobile requirements

### 4. Content Priority Matrix

When identifying highest priority areas, rank by:

1. **Conversion Impact**: Changes that directly affect demo bookings
2. **Competitive Differentiation**: Content that separates Ralph from competitors
3. **Credibility Gaps**: Areas where lack of proof/trust hurts positioning
4. **User Journey Blockers**: Content confusion that stops prospect progression
5. **Message Consistency**: Disconnects between positioning and reality

### 5. Constraint Hierarchy (Absolute Order)

1. POM testing requirements (cannot break)
2. Template character limits (cannot exceed)
3. Konstantin's explicit preferences (from Q&As)
4. Business objectives (from beneficious-ralph-doc.md)
5. Best practices (suggestions only)

## Operational Notes

### Question Numbering

- Continue from last Q number in qa-decisions.md
- Format: Q[number] for main questions
- Sub-questions: Q[number]a, Q[number]b
- Never reuse numbers

### Before Every Content Change

- [ ] Check technical-constraints.md for limits
- [ ] Review qa-decisions.md for precedent
- [ ] Identify HIGHEST PRIORITY improvement area
- [ ] Present options, don't prescribe solutions

### Implementation Protocol

Only after Q&A decision:

1. Provide exact file paths to modify
2. Show specific content to replace
3. Flag any POM selector impacts
4. Note mobile layout considerations
5. Identify rollback plan

### Content Analysis Focus Areas

When identifying priorities, especially examine:

- **Hero section**: First impression and conversion driver
- **Value proposition**: Clarity of Ralph's unique advantage
- **Social proof**: Trust and credibility elements
- **Competitive positioning**: Differentiation from alternatives
- **Conversion paths**: Multiple ways to engage prospects
- **FAQ gaps**: Missing objection handling
- **Learn content**: Thought leadership positioning

### Emergency Changes

If urgent updates needed without full Q&A:

1. Implement minimum viable change only
2. Document as "Emergency Change - [date]"
3. Schedule immediate follow-up Q&A
4. Add full context to qa-decisions.md

### Monthly Proactive Reviews

Suggest quarterly analysis of:

- Content performance vs. goals
- New optimization opportunities
- Outdated information needing refresh
- Q&A decisions that may need revisiting
- Gaps identified through user feedback

## Critical Success Factors

1. **Always identify the highest-impact content area first**
2. **Present strategic choices, never make unilateral decisions**
3. **Preserve complete Q&A history for context**
4. **Respect all technical constraints absolutely**
5. **Focus on conversion and competitive differentiation**
