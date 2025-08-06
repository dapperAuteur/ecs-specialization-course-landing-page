import pino from 'pino'; // Corrected: was 'pino-js'

const clientLogger = pino({
  browser: {
    asObject: true,
  },
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});

export default clientLogger;