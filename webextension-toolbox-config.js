const webpack = require('webpack')

module.exports = {
  webpack: (config, { dev, vendor }) => {
    config.plugins.push(
      new webpack.EnvironmentPlugin([
        'CONSUMER_KEY',
        'CONSUMER_SECRET',
        'ACCESS_TOKEN_KEY',
        'ACCESS_TOKEN_SECRET',
      ]),
    )

    return config
  },
}
