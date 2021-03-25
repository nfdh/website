const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { DefinePlugin } = require('webpack');

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
	if(env.WEBPACK_SERVE) {
        return config(true, true);
    }
    else {
		const isDev = !!env.dev;

        return [
            config(true, isDev),
            config(false, isDev)
        ];
    }
};

const indentsMap = new Map();

function config(isClient, isDev) {
    const result = {
        mode: isDev ? "development" : "production",
        entry: path.resolve(__dirname, "src", "index." + (isClient ? "client" : "server") + ".tsx"),
        devtool: isDev ? 'eval-cheap-module-source-map' : 'hidden-source-map',
        output: {
            path: isClient
                ? path.resolve(__dirname, "dist-client", "static")
                : path.resolve(__dirname, "dist-ssr"),
            publicPath: "/static/",
            filename: (isDev || !isClient) ? "[name].js" : "[chunkhash].js",
			assetModuleFilename: isDev ? "[name]-[contenthash][ext]" : "[contenthash][ext]",
			clean: true
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
                            loader: MiniCssExtractPlugin.loader
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
                                    getLocalIdent: isDev ? getLocalIdentDev : getLocalIdentProd,
									exportOnlyLocals: true
                                }
                            }
                        }
                    ],
                    include: [
                        path.resolve(__dirname, "src")
                    ]
                },
                {
                    test: /\.(jpe?g|png)$/,
					type: 'asset/resource',
					generator: {
						emit: isClient
					}
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: isDev ? '[name].css' : '[contenthash].css',
                chunkFilename: '[id].css',
                ignoreOrder: false
            }),
            new DefinePlugin({
                "process.env.SSR": !isClient
            })
        ],
        optimization: {
            minimize: !isDev && isClient,
			minimizer: [
				`...`,
				new CssMinimizerPlugin()
			]
        }
    }; 

    if(isClient) {
        result.devServer = {
  			static: path.join(__dirname, 'dist-client'),
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
        let key = path.relative(__dirname, context.resourcePath);
		key = key.replace(/(\.|\\|\/)/gi, '\\$1');
        return key + "-" + localName;
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
