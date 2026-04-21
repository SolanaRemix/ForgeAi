import type { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err instanceof HttpError ? err.message : "Unexpected server error";

  if (!(err instanceof HttpError)) {
    console.error("Unexpected error handled by errorHandler:", err);
  }

  res.status(statusCode).json({
    error: {
      statusCode,
      message
    }
  });
}
