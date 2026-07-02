// Radix UI (and other modern libraries) ship strict ESM .mjs files that import
// sibling modules like 'react/jsx-runtime' without a file extension. Webpack 5's
// default `fullySpecified: true` rule for ESM refuses to resolve that. CRA doesn't
// expose webpack config for overriding without ejecting, so CRACO patches it here.
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: { fullySpecified: false },
      })
      return webpackConfig
    },
  },
}
