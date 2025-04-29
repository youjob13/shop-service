import { initKafkaConsumer } from '@shop/kafka-client/kafka-consumer';

export abstract class BaseHandler {
  constructor(protected readonly kafkaConsumer: ReturnType<typeof initKafkaConsumer>) {
    this.init();
  }

  protected abstract init(): Promise<void>;
}
