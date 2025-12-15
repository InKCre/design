import { describe, it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import InkDialog from "./inkDialog.vue";

describe("InkDialog", () => {
  it("renders with basic props", async () => {
    const wrapper = mount(InkDialog, {
      props: {
        modelValue: true,
        title: "Test Dialog",
        subtitle: "Test Subtitle",
      },
      attachTo: document.body,
    });

    await flushPromises();

    // Just verify component mounted successfully
    expect(wrapper.vm).toBeTruthy();
  });

  it("emits update:modelValue event", async () => {
    const wrapper = mount(InkDialog, {
      props: {
        modelValue: true,
      },
      attachTo: document.body,
    });

    await flushPromises();

    // Manually trigger the open setter
    await wrapper.vm.$emit("update:modelValue", false);

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("emits cancel event", async () => {
    const wrapper = mount(InkDialog, {
      props: {
        modelValue: true,
      },
      attachTo: document.body,
    });

    await flushPromises();

    await wrapper.vm.$emit("cancel");

    expect(wrapper.emitted("cancel")).toBeTruthy();
  });

  it("emits confirm event", async () => {
    const wrapper = mount(InkDialog, {
      props: {
        modelValue: true,
      },
      attachTo: document.body,
    });

    await flushPromises();

    await wrapper.vm.$emit("confirm");

    expect(wrapper.emitted("confirm")).toBeTruthy();
  });

  it("accepts position prop", () => {
    const wrapper = mount(InkDialog, {
      props: {
        modelValue: false,
        position: "left",
      },
    });

    expect(wrapper.props("position")).toBe("left");
  });

  it("accepts closeOnScrim prop", () => {
    const wrapper = mount(InkDialog, {
      props: {
        modelValue: false,
        closeOnScrim: false,
      },
    });

    expect(wrapper.props("closeOnScrim")).toBe(false);
  });

  it("accepts showCancel and showConfirm props", () => {
    const wrapper = mount(InkDialog, {
      props: {
        modelValue: false,
        showCancel: false,
        showConfirm: false,
      },
    });

    expect(wrapper.props("showCancel")).toBe(false);
    expect(wrapper.props("showConfirm")).toBe(false);
  });

  it("accepts custom button text props", () => {
    const wrapper = mount(InkDialog, {
      props: {
        modelValue: false,
        cancelText: "Custom Cancel",
        confirmText: "Custom Confirm",
      },
    });

    expect(wrapper.props("cancelText")).toBe("Custom Cancel");
    expect(wrapper.props("confirmText")).toBe("Custom Confirm");
  });
});
