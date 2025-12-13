import { Story, Variant } from '@histoire/plugin-vue'
import InkSwitch from './inkSwitch.vue'

# inkSwitch

> 提供开关切换交互，用于二态设置的快速切换。
> Provides toggle interaction for quick switching between binary states.

---

## Usage Intent

### Why this exists
- 提供明确的开/关状态视觉反馈
- 支持异步状态变更（loading）
- 统一开关组件的交互体验

### When to use
- 设置页的功能开关
- 快速切换二态选项
- 需要立即生效的状态切换

### When NOT to use
- 需要确认的重要操作（使用 InkDoubleCheck）
- 多选场景（使用复选框组）

---

## Design Semantics

### Concepts
- `modelValue`: 当前状态 (`on` | `off`) / Current state
- `size`: 尺寸大小，适应不同 UI 密度 / Size for different UI densities
- `label`: 状态标签，显示在开关内部 / State label shown inside switch

### Visual / UX Meaning
- **On State**: 开关滑块在右侧，背景高亮
- **Off State**: 开关滑块在左侧，背景暗淡
- **Loading State**: 开关不可交互，显示加载动画

---

## Canonical Examples

> 以下示例是**规范用法**，不是完整参数排列组合。

<Story title="Controls/Switch/[Semantic] Sizes">
  <Variant title="Small">
    <InkSwitch
      modelValue="off"
      size="sm"
      label="Enable"
    />
  </Variant>

  <Variant title="Medium">
    <InkSwitch
      modelValue="off"
      size="md"
      label="Feature"
    />
  </Variant>

  <Variant title="Large">
    <InkSwitch
      modelValue="off"
      size="lg"
      label="Setting"
    />
  </Variant>
</Story>

<Story title="Controls/Switch/[State] Toggle States">
  <Variant title="Off">
    <InkSwitch
      modelValue="off"
      size="md"
      label="Disabled"
    />
  </Variant>

  <Variant title="On">
    <InkSwitch
      modelValue="on"
      size="md"
      label="Enabled"
    />
  </Variant>
</Story>

---

## Behavioral Contract

> 这些是**使用者可以依赖的行为保证**。

- 点击开关时：
  - ✅ 立即更新 v-model 值
  - ✅ 触发 `update:modelValue` 事件
  - ✅ 视觉状态立即反馈
- 在 `loading` 状态下：
  - ❌ 不响应点击
  - ❌ 显示加载指示器

---

## Public API

### Props
- `modelValue`: 开关状态 (`on` | `off`) / Switch state
- `size`: 尺寸 (`xs` | `sm` | `md` | `lg`) / Size
- `label`: 内部标签文本 / Internal label text
- `loading`: 加载状态 / Loading state

> 完整类型、默认值与可控项请参考下方自动生成的 API 表格。

### Events
- `update:modelValue(value: 'on' | 'off')`: 状态切换时触发 / Emitted when state toggles

---

## Extension & Composition

- 适合用在设置列表中
- 可配合异步操作显示 loading 状态
- 支持 v-model 双向绑定

---

## Non-Goals

> 以下内容**不属于该组件的职责范围**。

- 不处理权限验证（应在外部控制）
- 不提供撤销功能（由业务层处理）
- 不支持三态或多态（使用其他控件）

---

## Implementation Notes

> ⚠️ 面向维护者，而非组件使用者。

- 使用 `@vueuse/core` 的 `useAsyncState` 处理异步状态
- CSS 动画通过 transform 实现滑块移动
- 依赖组件级别的 token（comp-var）定义颜色
