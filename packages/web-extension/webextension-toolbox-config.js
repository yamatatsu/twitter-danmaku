const { resolve } = require('path')
const GlobEntriesPlugin = require('webpack-watched-glob-entries-plugin')

module.exports = {
  webpack: (config, { dev, vendor }) => {
    config.module.rules.push({
      test: /\.ts$/,
      exclude: /node_modules/,
      use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    })

    const entries = []
    entries.push(resolve('app', '*.{ts,js,mjs,jsx}'))
    entries.push(resolve('app', '?(scripts)/**/*.{ts,js,mjs,jsx}'))
    config.entry = GlobEntriesPlugin.getEntries(entries)

    config.resolve.extensions.push('.ts')

    return config
  },
}
