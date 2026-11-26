const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      const error = new Error("Validation failed");
      error.statusCode = 400;
      error.details = result.error.issues;

      return next(error);
    }

    if (property === "query" || property === "params") {
      res.locals.validated = res.locals.validated || {};
      res.locals.validated[property] = result.data;
    } else {
      req[property] = result.data;
    }

    next();
  };
};

export default validate;
