const modules = require("../config/modules");
const paths = require("../config/paths");

const hasJsxRuntime = (() => {
    if (process.env.DISABLE_NEW_JSX_TRANSFORM === "true") {
        return false;
    }

    try {
        require.resolve("react/jsx-runtime");
        return true;
    } catch (e) {
        return false;
    }
})();

module.exports = ({ config }) => {
    config.module.rules.push(
        {
            test: /\.(scss|sass)$/,
            exclude: /\.module\.(scss|sass)$/,
            use: ["style-loader", "css-loader", "sass-loader"],
            sideEffects: true
        },
        {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve("babel-loader"),
            options: {
                customize: require.resolve(
                    "babel-preset-react-app/webpack-overrides"
                ),
                presets: [
                    [
                        require.resolve("babel-preset-react-app"),
                        {
                            runtime: hasJsxRuntime ? "automatic" : "classic"
                        }
                    ]
                ],

                plugins: [
                    [
                        require.resolve("babel-plugin-named-asset-import"),
                        {
                            loaderMap: {
                                svg: {
                                    ReactComponent:
                                        "@svgr/webpack?-svgo,+titleProp,+ref![path]"
                                }
                            }
                        }
                    ]
                ].filter(Boolean),
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                compact: false
            }
        }
    );
    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.modules = ["node_modules", paths.appNodeModules].concat(
        modules.additionalModulePaths || []
    );
    return config;
};
