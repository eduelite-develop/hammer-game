const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const deps = require("./package.json").dependencies;
const mf = require("@angular-architects/module-federation/webpack");
const share = mf.share;

const REGISTER_KEY='react5b7399ba17a44c3a9a7bcdb96dd2945a';

module.exports = options => {
  return {
    stats: {
      warningsFilter: (warning) => {
        if (warning.message.includes('No required version specified and unable to automatically determine one')) {
          return true;
        }
        return false;
      },
    },
    entry: './index.js',
    output: {
      filename: 'bundle.js',
      publicPath: "auto",
      uniqueName: "mfe4"
    },
    module: {
      rules: [
        {
          test: /.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: ['@babel/react', '@babel/env']
              }
            }
          ],
        },
        {
          test: /\.css$/,
          use: [
            'style-loader', // Injects styles into DOM
            'css-loader',   // Resolves CSS imports
            'postcss-loader' // Processes CSS with PostCSS (including Tailwind)
          ],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({

          // For remotes (please adjust)
          name: REGISTER_KEY,
          library: { type: "var", name: REGISTER_KEY },
          filename: `remoteEntry-${REGISTER_KEY}.js`,
          exposes: {
            [`./${REGISTER_KEY}`]: `./${REGISTER_KEY}.js`,
          }, 
          shared: share({   
             "react": { singleton: true, eager: true, requiredVersion: deps.react },
             "react-dom": { singleton: true, eager: true, requiredVersion: deps["react-dom"] }
          })
        }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: './*.html'
            },
            { from: '_headers'}, // Adjust path as necessary
            { from: 'CORS'}, // Adjust path as necessary
          ]
        })
    ],
    devServer: {
      port: 4204
    }
  }
}
