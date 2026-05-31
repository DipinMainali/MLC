type LogContext = Record<string, unknown>;

function formatContext(context?: LogContext) {
  if (!context || Object.keys(context).length === 0) {
    return "";
  }

  return JSON.stringify(context);
}

function writeLog(
  level: "debug" | "info" | "warn" | "error",
  message: string,
  context?: LogContext,
) {
  const payload = formatContext(context);

  if (payload) {
    console[level](message, context);
    return;
  }

  console[level](message);
}

export const logger = {
  debug(message: string, context?: LogContext) {
    writeLog("debug", message, context);
  },
  info(message: string, context?: LogContext) {
    writeLog("info", message, context);
  },
  warn(message: string, context?: LogContext) {
    writeLog("warn", message, context);
  },
  error(message: string, context?: LogContext) {
    writeLog("error", message, context);
  },
};
