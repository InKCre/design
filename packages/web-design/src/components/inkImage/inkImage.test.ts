import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import InkImage from "./inkImage.vue";

describe("InkImage", () => {
  const defaultProps = {
    src: "https://example.com/image.jpg",
    alt: "Test image",
  };

  describe("rendering", () => {
    it("renders thumbnail image with provided src and alt", () => {
      const wrapper = mount(InkImage, {
        props: defaultProps,
      });

      const img = wrapper.find("[data-testid='ink-image-img']");
      expect(img.exists()).toBe(true);
      expect(img.attributes("src")).toBe(defaultProps.src);
      expect(img.attributes("alt")).toBe(defaultProps.alt);
    });

    it("applies maxWidth and maxHeight styles to thumbnail", () => {
      const wrapper = mount(InkImage, {
        props: {
          ...defaultProps,
          maxWidth: "200px",
          maxHeight: "300px",
        },
      });

      const img = wrapper.find("[data-testid='ink-image-img']");
      expect(img.attributes("style")).toContain("max-width: 200px");
      expect(img.attributes("style")).toContain("max-height: 300px");
    });

    it("renders custom thumbnail slot when provided", () => {
      const wrapper = mount(InkImage, {
        props: defaultProps,
        slots: {
          thumbnail: "<div class='custom-thumbnail'>Custom</div>",
        },
      });

      expect(wrapper.find(".custom-thumbnail").exists()).toBe(true);
    });

    it("shows title in expanded view when provided", () => {
      const wrapper = mount(InkImage, {
        props: {
          ...defaultProps,
          title: "Test Image Title",
        },
      });

      // Expand the image
      wrapper.find("[data-testid='ink-image-thumbnail']").trigger("click");
      wrapper.vm.$nextTick(() => {
        expect(wrapper.find(".ink-image__expanded-title").text()).toBe(
          "Test Image Title"
        );
      });
    });
  });

  describe("expand functionality", () => {
    it("expands image when thumbnail is clicked", async () => {
      const wrapper = mount(InkImage, {
        props: defaultProps,
      });

      expect(wrapper.vm.expanded).toBe(false);

      await wrapper
        .find("[data-testid='ink-image-thumbnail']")
        .trigger("click");

      expect(wrapper.vm.expanded).toBe(true);
    });

    it("emits expand event when clicking thumbnail", async () => {
      const wrapper = mount(InkImage, {
        props: defaultProps,
      });

      await wrapper
        .find("[data-testid='ink-image-thumbnail']")
        .trigger("click");

      expect(wrapper.emitted("expand")).toHaveLength(1);
    });
  });

  describe("close functionality", () => {
    it("closes expanded view when close button is clicked", async () => {
      const wrapper = mount(InkImage, {
        props: defaultProps,
      });

      // Expand
      await wrapper
        .find("[data-testid='ink-image-thumbnail']")
        .trigger("click");
      expect(wrapper.vm.expanded).toBe(true);

      // Close
      const closeBtn = wrapper.find("[data-testid='ink-image-close-btn']");
      await closeBtn.trigger("click");

      expect(wrapper.vm.expanded).toBe(false);
    });

    it("emits close event when closing expanded view", async () => {
      const wrapper = mount(InkImage, {
        props: defaultProps,
      });

      // Expand first
      await wrapper
        .find("[data-testid='ink-image-thumbnail']")
        .trigger("click");

      // Close
      await wrapper
        .find("[data-testid='ink-image-close-btn']")
        .trigger("click");

      expect(wrapper.emitted("close")).toHaveLength(1);
    });

    it("closes on ESC key press", async () => {
      const wrapper = mount(InkImage, {
        props: defaultProps,
      });

      // Expand
      await wrapper
        .find("[data-testid='ink-image-thumbnail']")
        .trigger("click");
      expect(wrapper.vm.expanded).toBe(true);

      // Press ESC
      await wrapper.trigger("keydown", { key: "Escape" });

      expect(wrapper.vm.expanded).toBe(false);
    });
  });

  describe("lazy loading", () => {
    it("adds lazy loading attribute when lazy prop is true", () => {
      const wrapper = mount(InkImage, {
        props: {
          ...defaultProps,
          lazy: true,
        },
      });

      const img = wrapper.find("[data-testid='ink-image-img']");
      expect(img.attributes("loading")).toBe("lazy");
    });

    it("does not add lazy loading attribute when lazy prop is false", () => {
      const wrapper = mount(InkImage, {
        props: {
          ...defaultProps,
          lazy: false,
        },
      });

      const img = wrapper.find("[data-testid='ink-image-img']");
      expect(img.attributes("loading")).toBeUndefined();
    });
  });

  describe("error handling", () => {
    it("emits error event when image fails to load", async () => {
      const wrapper = mount(InkImage, {
        props: defaultProps,
      });

      const img = wrapper.find("[data-testid='ink-image-img']");
      const errorEvent = new Event("error");

      await img.trigger("error", errorEvent);

      const emitted = wrapper.emitted("error");
      expect(emitted).toHaveLength(1);
      expect(emitted?.[0]?.[0]).toHaveProperty("src", defaultProps.src);
    });
  });

  describe("v-model:expanded", () => {
    it("updates expanded state via v-model", async () => {
      const wrapper = mount(InkImage, {
        props: {
          ...defaultProps,
          expanded: false,
        },
      });

      expect(wrapper.vm.expanded).toBe(false);

      await wrapper.setProps({ expanded: true });

      expect(wrapper.vm.expanded).toBe(true);
    });
  });

  describe("slots", () => {
    it("renders expanded-header slot when provided", async () => {
      const wrapper = mount(InkImage, {
        props: defaultProps,
        slots: {
          "expanded-header": "<div class='custom-header'>Custom Header</div>",
        },
      });

      await wrapper
        .find("[data-testid='ink-image-thumbnail']")
        .trigger("click");

      expect(wrapper.find(".custom-header").exists()).toBe(true);
    });

    it("renders expanded-footer slot when provided", async () => {
      const wrapper = mount(InkImage, {
        props: defaultProps,
        slots: {
          "expanded-footer": "<div class='custom-footer'>Custom Footer</div>",
        },
      });

      await wrapper
        .find("[data-testid='ink-image-thumbnail']")
        .trigger("click");

      expect(wrapper.find(".custom-footer").exists()).toBe(true);
    });

    it("does not render footer container when no footer slot is provided", async () => {
      const wrapper = mount(InkImage, {
        props: defaultProps,
      });

      await wrapper
        .find("[data-testid='ink-image-thumbnail']")
        .trigger("click");

      expect(wrapper.find(".ink-image__expanded-footer").exists()).toBe(false);
    });
  });

  describe("accessibility", () => {
    it("has proper alt text for accessibility", () => {
      const wrapper = mount(InkImage, {
        props: {
          ...defaultProps,
          alt: "Descriptive alt text",
        },
      });

      const img = wrapper.find("[data-testid='ink-image-img']");
      expect(img.attributes("alt")).toBe("Descriptive alt text");
    });

    it("close button has aria-label", async () => {
      const wrapper = mount(InkImage, {
        props: defaultProps,
      });

      await wrapper
        .find("[data-testid='ink-image-thumbnail']")
        .trigger("click");

      const closeBtn = wrapper.find("[data-testid='ink-image-close-btn']");
      expect(closeBtn.attributes("aria-label")).toBe("Close image");
    });
  });
});
