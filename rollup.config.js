import postcss from 'rollup-plugin-postcss'
import buble from '@rollup/plugin-buble'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'resizeDetector'
    },
    plugins: [
      postcss({
        inject: false,
        minimize: true
      }),
      buble(),
      terser()
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'esm/index.js',
      format: 'es'
    },
    plugins: [
      postcss({
        inject: false,
        minimize: true
      }),
      buble()
    ]
  }
]
