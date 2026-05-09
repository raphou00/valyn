// One-line JSON to stdout/stderr so Render's log search can filter by field.
// Use in route handlers and the WISMO pipeline. Replace bare console.* calls.

type Level = "info" | "warn" | "error";

const emit = (level: Level, msg: string, meta?: Record<string, unknown>) => {
    const line = JSON.stringify({
        ts: new Date().toISOString(),
        level,
        msg,
        ...meta,
    });
    if (level === "error") console.error(line);
    else console.log(line);
};

const logger = {
    info: (msg: string, meta?: Record<string, unknown>) => emit("info", msg, meta),
    warn: (msg: string, meta?: Record<string, unknown>) => emit("warn", msg, meta),
    error: (msg: string, meta?: Record<string, unknown>) => emit("error", msg, meta),
};

export default logger;
