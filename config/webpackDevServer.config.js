'use strict';

const fs = require('fs');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const paths = require('./paths');
const getHttpsConfig = require('./getHttpsConfig');

const host = process.env.HOST || '0.0.0.0';

module.exports = function(proxy, allowedHost) {
  return {
    // WebpackDevServer 2.4.3 introduced a security fix that prevents remote
    // websites from potentially accessing local content through DNS rebinding:
    // https://github.com/webpack/webpack-dev-server/issues/887
    // https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
    // However, it made several existing use cases such as development in cloud
    // environment or subdomains in development significantly more complicated:
    // https://github.com/facebook/create-react-app/issues/2271
    // https://github.com/facebook/create-react-app/issues/2233
    // While we're investigating better solutions, for now we will take a
    // compromise. Since our WDS configuration only serves files in the `public`
    // folder we won't consider accessing them a vulnerability. However, if you
    // use the `proxy` feature, it gets more dangerous because it can expose
    // remote code execution vulnerabilities in backends like Django and Rails.
    // So we will disable the host check normally, but enable it if you have
    // specified the `proxy` setting. Finally, we let you override it if you
    // really know what you're doing with a special environment variable.
    allowedHosts: 
      (!proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true') ? "all" : "auto",
    // Enable gzip compression of generated files.
    compress: true,
    // Enable hot reloading server. It will provide WDS_SOCKET_PATH endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. The WebpackDevServer client is included as an entry point
    // in the webpack development configuration. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: true,
    // Use 'ws' instead of 'sockjs-node' on server since we're using native
    // websockets in `webpackHotDevClient`.
    webSocketServer: 'ws',
    client: {
      // Silence WebpackDevServer's own logs since they're generally not useful.
      // It will still show compile warnings and errors with this setting.
      logging: 'none',
      // Enable custom sockjs pathname for websocket connection to hot reloading server.
      // Enable custom sockjs hostname, pathname and port for websocket connection
      // to hot reloading server.
      webSocketURL: {
        hostname: process.env.WDS_SOCKET_HOST,
        pathname: process.env.WDS_SOCKET_PATH,
        port: process.env.WDS_SOCKET_PORT
      }
    },
    https: getHttpsConfig(),
    host,
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebook/create-react-app/issues/387.
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    // `proxy` is run between `before` and `after` `webpack-dev-server` hooks
    proxy,
    setupMiddlewares(middlewares, devServer) {
      middlewares.unshift({
        name: 'onBeforeSetupMiddleware',
        middleware: (req, res, next) => {
          // Keep `evalSourceMapMiddleware` and `errorOverlayMiddleware`
          // middlewares before `redirectServedPath` otherwise will not have any effect
          // This lets us fetch source contents from webpack for the error overlay
          devServer.app.use(evalSourceMapMiddleware(devServer));
          // This lets us open files from the runtime error overlay.
          devServer.app.use(errorOverlayMiddleware());

          if (fs.existsSync(paths.proxySetup)) {
            // This registers user provided middleware for proxy reasons
            require(paths.proxySetup)(app);
          }

          next();
        },
      });

      middlewares.push({
        name: 'onAfterSetupMiddleware',
        middleware: (req, res, next) => {
          // Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
          devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

          // This service worker file is effectively a 'no-op' that will reset any
          // previous service worker registered for the same host:port combination.
          // We do this in development to avoid hitting the production cache if
          // it used the same host and port.
          // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
          devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));

          next();
        },
      });

      return middlewares;
    },
  };
};
