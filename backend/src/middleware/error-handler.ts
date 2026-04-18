import type { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Unexpected server error";

  res.status(statusCode).json({
    error: {
      statusCode,
      message
    }
  });
}
