import { Story, Variant } from '@histoire/plugin-vue'
import InkButton from './inkButton.vue'

# inkButton

> 提供一致的按钮交互和视觉反馈，统一操作入口的语义表达。
> Provides consistent button interaction and visual feedback with unified semantic expression for actions.

---

## Usage Intent

### Why this exists
- 避免直接使用 `<button>` 标签导致的样式不一致
- 通过语义化的 `type` 属性明确操作的重要性和风险等级
- 减少重复的样式和交互逻辑

### When to use
- 任何需要用户触发操作的场景
- 表单提交、确认、取消等标准操作
- 需要明确区分主要和次要操作时

### When NOT to use
- 纯导航跳转（应使用链接或路由组件）
- 需要复杂内部结构的按钮（考虑使用插槽或自定义组件）

---

## Design Semantics

### Concepts
- `subtle`: 低优先级操作，视觉上不抢眼 / Low priority action, visually subtle
- `primary`: 主要操作，视觉突出 / Primary action, visually prominent
- `danger`: 危险或不可逆操作，需要用户谨慎 / Destructive or irreversible action, requires caution

### Visual / UX Meaning
- **Subtle**: 适用于取消、返回等次要操作，用户可忽略
- **Primary**: 适用于提交、确认等主要流程，引导用户注意
- **Danger**: 适用于删除、清空等危险操作，警示用户风险

---

## Canonical Examples

> 以下示例是**规范用法**，不是完整参数排列组合。

<Story title="Controls/Button/[Semantic] Variants">
  <Variant title="Subtle">
    <InkButton text="Cancel" type="subtle" />
  </Variant>

  <Variant title="Primary">
    <InkButton text="Submit" type="primary" />
  </Variant>

  <Variant title="Danger">
    <InkButton text="Delete" type="danger" />
  </Variant>
</Story>

<Story title="Controls/Button/[Semantic] Sizes">
  <Variant title="Medium (Default)">
    <InkButton text="Medium Button" type="primary" size="md" />
  </Variant>

  <Variant title="Small">
    <InkButton text="Small Button" type="primary" size="sm" />
  </Variant>
</Story>

---

## Behavioral Contract

> 这些是**使用者可以依赖的行为保证**。

- 点击按钮时：
  - ✅ 触发 `click` 事件
  - ✅ 事件可被阻止传播
- 按钮不会：
  - ❌ 自动提交表单（除非在 `<form>` 内且 `type="submit"`）
  - ❌ 阻止默认行为（由使用者控制）

---

## Public API

### Props
- `text`: 按钮显示文本 / Button display text
- `type`: 按钮语义类型 (`subtle` | `primary` | `danger`) / Button semantic type
- `size`: 按钮尺寸 (`sm` | `md`) / Button size

> 完整类型、默认值与可控项请参考下方自动生成的 API 表格。

### Events
- `click()`: 用户点击按钮时触发 / Emitted when button is clicked

---

## Slots

### default
按钮的内容区域。如果提供插槽内容，将覆盖 `text` 属性。
Button content area. Overrides `text` prop if provided.

---

## Extension & Composition

- 可以在任何需要操作触发的地方使用
- 支持通过插槽自定义内部结构（图标、徽章等）
- 建议在同一视图中不超过一个 `primary` 按钮

---

## Non-Goals

> 以下内容**不属于该组件的职责范围**。

- 不处理加载状态（应由父组件控制）
- 不负责权限检查（应在外部处理）
- 不承担路由导航（使用 `router-link` 或导航组件）

---

## Implementation Notes

> ⚠️ 面向维护者，而非组件使用者。

- 使用 CSS 类名组合实现变体和尺寸
- 所有交互样式通过 SCSS 伪类实现
- 依赖设计系统的 token（颜色、间距、字体）
