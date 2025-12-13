import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InkButton from "./inkButton.vue";

describe("InkButton", () => {
  it("renders button with text", () => {
    const wrapper = mount(InkButton, {
      props: {
        text: "Click me",
        type: "primary",
        size: "md",
      },
    });

    expect(wrapper.text()).toContain("Click me");
  });

  it("applies correct CSS classes for type and size", () => {
    const wrapper = mount(InkButton, {
      props: {
        text: "Test",
        type: "danger",
        size: "sm",
      },
    });

    const button = wrapper.find("button");
    expect(button.classes()).toContain("ink-button--danger");
    expect(button.classes()).toContain("ink-button--sm");
  });

  it("emits click event when clicked", async () => {
    const wrapper = mount(InkButton, {
      props: {
        text: "Click me",
      },
    });

    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click");
  });

  it("uses default values when props not provided", () => {
    const wrapper = mount(InkButton);
    const button = wrapper.find("button");

    expect(button.classes()).toContain("ink-button--subtle");
    expect(button.classes()).toContain("ink-button--md");
  });
});
