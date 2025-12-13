import { Story, Variant } from '@histoire/plugin-vue'
import InkHeader from './inkHeader.vue'

# inkHeader

> 提供应用的顶部导航栏，包含品牌标识和页面标题。
> Provides application top navigation bar with branding and page title.

---

## Usage Intent

### Why this exists
- 统一应用的顶部导航体验
- 提供品牌标识展示
- 显示当前页面上下文

### When to use
- 应用的主要导航区域
- 需要显示品牌 logo 和标题的场景
- 顶部固定导航栏

### When NOT to use
- 复杂的多级导航（使用导航菜单组件）
- 详情页的局部标题（使用页面标题组件）

---

## Design Semantics

### Concepts
- `title`: 品牌或应用名称 / Brand or app name
- `pageTitle`: 当前页面标题 / Current page title
- `logoSrc`: Logo 图片路径 / Logo image source

### Visual / UX Meaning
- **左侧**: Logo + 应用标题，标识应用身份
- **右侧**: 页面标题 + 操作按钮，提供上下文和功能入口

---

## Canonical Examples

> 以下示例是**规范用法**，不是完整参数排列组合。

<Story title="Controls/Header/[Semantic] Default">
  <Variant title="Basic Header">
    <InkHeader
      title="InKCre"
      pageTitle="Dashboard"
    />
  </Variant>
</Story>

<Story title="Controls/Header/[State] With Logo">
  <Variant title="With Logo">
    <InkHeader
      title="InKCre"
      logoSrc="https://via.placeholder.com/32"
    />
  </Variant>

  <Variant title="Without Logo">
    <InkHeader
      title="InKCre"
    />
  </Variant>
</Story>

---

## Behavioral Contract

> 这些是**使用者可以依赖的行为保证**。

- 点击 Logo 区域时：
  - ✅ 触发 `title-click` 事件
  - ✅ 通常用于返回首页
- 点击菜单图标时：
  - ✅ 触发 `menu-click` 事件
  - ✅ 通常用于打开侧边栏
- 页面标题：
  - ✅ 优先使用 `pageTitle` 属性
  - ✅ 如果未提供，尝试使用 vue-router 的 route.name

---

## Public API

### Props
- `title`: 应用标题 / App title
- `pageTitle`: 页面标题 / Page title
- `logoSrc`: Logo 图片路径 / Logo image source

> 完整类型、默认值与可控项请参考下方自动生成的 API 表格。

### Events
- `menu-click()`: 菜单图标点击时触发 / Emitted when menu icon is clicked
- `title-click()`: 标题区域点击时触发 / Emitted when title area is clicked

---

## Slots

### right-icon
右侧图标区域，默认显示菜单图标，可替换为其他操作按钮。
Right icon area, defaults to menu icon, can be replaced with other action buttons.

---

## Extension & Composition

- 通常放置在应用的最顶部
- 可配合路由自动显示页面标题
- 支持自定义右侧操作区域

---

## Non-Goals

> 以下内容**不属于该组件的职责范围**。

- 不处理路由导航逻辑（应在外部监听事件）
- 不提供多级面包屑导航
- 不负责用户认证状态显示

---

## Implementation Notes

> ⚠️ 面向维护者，而非组件使用者。

- 可选依赖 vue-router（通过 getCurrentInstance 检测）
- Logo 通过 v-if 控制显示
- 菜单图标使用 UnoCSS 图标类
