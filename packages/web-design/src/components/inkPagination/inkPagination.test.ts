import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InkPagination from "./inkPagination.vue";

describe("InkPagination", () => {
  it("renders page buttons correctly for few pages", () => {
    const wrapper = mount(InkPagination, {
      props: {
        currentPage: 1,
        totalPages: 5,
      },
    });

    const pageButtons = wrapper.findAll(".ink-pagination__page");
    expect(pageButtons.length).toBe(5);
  });

  it("highlights the current page", () => {
    const wrapper = mount(InkPagination, {
      props: {
        currentPage: 3,
        totalPages: 5,
      },
    });

    const activeButton = wrapper.find(".ink-pagination__page--active");
    expect(activeButton.text()).toBe("3");
  });

  it("emits page-change event when page button is clicked", async () => {
    const wrapper = mount(InkPagination, {
      props: {
        currentPage: 1,
        totalPages: 5,
      },
    });

    const pageButtons = wrapper.findAll(".ink-pagination__page");
    await pageButtons[2].trigger("click"); // Click page 3

    expect(wrapper.emitted("page-change")).toBeTruthy();
    expect(wrapper.emitted("page-change")?.[0]).toEqual([3]);
  });

  it("disables prev button on first page", () => {
    const wrapper = mount(InkPagination, {
      props: {
        currentPage: 1,
        totalPages: 5,
      },
    });

    const prevButton = wrapper.find(".ink-pagination__nav--prev");
    expect(prevButton.attributes("disabled")).toBeDefined();
  });

  it("disables next button on last page", () => {
    const wrapper = mount(InkPagination, {
      props: {
        currentPage: 5,
        totalPages: 5,
      },
    });

    const nextButton = wrapper.find(".ink-pagination__nav--next");
    expect(nextButton.attributes("disabled")).toBeDefined();
  });

  it("emits page-change when prev button is clicked", async () => {
    const wrapper = mount(InkPagination, {
      props: {
        currentPage: 3,
        totalPages: 5,
      },
    });

    const prevButton = wrapper.find(".ink-pagination__nav--prev");
    await prevButton.trigger("click");

    expect(wrapper.emitted("page-change")?.[0]).toEqual([2]);
  });

  it("emits page-change when next button is clicked", async () => {
    const wrapper = mount(InkPagination, {
      props: {
        currentPage: 3,
        totalPages: 5,
      },
    });

    const nextButton = wrapper.find(".ink-pagination__nav--next");
    await nextButton.trigger("click");

    expect(wrapper.emitted("page-change")?.[0]).toEqual([4]);
  });

  it("shows ellipsis for many pages", () => {
    const wrapper = mount(InkPagination, {
      props: {
        currentPage: 10,
        totalPages: 20,
      },
    });

    const ellipsisButtons = wrapper.findAll(".ink-pagination__page--ellipsis");
    expect(ellipsisButtons.length).toBeGreaterThan(0);
  });

  it("does not emit event when clicking current page", async () => {
    const wrapper = mount(InkPagination, {
      props: {
        currentPage: 3,
        totalPages: 5,
      },
    });

    const activeButton = wrapper.find(".ink-pagination__page--active");
    await activeButton.trigger("click");

    expect(wrapper.emitted("page-change")).toBeFalsy();
  });
});
