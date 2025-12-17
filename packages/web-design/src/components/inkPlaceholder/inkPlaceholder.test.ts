import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InkPlaceholder from "./inkPlaceholder.vue";

describe("InkPlaceholder", () => {
  it("renders with default empty state", () => {
    const wrapper = mount(InkPlaceholder, {
      props: {
        state: "empty",
      },
    });

    expect(wrapper.find(".ink-placeholder").exists()).toBe(true);
    expect(wrapper.find(".ink-placeholder--empty").exists()).toBe(true);
  });

  it("renders with error state", () => {
    const wrapper = mount(InkPlaceholder, {
      props: {
        state: "error",
      },
    });

    expect(wrapper.find(".ink-placeholder--error").exists()).toBe(true);
  });

  it("displays custom title", () => {
    const wrapper = mount(InkPlaceholder, {
      props: {
        state: "empty",
        title: "Custom Title",
      },
    });

    expect(wrapper.text()).toContain("Custom Title");
  });

  it("displays custom description", () => {
    const wrapper = mount(InkPlaceholder, {
      props: {
        state: "empty",
        description: "Custom Description",
      },
    });

    expect(wrapper.text()).toContain("Custom Description");
  });

  it("displays default title for empty state", () => {
    const wrapper = mount(InkPlaceholder, {
      props: {
        state: "empty",
      },
    });

    expect(wrapper.text()).toContain("No data");
  });

  it("displays default title for error state", () => {
    const wrapper = mount(InkPlaceholder, {
      props: {
        state: "error",
      },
    });

    expect(wrapper.text()).toContain("Something went wrong");
  });

  it("renders actions slot when provided", () => {
    const wrapper = mount(InkPlaceholder, {
      props: {
        state: "empty",
      },
      slots: {
        actions: '<button class="test-action">Action</button>',
      },
    });

    expect(wrapper.find(".ink-placeholder__actions").exists()).toBe(true);
    expect(wrapper.find(".test-action").exists()).toBe(true);
  });

  it("does not render actions container when no actions slot provided", () => {
    const wrapper = mount(InkPlaceholder, {
      props: {
        state: "empty",
      },
    });

    expect(wrapper.find(".ink-placeholder__actions").exists()).toBe(false);
  });

  it("renders custom illustration slot", () => {
    const wrapper = mount(InkPlaceholder, {
      props: {
        state: "empty",
      },
      slots: {
        illustration: '<div class="custom-icon">🎨</div>',
      },
    });

    expect(wrapper.find(".custom-icon").exists()).toBe(true);
  });

  it("renders custom title slot", () => {
    const wrapper = mount(InkPlaceholder, {
      props: {
        state: "empty",
      },
      slots: {
        title: '<h2 class="custom-title">Custom</h2>',
      },
    });

    expect(wrapper.find(".custom-title").exists()).toBe(true);
  });

  it("renders custom description slot", () => {
    const wrapper = mount(InkPlaceholder, {
      props: {
        state: "empty",
      },
      slots: {
        description: '<p class="custom-desc">Custom description</p>',
      },
    });

    expect(wrapper.find(".custom-desc").exists()).toBe(true);
  });

  it("uses custom illustration prop when provided", () => {
    const wrapper = mount(InkPlaceholder, {
      props: {
        state: "empty",
        illustration: "i-mdi-custom-icon",
      },
    });

    expect(wrapper.find(".i-mdi-custom-icon").exists()).toBe(true);
  });
});
