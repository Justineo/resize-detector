import postcss from 'rollup-plugin-postcss'
import cssnano from 'cssnano'
import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'resizeListener'
  },
  plugins: [
    postcss({
      inject: false,
      plugins: [cssnano({
        preset: 'default'
      })]
    }),
    buble(),
    uglify()
  ]
}
