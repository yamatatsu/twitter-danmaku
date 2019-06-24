const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')

module.exports = {
  webpack: (config, { dev, vendor }) => {
    config.plugins.push(new Dotenv())

    return config
  },
}
