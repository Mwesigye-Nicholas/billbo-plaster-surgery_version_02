import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

type Page = {
  page: number;
  limit: number;
};

// reusable pagination middleware, not yet completed

const pagination = async (resultsToPaginate: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const pageValue = req.query.page;
    const limitValue = req.query.page;

    const page =
      typeof pageValue === "string" && parseInt(pageValue, 10) > 0
        ? parseInt(pageValue, 10)
        : 1;

    const limit =
      typeof limitValue === "string" && parseInt(limitValue, 10) > 0
        ? parseInt(limitValue, 10)
        : 20;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    if (endIndex > resultsToPaginate.length) {
      const nextPage: Page = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      const previousPage: Page = {
        page: page - 1,
        limit: limit,
      };
    }

     const results = resultsToPaginate.slice(startIndex, endIndex);
     
     res.paginatedResults = results;
  };
};

export default pagination;
