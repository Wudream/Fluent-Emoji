// vite.config.ts
import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite'
import { presetAttributify, presetUno } from 'unocss'
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
    plugins: [
        solidPlugin(),
        UnoCSS({
            presets: [
                presetAttributify({ /* options */ }),
                // ...other presets
                presetUno()
            ],
        }),
    ],
});