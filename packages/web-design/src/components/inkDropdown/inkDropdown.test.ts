import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import InkDropdown from "./inkDropdown.vue";
import type { DropdownOption } from "./inkDropdown";

describe("InkDropdown", () => {
  const staticOptions: DropdownOption[] = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
    { label: "Option 3", value: "opt3" },
  ];

  it("renders with static options", () => {
    const wrapper = mount(InkDropdown, {
      props: {
        options: staticOptions,
        modelValue: "",
      },
    });

    expect(wrapper.find(".ink-dropdown").exists()).toBe(true);
  });

  it("displays placeholder when no value is selected", () => {
    const wrapper = mount(InkDropdown, {
      props: {
        options: staticOptions,
        modelValue: "",
        placeholder: "Select an option",
      },
    });

    expect(wrapper.find(".ink-dropdown__value").text()).toBe(
      "Select an option"
    );
  });

  it("displays selected option label", () => {
    const wrapper = mount(InkDropdown, {
      props: {
        options: staticOptions,
        modelValue: "opt2",
      },
    });

    expect(wrapper.find(".ink-dropdown__value").text()).toBe("Option 2");
  });

  it("emits update:modelValue when option is selected", async () => {
    const wrapper = mount(InkDropdown, {
      props: {
        options: staticOptions,
        modelValue: "",
        editable: true,
      },
    });

    // Open dropdown
    await wrapper.find(".ink-dropdown").trigger("click");
    await nextTick();

    // Select an option
    const options = wrapper.findAll(".ink-dropdown__option");
    await options[1].trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["opt2"]);
  });

  it("loads lazy options immediately when modelValue is set", async () => {
    const lazyOptions: DropdownOption[] = [
      { label: "Lazy 1", value: "lazy1" },
      { label: "Lazy 2", value: "lazy2" },
      { label: "Lazy 3", value: "lazy3" },
    ];

    const refresher = vi.fn(async () => {
      return Promise.resolve(lazyOptions);
    });

    const wrapper = mount(InkDropdown, {
      props: {
        refresher,
        modelValue: "lazy2",
      },
    });

    // Wait for mounted hook and async loading
    await nextTick();
    await vi.waitFor(() => expect(refresher).toHaveBeenCalled());

    // The refresher should be called immediately on mount
    expect(refresher).toHaveBeenCalledTimes(1);
  });

  it("does not load lazy options immediately when modelValue is empty", async () => {
    const refresher = vi.fn(async () => {
      return Promise.resolve([]);
    });

    mount(InkDropdown, {
      props: {
        refresher,
        modelValue: "",
      },
    });

    await nextTick();

    // Refresher should not be called for empty modelValue
    expect(refresher).not.toHaveBeenCalled();
  });

  it("does not load lazy options immediately when modelValue is null", async () => {
    const refresher = vi.fn(async () => {
      return Promise.resolve([]);
    });

    mount(InkDropdown, {
      props: {
        refresher,
        modelValue: null,
      },
    });

    await nextTick();

    // Refresher should not be called for null modelValue
    expect(refresher).not.toHaveBeenCalled();
  });

  it("does not load lazy options when static options already exist", async () => {
    const refresher = vi.fn(async () => {
      return Promise.resolve([]);
    });

    mount(InkDropdown, {
      props: {
        options: staticOptions,
        refresher,
        modelValue: "opt1",
      },
    });

    await nextTick();

    // Refresher should not be called when options are already provided
    expect(refresher).not.toHaveBeenCalled();
  });

  it("displays refresh button when refresher is provided", () => {
    const wrapper = mount(InkDropdown, {
      props: {
        refresher: async () => [],
      },
    });

    expect(wrapper.find(".ink-dropdown__refresh").exists()).toBe(true);
  });

  it("calls refresher when refresh button is clicked", async () => {
    const refresher = vi.fn(async () => []);

    const wrapper = mount(InkDropdown, {
      props: {
        refresher,
        editable: true,
      },
    });

    await wrapper.find(".ink-dropdown__refresh").trigger("click");
    await nextTick();

    expect(refresher).toHaveBeenCalled();
  });
});
