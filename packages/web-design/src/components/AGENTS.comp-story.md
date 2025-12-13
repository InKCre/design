# `compName.story.vue` coding rulebook

## Core Principle

- A Story is a visual and behavioral contract, not a parameter matrix.
- Stories exist to ensure that important states and behaviors never regress.

### What a Story IS

A Story represents one of the following:

1. A canonical semantic state
2. A state transition boundary
3. An edge case likely to regress
4. A design-forbidden or invalid state

If a Story does not meet at least one of these criteria, it should not exist.

### What a Story IS NOT

Stories must NOT be used for:

- Exhaustive prop combinations
- Demonstrating all possible values
- Acting as a playground or sandbox
- Replacing documentation text

## Best Practices

### Story Categories (Normative)

Every Story MUST belong to one of the following categories.

Use the category prefix in the Story title.

#### 1. `[Semantic]` — Canonical States (REQUIRED)

> Stable, long-term design commitments.

Purpose:

- Define the meaning of variants
- Establish the visual language of the component

Examples:

- Primary / Secondary / Danger
- Default vs Emphasized

```vue
<Story title="[Semantic] Variants">
  <Variant title="Primary">
    <CompName variant="primary" />
  </Variant>
</Story>
```

---

#### 2. `[State]` — State Transitions (STRONGLY RECOMMENDED)

> Critical boundaries between internal states.

Purpose:

- Prevent behavioral regressions
- Make async or reactive changes explicit

Examples:

- Idle → Loading
- Enabled → Disabled

```vue
<Story title="[State] Loading transition">
  <Variant title="Idle">
    <CompName />
  </Variant>

  <Variant title="Loading">
    <CompName loading />
  </Variant>
</Story>
```

#### 3. `[Edge]` — Edge Cases (STRONGLY RECOMMENDED)

> Scenarios most likely to break layout or behavior.

Purpose:

- Catch CSS regressions
- Protect against refactors

Examples:

- Extremely long text
- Icon-only usage
- Empty or minimal content

```vue
<Story title="[Edge] Layout stress">
  <Variant title="Very long text">
    <CompName>
      Extremely long content that should not break layout
    </CompName>
  </Variant>
</Story>
```

---

#### 4. `[Invalid]` — Forbidden or Unsupported States (OPTIONAL)

> States that must not be relied upon.

Purpose:

- Document non-goals
- Prevent accidental support of invalid combinations

Rules:

- These Stories are for maintainers, not users
- No effort should be made to “fix” these states

```vue
<Story title="[Invalid] Forbidden combinations">
  <Variant title="Disabled + Loading">
    <CompName disabled loading />
  </Variant>
</Story>
```

### Variant Rules

#### Variant Inclusion Rule

Before adding a Variant, ask:

> Does this Variant represent a design decision or a regression risk?

If not, do not add it.

#### Variant Naming Rules

Variant titles MUST be:

- Descriptive
- Semantic
- Stable over time

❌ Bad:

- `Example 1`
- `Test`
- `Demo`

✅ Good:

- `Primary`
- `Loading`
- `Very long text`

### Props Usage Rules

- Props may be used **only** to express meaningful states
- Props MUST NOT be combined arbitrarily
- If a prop combination has no semantic meaning, it must not appear in Stories

Props exploration belongs to:

- Controls
- Playground tools
- Developer sandboxes

## Relationship to Docs

- `*.docs.mdx` explains why and how to use the component
- `*.story.vue` ensures important states do not regress

Stories must be readable without explanatory text.

If a Story needs explanation, it likely belongs in Docs instead.

## Relationship to Testing

Stories should be written as if they are:

- Visual snapshots
- Golden masters
- Future visual regression targets

Assume that:

> Any Story you write today will be relied upon by future maintainers.

## Minimal Story Checklist

Before committing a `*.story.vue`, ensure:

- [ ] At least one `[Semantic]` Story exists
- [ ] At least one `[State]` or `[Edge]` Story exists
- [ ] No exhaustive prop combinations are present
- [ ] All Story titles communicate intent
- [ ] All Variants represent meaningful states
