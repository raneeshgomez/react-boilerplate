const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// process.env.NODE_ENV gets set to 'production' automatically on Heroku and to 'test' in the test script in package.json
// Therefore, if neither is set, it is set to 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Assigning environment-specific variables
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({path: '.env.development'});
}

module.exports = (env) => {
  const isProduction = env === 'production';

  return {
    // Defines entry point of application
    // Babel polyfill is set as the first entry point because it allows us to use newer features in older browsers
    entry: ['babel-polyfill', './src/app.js'],
    // Defines output file for bundling
    output: {
      path: path.join(__dirname, 'public', 'dist'),
      filename: 'bundle.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: 'styles.css'
        }),
        // Manually passing down Node environment variables in Webpack to Client Javascript
        // JSON.stringify() is used to add quotes to the values unlike the format in the .env files
        new webpack.DefinePlugin({
          'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
          'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
          'process.env.FIREBASE_DATABASE_URL': JSON.stringify(process.env.FIREBASE_DATABASE_URL),
          'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
          'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
          'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
          'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID)
        })
    ],
    module: {
      rules: [{
        // Defines a Babel loader to convert all .js files from ES6 to ES5 (excluding node_modules)
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.s?css$/,
        use: [
          // Minifies CSS files for production
          MiniCssExtractPlugin.loader,
          // Defines CSS loader to interpret import/require() and resolve them
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          // Defines SASS loader to convert Sass/SCSS files to CSS
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }]
    },
    // Allows to debug original source code (instead of webpack-bundled code) in browser dev tools
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    // Defines a development server
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      // Use client-side routing
      historyApiFallback: true,
      publicPath: '/dist/'
    }
  }
};
