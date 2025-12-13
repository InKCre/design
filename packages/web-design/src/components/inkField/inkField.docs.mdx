import { Story, Variant } from '@histoire/plugin-vue'
import InkField from './inkField.vue'

# inkField

> 标准化键值对的显示和编辑，提供一致的标签-值布局。
> Standardizes key-value pair display and editing with consistent label-value layouts.

---

## Usage Intent

### Why this exists
- 避免在表单中重复编写标签和值的布局代码
- 提供统一的必填标记和交互反馈
- 支持多种布局模式适应不同的 UI 密度需求

### When to use
- 表单中的字段显示和编辑
- 详情页的信息展示
- 需要明确标签和值关系的场景

### When NOT to use
- 不需要标签的纯输入场景（直接使用 `InkInput` 等）
- 复杂的多列表单布局（使用表单布局组件）

---

## Design Semantics

### Concepts
- `layout`: 布局模式，决定标签和值的空间关系 / Layout mode determining spatial relationship
  - `col`: 垂直堆叠，适合紧凑表单 / Vertical stacking, suitable for compact forms
  - `inline`: 行内排列，适合信息展示 / Inline arrangement, suitable for info display
  - `row`: 水平排列，适合宽松布局 / Horizontal layout, suitable for spacious layouts
- `required`: 必填标记，强调用户必须提供值 / Required indicator emphasizing mandatory input

### Visual / UX Meaning
- **Column Layout**: 标签在上，值在下，节省横向空间
- **Inline Layout**: 标签和值在同一行，紧凑展示
- **Row Layout**: 标签和值横向排列，强调关联性

---

## Canonical Examples

> 以下示例是**规范用法**，不是完整参数排列组合。

<Story title="Forms/Field/[Semantic] Layouts">
  <Variant title="Column">
    <InkField
      label="Username"
      value="john.doe"
      layout="col"
    />
  </Variant>

  <Variant title="Inline">
    <InkField
      label="Email"
      value="john@example.com"
      layout="inline"
    />
  </Variant>

  <Variant title="Row">
    <InkField
      label="Status"
      value="Active"
      layout="row"
    />
  </Variant>
</Story>

<Story title="Forms/Field/[State] Required">
  <Variant title="Optional">
    <InkField
      label="Nickname"
      value="Johnny"
      layout="col"
      :required="false"
    />
  </Variant>

  <Variant title="Required">
    <InkField
      label="Password"
      value="••••••••"
      layout="col"
      :required="true"
    />
  </Variant>
</Story>

---

## Behavioral Contract

> 这些是**使用者可以依赖的行为保证**。

- 当 `editable` 为 `true` 且 `layout` 为 `inline` 时：
  - ✅ 值文本显示下划线提示可编辑
  - ✅ 点击值触发 `value-click` 事件
- 当 `required` 为 `true` 时：
  - ✅ 标签右上角显示红色 `*`
- 插槽内容：
  - ✅ 插槽内容优先于 `value` 属性显示

---

## Public API

### Props
- `label`: 字段标签文本 / Field label text
- `layout`: 布局模式 (`inline` | `col` | `row`) / Layout mode
- `value`: 字段值（仅在无插槽时显示）/ Field value (shown when no slot provided)
- `editable`: 是否可编辑 / Whether the field is editable
- `required`: 是否必填 / Whether the field is required

> 完整类型、默认值与可控项请参考下方自动生成的 API 表格。

### Events
- `value-click()`: 当值被点击时触发（仅在 `editable=true` 时）/ Emitted when value is clicked (only when editable)

---

## Slots

### default
值区域，可放置输入、选择器等组件。如未提供，显示 `value` 属性。
Value area for input controls. Shows `value` prop if not provided.

### label-right
标签右侧的扩展区域，可放置帮助图标、操作按钮等。
Extension area to the right of label for help icons, action buttons, etc.

---

## Extension & Composition

- 通常与 `InkInput`、`InkPicker`、`InkDropdown` 等表单控件组合使用
- 可嵌套在 `InkForm` 中实现统一的表单布局
- 支持自定义插槽内容以适应复杂场景

---

## Non-Goals

> 以下内容**不属于该组件的职责范围**。

- 不处理表单验证逻辑（应由表单或业务层处理）
- 不管理字段值的状态（使用 v-model 或外部状态管理）
- 不提供表单提交功能

---

## Implementation Notes

> ⚠️ 面向维护者，而非组件使用者。

- 使用 flexbox 实现不同布局模式
- 依赖 CSS 类名切换布局
- 插槽优先级高于 `value` 属性

