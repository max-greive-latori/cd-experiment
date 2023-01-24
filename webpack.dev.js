const webpack = require('webpack');
const read = require('read-yaml');
const config = read.sync('./config.yml');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var glob = require("glob");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

require('dotenv').config();

module.exports = function(env) {

    const { ENV_THEMEKIT } = env;
    let themeID = config[ENV_THEMEKIT].theme_id;
        themeID = typeof themeID === 'string' && themeID.includes('${') ? process.env[themeID.replace('${','').replace('}','')] : themeID;
    const storeURL = config[ENV_THEMEKIT].store;
    const themeDir = (config[ENV_THEMEKIT].directory).replace('./','');

    return {
        mode: 'development',
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
                            hotReload: true,
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
                        'style-loader',
                        'css-loader',
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    ident: 'postcss',
                                    plugins: (loader) => [
                                        require('postcss-preset-env')(),
                                        require('cssnano')()
                                    ]
                                }
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }],
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
                filename: 'latori-theme.[name].js',
		        chunkFilename: 'latori-theme.[id].js'
            }),
            new HtmlWebpackPlugin({
                filename: `../snippets/style-tags.liquid`,
                template: path.resolve(__dirname, './src/templates/style-tags.html'),
                inject: false,
                minify: false,
                isDevServer: true
            }),
            new HtmlWebpackPlugin({
                filename: `../snippets/script-tags.liquid`,
                template: path.resolve(__dirname, './src/templates/script-tags.html'),
                inject: false,
                minify: false,
                isDevServer: true
            }),
            new HtmlWebpackPlugin({
                filename: `../snippets/checkout-assets.liquid`,
                template: path.resolve(__dirname, './src/templates/checkout-assets.html'),
                inject: false,
                minify: false,
                isDevServer: true
            }),
            new BrowserSyncPlugin({
                https: {
                    key: path.resolve('./localhost-key.pem'),
                    cert: path.resolve('./localhost.pem'),
                },
                logLevel: 'silent',
                cors: true,
                port: 3000,
                injectCss: true,
                proxy: {
                    target: 'https://' + storeURL + '?preview_theme_id=' + themeID,
                    proxyReq: [
                        function(proxyReq) {
                            proxyReq.setHeader('Origin', storeURL);
                        }
                    ]
                },
                reloadDelay: 3000,
                snippetOptions: {
                rule: {
                    match: /<head[^>]*>/i,
                    fn: function(snippet, match) {
                        return match + snippet;
                    }
                }
                },
                middleware: [
                    function (req, res, next) {
                        // Shopify sites with redirection enabled for custom domains force redirection
                        // to that domain. `?_fd=0` prevents that forwarding.
                        // ?pb=0 hides the Shopify preview bar
                        const prefix = req.url.indexOf('?') > -1 ? '&' : '?';
                        const queryStringComponents = ['_fd=0&pb=0'];
                        req.url += prefix + queryStringComponents.join('&');
                        next();
                    }
                ],
                files: [
                    {
                        match: [
                            'theme_ready'
                        ],
                        fn: function(event, file) {
                            if (event === "change") {
                                const bs = require('browser-sync').get('bs-webpack-plugin');
                                bs.reload();
                            }
                        }
                    }
                ]
            }, {
                reload: false
            })
        ]
    }
};