const EventEmitter = require("events");
const http = require("http");
const url = require("url");

class Framework {
  constructor() {
    this.server = this._createServer();
    this.emitter = new EventEmitter();
    this.middlewares = [];
    this.errorHandlers = [];
    this.routes = {};
  }

  listen(port, callback) {
    this.server.listen(port, callback);
  }

  use(middleware) {
    if (middleware.length === 4) {
      this.errorHandlers.push(middleware);
    } else {
      this.middlewares.push(middleware);
    }
  }

  addRouter(router) {
    if (router.endpoints) {
      Object.keys(router.endpoints).forEach((path) => {
        const endpoint = router.endpoints[path];
        Object.keys(endpoint).forEach((method) => {
          const handler = endpoint[method];
          this.addRoute(method, path, handler);
        });
      });
    } else {
      console.error('Роутер не работает');
    }
  }

  addRoute(method, path, handler) {
    if (!this.routes[path]) {
      this.routes[path] = {};
    }
    this.routes[path][method] = handler;
  }

  _createServer() {
    return http.createServer(async (req, res) => {
      this._applyResMethods(res);

      const parsedUrl = url.parse(req.url, true);
      const { pathname } = parsedUrl;

      req.query = parsedUrl.query;
      req.body = await this.parseBody(req);
      req.params = {};

      let currentMiddlewareIndex = 0;
      const next = (err) => {
        if (err) {
          return this._handleError(err, req, res);
        }

        if (currentMiddlewareIndex < this.middlewares.length) {
          const middleware = this.middlewares[currentMiddlewareIndex];
          currentMiddlewareIndex++;
          middleware(req, res, next);
        } else {
          let routeFound = false;

          for (const routePath in this.routes) {
            const routeMethodHandlers = this.routes[routePath];

            if (routeMethodHandlers[req.method]) {
              const routeRegex = this.createRouteRegex(routePath);
              const match = pathname.match(routeRegex);

              if (match) {
                req.params = this.extractParams(routePath, pathname);
                routeFound = true;
                return routeMethodHandlers[req.method](req, res);
              }
            }
          }

          if (!routeFound) {
            res.status(404).json({ error: "Не найдено" });
          }
        }
      };

      next();
    });
  }

  _applyResMethods(res) {
    for (const method in this.resMethods) {
      res[method] = this.resMethods[method].bind(res);
    }
  }

  _handleError(err, req, res) {
    let errorHandlerIndex = 0;
    const next = () => {
      if (errorHandlerIndex < this.errorHandlers.length) {
        const errorHandler = this.errorHandlers[errorHandlerIndex];
        errorHandlerIndex++;
        errorHandler(err, req, res, next);
      } else {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Ошибка" }));
      }
    };
    next();
  }

  parseBody(req) {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({});
        }
      });
    });
  }

  createRouteRegex(routePath) {
    const regexPattern = routePath.replace(/:[\w]+/g, '([\\w-]+)');
    return new RegExp(`^${regexPattern}$`);
  }

  extractParams(routePath, pathname) {
    const paramNames = routePath.match(/:[\w]+/g)?.map((param) => param.slice(1)) || [];
    const paramValues = pathname.match(this.createRouteRegex(routePath))?.slice(1) || [];

    const params = {};
    paramNames.forEach((name, index) => {
      params[name] = paramValues[index];
    });

    return params;
  }
}

Framework.prototype.resMethods = {
  send(status, body) {
    if (typeof status === "number") {
      this.writeHead(status);
      this.end(body);
    } else {
      this.writeHead(200);
      this.end(status);
    }
  },
  json(data) {
    this.writeHead(200, { "Content-Type": "application/json" });
    this.end(JSON.stringify(data));
  },
  status(code) {
    this.writeHead(code);
    return this;
  }
};

module.exports = Framework;
