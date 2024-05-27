export default {
    css: {
        transformer: 'lightningcss',
        lightningcss: {
          targets: browserslistToTargets(browserslist('>= 0.25%'))
      }
      },
      build: {
        cssMinify: 'lightningcss'
    }
}