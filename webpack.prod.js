const webpack = require('webpack');
const read = require('read-yaml');
const config = read.sync('./config.yml');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const glob = require("glob");

module.exports = function(env) {

    const { ENV_THEMEKIT } = env;
    const themeDir = (config[ENV_THEMEKIT].directory).replace('./','');

    return {
        mode: 'production',
        entry: Object.assign(
            glob.sync("./src/js/*.js").reduce(
                (obj, val) => {
                    const filenameRegex = /([\w\d_-]*)\.?[^\\\/]*$/i;
                    const filename = val.replace('.js','').replace('./src/js/','');
                    obj[filename] = val;
                    return obj;
                },
                {}
            )
        ),
        output: {
            filename: 'latori-theme.[name].js',
            path: path.resolve(__dirname, themeDir + '/assets'),
        },
        resolve: {
            alias: {
                svelte: path.resolve('node_modules', 'svelte'),
                '@modules': path.resolve(__dirname, 'node_modules'),
                '@sass': path.resolve(__dirname, 'src/sass/'),
                '@js': path.resolve(__dirname, 'src/js/')
            },
            extensions: ['.mjs', '.js', '.svelte'],
            mainFields: ['svelte', 'browser', 'module', 'main']
        },
        module: {
            rules: [
                {
                    test: /\.svelte$/,
                    use: {
                        loader: 'svelte-loader',
                        options: {
                            emitCss: true,
                            hotReload: false,
                            onwarn: function (warning, handleWarning) {
                                if (warning.code === 'a11y-no-onchange') { return }
                                handleWarning(warning);
                            }
                        }
                    }
                },
                {
                    test: /\.(css|s[ac]ss)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    ident: 'postcss',
                                    plugins: (loader) => [
                                        require('postcss-preset-env')()
                                    ]
                                }
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                }
            ]
        },
        plugins: [
            // new BundleAnalyzerPlugin(),
            new webpack.EnvironmentPlugin({
                ...Object.keys(config[ENV_THEMEKIT].config).reduce((c, k) => (c[k.toUpperCase().trim()] = config[ENV_THEMEKIT].config[k], c), {}),
                SHOPIFY_URL: config[ENV_THEMEKIT].store
            }),
            new MiniCssExtractPlugin({
                filename: "latori-theme.[name].css",
                chunkFilename: "latori-theme.[id].css"
            }),
            new HtmlWebpackPlugin({
                filename: `../snippets/style-tags.liquid`,
                template: path.resolve(__dirname, './src/templates/style-tags.html'),
                inject: false,
                minify: {
                    removeComments: true,
                    removeAttributeQuotes: false,
                },
                isDevServer: false
            }),
            new HtmlWebpackPlugin({
                filename: `../snippets/script-tags.liquid`,
                template: path.resolve(__dirname, './src/templates/script-tags.html'),
                inject: false,
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeAttributeQuotes: false,
                },
                isDevServer: false
            }),
            new HtmlWebpackPlugin({
                // excludeChunks: ['static'],
                filename: `../snippets/checkout-assets.liquid`,
                template: path.resolve(__dirname, './src/templates/checkout-assets.html'),
                inject: false,
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeAttributeQuotes: false,
                },
                // chunksSortMode: 'dependency',
                isDevServer: false
            }),
            new TerserPlugin({
                parallel: true,
                extractComments: false,
                terserOptions: {
                  ecma: 6,
                },
            })
        ],
        optimization: {
            minimizer: [
              new OptimizeCSSAssetsPlugin({
                cssProcessorPluginOptions: {
                  preset: ['default', {
                    discardComments: {
                      removeAll: true
                    }
                  }],
                },
              })
            ]
        }
    }
};