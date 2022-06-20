import { builtinModules } from "module";
import { resolve } from "path";
import { defineConfig, UserConfigExport } from "vite";
import Dts from "vite-plugin-dts";

import { globalName, name } from "./package.json";

export default defineConfig(({ mode }) => {
  const isBrowser = process.env.IIFE === "TRUE";
  const option: UserConfigExport = {
    clearScreen: !isBrowser,
    optimizeDeps: {
      extensions: [".ts", ".js"]
    },
    resolve: {
      alias: {
        "#parser": resolve(__dirname, "src/dom", isBrowser ? "browser.ts" : "node.ts")
      }
    },
    build: {
      outDir: resolve(__dirname, "./dist"),
      emptyOutDir: !isBrowser,
      assetsDir: "",
      sourcemap: false,
      lib: {
        entry: resolve(__dirname, "./src/index.ts"),
        formats: isBrowser ? ["iife"] : ["cjs", "es"],
        name: globalName, // iife 模式的全局名称
        fileName: (format) => `${name}-${format}.js`
      },
      rollupOptions: {
        external: builtinModules.concat(["chalk", "cheerio"])
        // output.globals[name] 为external排除包的全局名称
        // output: { globals: { chalk: "Chalk" } },
      }
    },
    plugins: []
  };

  if (!isBrowser && mode === "production") {
    /** https://github.com/qmhc/vite-plugin-dts/blob/HEAD/README.zh-CN.md */
    option.plugins!.push(
      Dts({
        outputDir: resolve(__dirname, "dist/types"),
        skipDiagnostics: false,
        logDiagnostics: true
      })
    );
  }

  return option;
});
