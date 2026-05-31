export type AppErrorOptions = {
  code?: string;
  details?: unknown;
};

export class AppError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status = 500, options: AppErrorOptions = {}) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = options.code;
    this.details = options.details;
  }
}
