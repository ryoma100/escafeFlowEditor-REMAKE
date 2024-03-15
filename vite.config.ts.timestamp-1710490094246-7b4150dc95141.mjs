// vite.config.ts
import devtools from "file:///Users/ryoma/Github/tiny-es-flow-editor/node_modules/.pnpm/solid-devtools@0.29.3_solid-js@1.8.15_vite@5.1.5/node_modules/solid-devtools/dist/vite.js";
import { defineConfig } from "file:///Users/ryoma/Github/tiny-es-flow-editor/node_modules/.pnpm/vite@5.1.5/node_modules/vite/dist/node/index.js";
import solid from "file:///Users/ryoma/Github/tiny-es-flow-editor/node_modules/.pnpm/vite-plugin-solid@2.10.1_solid-js@1.8.15_vite@5.1.5/node_modules/vite-plugin-solid/dist/esm/index.mjs";
import solidSvg from "file:///Users/ryoma/Github/tiny-es-flow-editor/node_modules/.pnpm/vite-plugin-solid-svg@0.8.0_solid-js@1.8.15_vite@5.1.5/node_modules/vite-plugin-solid-svg/dist/index.js";
var vite_config_default = defineConfig(async () => ({
  base: process.env.VITE_BASE_PATH,
  plugins: [
    devtools({
      /* features options - all disabled by default */
      autoname: true,
      // e.g. enable autoname
      locator: {
        targetIDE: "vscode",
        key: "Ctrl",
        jsxLocation: true,
        componentLocation: true
      }
    }),
    solid(),
    solidSvg()
  ],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"]
    }
  },
  test: {
    global: true
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcnlvbWEvR2l0aHViL3RpbnktZXMtZmxvdy1lZGl0b3JcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9yeW9tYS9HaXRodWIvdGlueS1lcy1mbG93LWVkaXRvci92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvcnlvbWEvR2l0aHViL3RpbnktZXMtZmxvdy1lZGl0b3Ivdml0ZS5jb25maWcudHNcIjtpbXBvcnQgZGV2dG9vbHMgZnJvbSBcInNvbGlkLWRldnRvb2xzL3ZpdGVcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgc29saWQgZnJvbSBcInZpdGUtcGx1Z2luLXNvbGlkXCI7XG5pbXBvcnQgc29saWRTdmcgZnJvbSBcInZpdGUtcGx1Z2luLXNvbGlkLXN2Z1wiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKGFzeW5jICgpID0+ICh7XG4gIGJhc2U6IHByb2Nlc3MuZW52LlZJVEVfQkFTRV9QQVRILFxuICBwbHVnaW5zOiBbXG4gICAgZGV2dG9vbHMoe1xuICAgICAgLyogZmVhdHVyZXMgb3B0aW9ucyAtIGFsbCBkaXNhYmxlZCBieSBkZWZhdWx0ICovXG4gICAgICBhdXRvbmFtZTogdHJ1ZSwgLy8gZS5nLiBlbmFibGUgYXV0b25hbWVcbiAgICAgIGxvY2F0b3I6IHtcbiAgICAgICAgdGFyZ2V0SURFOiBcInZzY29kZVwiLFxuICAgICAgICBrZXk6IFwiQ3RybFwiLFxuICAgICAgICBqc3hMb2NhdGlvbjogdHJ1ZSxcbiAgICAgICAgY29tcG9uZW50TG9jYXRpb246IHRydWUsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHNvbGlkKCksXG4gICAgc29saWRTdmcoKSxcbiAgXSxcblxuICAvLyBWaXRlIG9wdGlvbnMgdGFpbG9yZWQgZm9yIFRhdXJpIGRldmVsb3BtZW50IGFuZCBvbmx5IGFwcGxpZWQgaW4gYHRhdXJpIGRldmAgb3IgYHRhdXJpIGJ1aWxkYFxuICAvL1xuICAvLyAxLiBwcmV2ZW50IHZpdGUgZnJvbSBvYnNjdXJpbmcgcnVzdCBlcnJvcnNcbiAgY2xlYXJTY3JlZW46IGZhbHNlLFxuICAvLyAyLiB0YXVyaSBleHBlY3RzIGEgZml4ZWQgcG9ydCwgZmFpbCBpZiB0aGF0IHBvcnQgaXMgbm90IGF2YWlsYWJsZVxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAxNDIwLFxuICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgd2F0Y2g6IHtcbiAgICAgIC8vIDMuIHRlbGwgdml0ZSB0byBpZ25vcmUgd2F0Y2hpbmcgYHNyYy10YXVyaWBcbiAgICAgIGlnbm9yZWQ6IFtcIioqL3NyYy10YXVyaS8qKlwiXSxcbiAgICB9LFxuICB9LFxuXG4gIHRlc3Q6IHtcbiAgICBnbG9iYWw6IHRydWUsXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVTLE9BQU8sY0FBYztBQUM1VCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxjQUFjO0FBR3JCLElBQU8sc0JBQVEsYUFBYSxhQUFhO0FBQUEsRUFDdkMsTUFBTSxRQUFRLElBQUk7QUFBQSxFQUNsQixTQUFTO0FBQUEsSUFDUCxTQUFTO0FBQUE7QUFBQSxNQUVQLFVBQVU7QUFBQTtBQUFBLE1BQ1YsU0FBUztBQUFBLFFBQ1AsV0FBVztBQUFBLFFBQ1gsS0FBSztBQUFBLFFBQ0wsYUFBYTtBQUFBLFFBQ2IsbUJBQW1CO0FBQUEsTUFDckI7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxFQUNYO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxhQUFhO0FBQUE7QUFBQSxFQUViLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLE9BQU87QUFBQTtBQUFBLE1BRUwsU0FBUyxDQUFDLGlCQUFpQjtBQUFBLElBQzdCO0FBQUEsRUFDRjtBQUFBLEVBRUEsTUFBTTtBQUFBLElBQ0osUUFBUTtBQUFBLEVBQ1Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
