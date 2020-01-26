const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const firstAllowedCharacters = [
    '_', ...character_range('a', 'z')
];
const secondAllowedCharactersAfterDash = [
    '_', ...character_range('a', 'z')
];
const otherAllowedCharacters = [
    '_', '-', ...character_range('a', 'z'), ...character_range('0', '9')
];

module.exports = function(env) {
    const isDevServer = !!env.devServer;

    if(isDevServer) {
        return config(true, true, true);
    }
    else {
        const isDev = !!env.dev;

        return [
            config(true, isDev, isDevServer),
            config(false, isDev, isDevServer)
        ];
    }
};

const indentsMap = new Map();

function config(isClient, isDev, isDevServer) {
    const result = {
        mode: isDev ? "development" : "production",
        entry: path.resolve(__dirname, "src", "index." + (isClient ? "client" : "server") + ".tsx"),
        devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map',
        output: {
            path: isClient
                ? path.resolve(__dirname, "dist-client", "static")
                : path.resolve(__dirname, "dist-ssr"),
            publicPath: "/static/",
            filename: (isDev || !isClient) ? "[name].js" : "[chunkhash].js"
        },
        target: isClient ? "web" : "node",
        resolve: {
            extensions: [".ts", ".tsx", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.(t|j)sx?$/,
                    loader: "babel-loader",
                    include: [
                        path.resolve(__dirname, "src")
                    ],
                    options: {
                        sourceMaps: true
                    }
                },
                {
                    test: /\.css$/,
                    use: isClient ? [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: isDev
                            }
                        },
                        {
                            loader: "css-loader",
                            options: {
                                modules: {
                                    getLocalIdent: isDev ? getLocalIdentDev : getLocalIdentProd
                                },
                                sourceMap: true
                            }
                        }
                    ] : [
                        {
                            loader: "css-loader",
                            options: {
                                modules: {
                                    getLocalIdent: isDev ? getLocalIdentDev : getLocalIdentProd
                                },
                                onlyLocals: true
                            }
                        }
                    ],
                    include: [
                        path.resolve(__dirname, "src")
                    ]
                },
                {
                    test: /\.(jpe?g|png)$/,
                    loader: "file-loader",
                    options: {
                        emitFile: isClient,
                        name: isDev ? "[name]-[contenthash].[ext]" : "[contenthash].[ext]"
                    }
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: isDev ? '[name].css' : '[contenthash].css',
                chunkFilename: '[id].css',
                ignoreOrder: false
            })
        ],
        optimization: {
            minimize: !isDev && isClient
        }
    };

    if(!isDevServer) {
        result.plugins.push(
            new CleanWebpackPlugin({
                dry: false,
                cleanOnceBeforeBuildPatterns: isClient 
                    ? ["../**/*"]
                    : ["**/*"],
                dangerouslyAllowCleanPatternsOutsideProject: true
            })
        );
    }

    if(isClient) {
        result.devServer = {
            contentBase: path.join(__dirname, 'dist-client'),
            compress: true,
            historyApiFallback: {
                index: 'template.html'
            }
        };

        result.plugins.push(
            new HtmlWebpackPlugin({
                template: "src/index.html",
                filename: "../template.html"
            })
        );

        if(!isDev) {
            result.plugins.push(
                new OptimizeCssAssetsPlugin({
                    cssProcessorOptions: {
                        map: {
                            inline: false
                        }
                    }
                })
            );
        }
    }
    else {
        result.node = {
            __dirname: false,
            __filename: false
        };
    }

    return result;

    function getLocalIdentProd(context, localIdentName, localName, options) {
        const key = context.resourcePath + "@" + localName;

        let className = indentsMap.get(key);
        if (!className) {
            className = generateIdentifier(indentsMap.size);
            indentsMap.set(key, className);
        }

        return className;
    }

    function getLocalIdentDev(context, localIdentName, localName, options) {
        const key = context.resourcePath;

        let filePrefix = indentsMap.get(key);
        if (!filePrefix) {
            filePrefix = generateIdentifier(indentsMap.size);
            indentsMap.set(key, filePrefix);
        }

        return filePrefix + "-" + localName;
    }
}

function character_range(start, stop) {
    const startCodePoint = start.charCodeAt(0);
    const stopCodePoint = stop.charCodeAt(0);

    let result = new Array(stopCodePoint - startCodePoint + 1);
    for(let i = 0; i < result.length; i++) {
        result[i] = String.fromCharCode(startCodePoint + i)
    }

    return result;
}

function generateIdentifier(counter) {
    let charIdx = counter % firstAllowedCharacters.length;
    counter = (counter / firstAllowedCharacters.length) | 0;
    let result = firstAllowedCharacters[charIdx];

    if(counter > 0 && result == '-') {
        charIdx = counter % secondAllowedCharactersAfterDash.length;
        counter = (counter / secondAllowedCharactersAfterDash.length) | 0;
        result += secondAllowedCharactersAfterDash[charIdx];
    }

    while (counter > 0) {
        charIdx = counter % otherAllowedCharacters.length;
        counter = (counter / otherAllowedCharacters.length) | 0;
        result += otherAllowedCharacters[charIdx];
    }

    return result;
}