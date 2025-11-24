<template>
  <div class="app">
    <header class="header">
      <h1>InKCre Web Design System</h1>
      <p>Development Playground</p>
    </header>

    <main class="main">
      <section class="tokens-demo">
        <h2>Design Tokens</h2>
        <div class="color-grid">
          <div
            class="color-card"
            v-for="color in colorTokens"
            :key="color.name"
          >
            <div
              class="color-swatch"
              :style="{ backgroundColor: color.value }"
            ></div>
            <div class="color-info">
              <strong>{{ color.name }}</strong>
              <span>{{ color.value }}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import tokens from "./tokens/index.js";

export default {
  name: "App",
  computed: {
    colorTokens() {
      return Object.entries(tokens.color || {}).map(([name, value]) => ({
        name: `color.${name}`,
        value,
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  padding: 2rem;
  font-family: var(--font-family-base);
}

.header {
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--color-text-secondary);
  }
}

.main {
  max-width: 1200px;
  margin: 0 auto;
}

.tokens-demo {
  h2 {
    margin-bottom: 1.5rem;
    color: var(--color-text-primary);
  }
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.color-card {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: white;
  box-shadow: var(--shadow-sm);
}

.color-swatch {
  height: 80px;
  width: 100%;
}

.color-info {
  padding: 1rem;

  strong {
    display: block;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }

  span {
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    font-family: monospace;
  }
}
</style>
