# `compName.story.vue` coding rulebook

## Core Principle

- A Story is a visual and behavioral contract, not a parameter matrix.
- Story exist to ensure that important states and behaviors never regress.

A Story represents one of the following:

1. A canonical semantic state
2. A state transition boundary
3. An edge case likely to regress
4. A design-forbidden or invalid state

Stories must NOT be used for:

- Exhaustive prop combinations
- Demonstrating all possible values
- Acting as a playground or sandbox
- Replacing documentation text

## Best Practices

Categorize variants into:

- Cannonical: Stable, long-term design commitments (required).
- State: Critical boundaries between internal states (recommended).
- Edge: Scenarios most likely to break layout or behavior (recommended).
- Invalid: States that must not be relied upon (optional).

Titles must be descriptive, semantic, stable over time.

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
