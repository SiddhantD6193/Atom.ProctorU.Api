const Ajv = require('ajv');

class SchemaValidator {
  constructor() {
    this.ajv = new Ajv({ allErrors: true });
  }

  validateBody(schema) {
    const validate = this.ajv.compile(schema);
    return async (ctx, next) => {
      const valid = validate(ctx.request.body);
      if (!valid) {
        ctx.status = 400;
        ctx.body = {
          message: 'Invalid request body',
          errors: validate.errors
        };
        return;
      }
      await next();
    };
  }
}

module.exports = SchemaValidator;
