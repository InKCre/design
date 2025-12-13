# `compName.docs.mdx` guide

## Best Practices

- Story-driven, tells what this component can do, what can't do.
- Every story should be an executable specification, not demo.
- Do not maintain API (props, emits) in document, Histoire will generate it from code.
- Readers are Coding Agents, pay attention to Token Efficiency. Use simple and concise language.

## Scaffold

````md
import { Story, Variant } from '@histoire/plugin-vue'
import CompName from './CompName.vue'

# CompName

> 一句话说明这个组件解决的核心问题。

---

## Usage Intent

### Why this exists
- 为什么**不能直接使用更基础的组件**
- 这个组件减少了什么重复劳动 / 认知负担

### When to use
- 明确的适用场景
- 推荐的典型用法

### When NOT to use
- 明确禁止或不推荐的场景
- 常见误用

---

## Design Semantics

### Concepts
- `ConceptA`：一句话定义
- `ConceptB`

### Visual / UX Meaning
- 不同状态 / 变体在**语义上的区别**
- 用户应该感知到什么变化

---

## Canonical Examples

> 以下示例是**规范用法**，不是完整参数排列组合。

<Story title="Primary usage">
  <Variant title="Default">
    <CompName />
  </Variant>
</Story>

<Story title="Variants">
  <Variant title="Variant A">
    <CompName variant="a" />
  </Variant>

  <Variant title="Variant B">
    <CompName variant="b" />
  </Variant>
</Story>

<Story title="States">
  <Variant title="Disabled">
    <CompName disabled />
  </Variant>

  <Variant title="Loading">
    <CompName loading />
  </Variant>
</Story>

---

## Behavioral Contract

> 这些是**使用者可以依赖的行为保证**。

- 在 `loading` 状态下：
  - ❌ 不触发主要事件
  - ❌ 不应重复提交
- 在 `disabled` 状态下：
  - 无 hover / active 反馈
- 状态切换应是幂等的
- 不应抛出未捕获异常

---

## Public API

### Props
- `variant`：组件的视觉 / 语义变体
- `disabled`：禁用组件交互
- `loading`：表示进行中的异步操作

> 完整类型、默认值与可控项请参考下方自动生成的 API 表格。

### Events
- `action(event)`：用户触发主要操作时发出

### Models
- `modelValue`：用于受控模式下的状态同步

---

## Slots

### default
组件的主要内容区域。

### header
用于覆盖默认标题或头部结构。

> 仅在需要自定义结构时使用。

---

## Extension & Composition

- 可与 `CompGroup` / `FormItem` 组合使用
- 支持受控 / 非受控两种使用方式
- 不建议嵌套在高频重排的容器中

---

## Non-Goals

> 以下内容**不属于该组件的职责范围**。

- 不处理权限或鉴权逻辑
- 不负责数据持久化
- 不承担业务流程编排

---

## Implementation Notes

> ⚠️ 面向维护者，而非组件使用者。

- 内部使用 `useXXX` 管理状态
- 依赖浏览器能力：`ResizeObserver`
- 对 SSR / 无 DOM 环境的处理说明
````
