const isDev = process.env.NODE_ENV !== 'production';


const SENSITIVE_FIELDS = new Set(['password', 'token', 'accessToken', 'refreshToken', 'secret', 'authorization']);

const sanitize = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => !SENSITIVE_FIELDS.has(key))
      .map(([key, val]) => [key, typeof val === 'object' ? sanitize(val) : val])
  );
};

const formatLog = (level, message, context = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...sanitize(context)
  };


  if (isDev) {
    const colors = { error: '\x1b[31m', warn: '\x1b[33m', info: '\x1b[36m', debug: '\x1b[90m' };
    const reset = '\x1b[0m';
    const color = colors[level] || '';
    const contextStr = Object.keys(context).length
      ? ' ' + JSON.stringify(sanitize(context))
      : '';
    return `${color}[${entry.timestamp}] ${level.toUpperCase()}: ${message}${contextStr}${reset}`;
  }


  return JSON.stringify(entry);
};


const fromRequest = (req) => {
  if (!req) return {};
  return {
    method: req.method,
    path: req.path,
    userId: req.user?.id || null,
    ip: req.ip
  };
};

const logger = {
  error: (message, context = {}) => {
    const { error, ...rest } = context;
    const ctx = {
      ...rest,
      ...(error && {
        errorMessage: error.message,
        stack: error.stack
      })
    };
    console.error(formatLog('error', message, ctx));
  },

  warn: (message, context = {}) => {
    console.warn(formatLog('warn', message, context));
  },

  info: (message, context = {}) => {
    console.info(formatLog('info', message, context));
  },

  debug: (message, context = {}) => {
    if (isDev) console.debug(formatLog('debug', message, context));
  },


  logRequest: (message, req, error) => {
    logger.error(message, { ...fromRequest(req), error });
  }
};

module.exports = logger;