export function RouterLoggerMiddleware(req, res,next,) {
    logger.debug(`${req.method} ${req.originalUrl}`);
    next();
  }
