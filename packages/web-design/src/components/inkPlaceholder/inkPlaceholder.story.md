# inkPlaceholder

A component to represent empty states, error states, and suggest actions. It consists of an illustration, title, and description, all of which can be overridden via slots.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `"empty" \| "error"` | `"empty"` | The state of the placeholder |
| `illustration` | `string` | `""` | The illustration to display (icon class name) |
| `title` | `string` | `""` | The title text |
| `description` | `string` | `""` | The description text |

## Slots

| Slot | Description |
|------|-------------|
| `illustration` | Custom content for the illustration |
| `title` | Custom content for the title |
| `description` | Custom content for the description |
| `actions` | Action buttons or links |

## Default Behavior

When props are not provided, the component displays state-specific defaults:

### Empty State
- **Illustration**: Inbox icon (`i-mdi-inbox-outline`)
- **Title**: "No data"
- **Description**: "There's nothing here yet."

### Error State
- **Illustration**: Alert icon (`i-mdi-alert-circle-outline`) in danger color
- **Title**: "Something went wrong"
- **Description**: "An error occurred. Please try again."

## Usage Examples

### Basic Empty State
```vue
<InkPlaceholder state="empty" />
```

### Custom Empty State with Actions
```vue
<InkPlaceholder
  state="empty"
  title="No projects"
  description="Start by creating your first project."
>
  <template #actions>
    <InkButton text="Create Project" type="primary" />
  </template>
</InkPlaceholder>
```

### Error State with Retry
```vue
<InkPlaceholder
  state="error"
  title="Connection failed"
  description="Unable to connect to the server."
>
  <template #actions>
    <InkButton text="Retry" type="primary" />
  </template>
</InkPlaceholder>
```

### Fully Custom with Slots
```vue
<InkPlaceholder state="empty">
  <template #illustration>
    <span class="i-mdi-rocket-launch" />
  </template>
  <template #title>
    <h2>Welcome aboard!</h2>
  </template>
  <template #description>
    <p>Let's get started.</p>
  </template>
  <template #actions>
    <InkButton text="Get Started" type="primary" />
  </template>
</InkPlaceholder>
```
