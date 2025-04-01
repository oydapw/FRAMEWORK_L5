const EventEmitter = require("events");
const http = require("http");
const url = require("url");

class Framework {
  constructor() {
    this.server = this._createServer();
    this.emitter = new EventEmitter();
    this.middlewares = [];
  }

  listen(port, callback) {
    this.server.listen(port, callback);
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  addRouter(router) {
    Object.keys(router.endpoints).forEach((path) => {
      const endpoint = router.endpoints[path];
      Object.keys(endpoint).forEach((method) => {
        const handler = endpoint[method];
        this.emitter.on(this._getRouteMask(path, method), (req, res, next) => {
          handler(req, res, next);
        });
      });
    });
  }

  _createServer() {
    return http.createServer((req, res) => {
      let body = "";
      const parsedUrl = url.parse(req.url, true);

      req.body = "";
      req.params = {};
      req.query = parsedUrl.query;

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        if (body) {
          try {
            req.body = JSON.parse(body);
          } catch (e) {
            req.body = body;
          }
        }
        const pathParts = parsedUrl.pathname.split("/");
        const routeParts = parsedUrl.pathname.split("/");

        for (let i = 0; i < pathParts.length; i++) {
          if (routeParts[i].startsWith(":")) {
            req.params[routeParts[i].slice(1)] = pathParts[i];
          }
        }
        this._applyResMethods(res);
        let currentMiddlewareIndex = 0;
        const next = () => {
          if (currentMiddlewareIndex < this.middlewares.length) {
            const middleware = this.middlewares[currentMiddlewareIndex];
            currentMiddlewareIndex++;
            middleware(req, res, next);
          } else {
            const routeMask = this._getRouteMask(parsedUrl.pathname, req.method);
            const emitted = this.emitter.emit(routeMask, req, res, next);

            if (!emitted) {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Not Found" }));
            }
          }
        };

        next();
      });
    });
  }

  _getRouteMask(path, method) {
    return `[${path}]:[${method}]`;
  }

  _applyResMethods(res) {
    for (const method in this.resMethods) {
      res[method] = this.resMethods[method].bind(res);
    }
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