import { app, kafkaConsumerPromise } from './app.js';
import { config as Config } from './config.js';

const start = async (): Promise<void> => {
  try {
    await app.listen({
      port: Config.PORT,
      host: Config.HOST,
    });
    app.log.info(`Server is running in ${Config.ENV} mode on http://localhost:${Config.PORT}`);

    await kafkaConsumerPromise;
    app.log.info(`Kafka consumer is running`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
