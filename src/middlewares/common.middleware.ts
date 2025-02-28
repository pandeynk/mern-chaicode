// src/validators/common.validator.ts
import Joi from "joi";

// ID validation schema (for path params)
export const idValidation = Joi.object({
  id: Joi.number().integer().required(),
});

// Pagination validation schema (for query params)
export const paginationValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().optional(),
  order: Joi.string().valid("asc", "desc").default("asc"),
});

// Search validation schema (for query params)
export const searchValidation = Joi.object({
  q: Joi.string().min(1).max(50).required(),
  in: Joi.string().valid("title", "description", "all").default("all"),
}).concat(paginationValidation);

// Date range validation (for query params)
export const dateRangeValidation = Joi.object({
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")),
});
