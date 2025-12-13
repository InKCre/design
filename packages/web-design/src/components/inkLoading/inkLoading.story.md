import { Story, Variant } from '@histoire/plugin-vue'
import InkLoading from './inkLoading.vue'

# inkLoading

> 异步操作期间提供视觉反馈，避免用户困惑。
> Provides visual feedback during async operations to prevent user confusion.

---

## Usage Intent

### Why this exists
- 明确告知用户系统正在处理
- 避免用户重复操作或误以为系统无响应
- 提供统一的加载动画体验

### When to use
- 数据加载中
- 表单提交处理中
- 异步操作执行中

### When NOT to use
- 即时响应的操作（< 200ms）
- 需要显示进度百分比的场景（使用进度条）

---

## Design Semantics

### Concepts
- `size`: 尺寸大小，适应不同容器 / Size for different containers
- `density`: 间距密度，控制视觉紧凑度 / Spacing density

### Visual / UX Meaning
- **动画循环**: 三个方块依次变亮，形成波浪效果，表示持续处理
- **颜色变化**: 从暗到亮的渐变，增强动态感知

---

## Canonical Examples

> 以下示例是**规范用法**，不是完整参数排列组合。

<Story title="Feedback/Loading/[Semantic] Default">
  <Variant title="Loading Indicator">
    <div style="padding: 40px; display: flex; justify-content: center;">
      <InkLoading />
    </div>
  </Variant>
</Story>

---

## Behavioral Contract

> 这些是**使用者可以依赖的行为保证**。

- 加载指示器：
  - ✅ 持续循环动画，直到移除
  - ✅ 动画流畅，无卡顿
  - ❌ 不会自动停止（由父组件控制显示/隐藏）

---

## Public API

### Props
- `size`: 方块尺寸 (`xs` | `sm` | `md`) / Block size
- `density`: 间距密度 (`sm` | `md`) / Spacing density

> 完整类型、默认值与可控项请参考下方自动生成的 API 表格。

---

## Extension & Composition

- 适合放置在数据列表、卡片、表单等容器中心
- 可配合条件渲染控制显示时机
- 建议居中显示以保持平衡感

---

## Non-Goals

> 以下内容**不属于该组件的职责范围**。

- 不显示加载进度（使用进度条组件）
- 不提供加载文本提示（应在外部添加）
- 不处理超时逻辑（由业务层控制）

---

## Implementation Notes

> ⚠️ 面向维护者，而非组件使用者。

- 使用 CSS keyframe 动画实现
- 三个方块通过 animation-delay 形成波浪效果
- 动画循环时间 1.5s，延迟间隔 0.3s
- 依赖设计系统的颜色 token

