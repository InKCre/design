# build-agent-skills.ts

Generates Agent Skills for the `@inkcre/web-design` package following the [agentskills.io](https://agentskills.io) specification.

## Overview

This script creates properly formatted Agent Skills that can be loaded by AI agents like Claude Code, GitHub Copilot, and others. Skills are organized folders containing `SKILL.md` files with YAML frontmatter and markdown content.

## What are Agent Skills?

Agent Skills are a standardized format for packaging domain-specific expertise that AI agents can discover and load dynamically. Each skill contains:

- **YAML frontmatter**: Metadata including `name` and `description`
- **Markdown content**: Instructions, examples, and reference material
- **Optional directories**: Scripts, references, and assets

Learn more at [agentskills.io](https://agentskills.io/specification).

## Generated Skills

The script creates 5 skills in `.github/skills/`:

### 1. web-design-components
Main skill for using the component library. Includes all 19 components with:
- Props and events definitions
- Usage examples from story files
- TypeScript types
- Import instructions

### 2. web-design-router
Router integration patterns. Covers:
- InkRouter interface
- Creating router adapters for Vue Router
- Provider pattern setup
- Usage in components

### 3. web-design-i18n
Internationalization setup. Includes:
- InkI18n interface
- vue-i18n integration
- Locale configuration
- Provider pattern setup

### 4. web-design-styling
Styling system usage. Documents:
- Design token layers (ref/sys/comp)
- SCSS utilities and mixins
- Token categories and usage
- Theme support (light/dark)
- UnoCSS configuration

### 5. web-design-best-practices
Development guidelines. Covers:
- Component development principles
- Naming conventions
- Error handling
- Accessibility practices
- Performance tips
- "Code for Human Brains" philosophy

## Usage

From the repository root:

```bash
pnpm build-skills
```

From the web-design package:

```bash
cd packages/web-design
pnpm build:skills
```

## Output Structure

```
packages/web-design/.github/skills/
├── web-design-components/
│   └── SKILL.md
├── web-design-router/
│   └── SKILL.md
├── web-design-i18n/
│   └── SKILL.md
├── web-design-styling/
│   └── SKILL.md
└── web-design-best-practices/
    └── SKILL.md
```

Each `SKILL.md` follows the agentskills.io specification:

```markdown
---
name: skill-name
description: What this skill does and when to use it
---

# Skill Content

Instructions and examples...
```

## Integration

Skills are:
- Generated during the build process
- Shipped with the npm package (via `.github/skills/` in `files` array)
- Automatically discovered by compatible AI agents
- Loaded on-demand when relevant to user's task

## Agent Compatibility

These skills work with:
- Claude Code (Anthropic)
- GitHub Copilot (VS Code, CLI)
- OpenAI Codex
- Cursor
- Any agent supporting the agentskills.io standard

## How Agents Use Skills

1. **Discovery**: Agent scans `.github/skills/` directory
2. **Metadata Loading**: Reads YAML frontmatter (name, description)
3. **Tool Registration**: Exposes skills as callable functions
4. **Activation**: User's query triggers relevant skill
5. **Content Loading**: Full markdown content loaded into context
6. **Execution**: Agent follows skill instructions

## Maintenance

The script automatically:
- Extracts component info from TypeScript files
- Cleans Histoire-specific syntax from documentation
- Generates valid YAML frontmatter
- Creates compliant directory structure
- Validates skill names (lowercase, hyphens only)

## Future Enhancements

Potential additions:
- `scripts/` directories with automation tools
- `references/` with example code files
- `assets/` with diagrams or images
- Additional skills for specific workflows (testing, deployment, etc.)
