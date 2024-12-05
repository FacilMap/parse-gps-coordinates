/// <reference types="vitest" />
import { isAbsolute } from 'node:path';
import { defineConfig } from 'vite';
import dtsPlugin from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		dtsPlugin({
			clearPureImport: false,
			rollupTypes: true,
		})
	],
	build: {
		sourcemap: true,
		minify: false,
		lib: {
			entry: `./src/index.ts`,
			name: 'parse-gps-coordinates',
			fileName: () => "parse-gps-coordinates.js",
			formats: ["es"]
		},
		rollupOptions: {
			external: (id) => !id.startsWith("./") && !id.startsWith("../") && /* resolved internal modules */ !isAbsolute(id)
		}
	},
	test: {
		environment: 'happy-dom'
	}
});
