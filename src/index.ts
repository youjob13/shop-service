import app from './app.js';
import { config } from './config.js';

const start = async () => {
  try {
    await app.listen({
      port: config.port,
      host: config.host,
    });
    app.log.info(`Server is running in ${config.env} mode on http://localhost:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
