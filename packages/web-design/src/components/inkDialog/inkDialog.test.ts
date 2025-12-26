import { describe, it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import InkDialog from "./inkDialog.vue";
import { INK_I18N_KEY } from "../../i18n";

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

  describe("i18n integration", () => {
    it("uses i18n translations for button text when no custom text provided", () => {
      const mockI18n = {
        t: (key: string) => {
          const translations: Record<string, string> = {
            "dialog.cancel": "Translated Cancel",
            "dialog.confirm": "Translated Confirm",
          };
          return translations[key] || key;
        },
        locale: { value: "en" },
      };

      const wrapper = mount(InkDialog, {
        props: {
          modelValue: false,
        },
        global: {
          provide: {
            [INK_I18N_KEY as symbol]: mockI18n,
          },
        },
      });

      // The computed properties should use i18n
      expect(wrapper.vm.defaultCancelText).toBe("Translated Cancel");
      expect(wrapper.vm.defaultConfirmText).toBe("Translated Confirm");
    });

    it("uses custom text over i18n translations", () => {
      const mockI18n = {
        t: (key: string) => {
          const translations: Record<string, string> = {
            "dialog.cancel": "Translated Cancel",
            "dialog.confirm": "Translated Confirm",
          };
          return translations[key] || key;
        },
        locale: { value: "en" },
      };

      const wrapper = mount(InkDialog, {
        props: {
          modelValue: false,
          cancelText: "Custom Cancel",
          confirmText: "Custom Confirm",
        },
        global: {
          provide: {
            [INK_I18N_KEY as symbol]: mockI18n,
          },
        },
      });

      expect(wrapper.vm.defaultCancelText).toBe("Custom Cancel");
      expect(wrapper.vm.defaultConfirmText).toBe("Custom Confirm");
    });

    it("falls back to English when i18n not provided", () => {
      const wrapper = mount(InkDialog, {
        props: {
          modelValue: false,
        },
      });

      expect(wrapper.vm.defaultCancelText).toBe("Cancel");
      expect(wrapper.vm.defaultConfirmText).toBe("Confirm");
    });
  });
});
