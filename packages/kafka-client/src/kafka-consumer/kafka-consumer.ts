import { Consumer, Kafka, Logger, Message } from 'kafkajs';

import { ConsumerConfig } from 'kafkajs';
import { KafkaProducer } from '../kafka-producer/kafka-producer.js';

const DEFAULT_RETRIES = 3;

export class KafkaConsumer {
  private consumer: Consumer;
  private MAX_RETRIES: number;
  private logger: Omit<Logger, 'namespace' | 'setLogLevel'>;

  constructor(
    kafka: Kafka,
    config: ConsumerConfig & { logger: Omit<Logger, 'namespace' | 'setLogLevel'> },
    private producer: KafkaProducer
  ) {
    this.consumer = kafka.consumer(config);
    this.MAX_RETRIES = config.retry?.retries ?? DEFAULT_RETRIES;
    this.logger = config.logger;
  }

  async connect(): Promise<void> {
    await this.consumer.connect();
    this.logger.info(`[KafkaConsumer] Connected to Kafka`);
  }

  async subscribe<TPayload>(
    topic: string,
    callback: (message: Omit<Message, 'value'> & { value: TPayload }) => Promise<void>
  ): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: true });
    this.logger.info(`[KafkaConsumer] Subscribed to topic: ${topic}`);

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const parsedMessage = JSON.parse(message.value?.toString() ?? '{}');

        let attempt = 0;
        while (attempt < this.MAX_RETRIES) {
          try {
            await callback(parsedMessage);
            break;
          } catch (error) {
            attempt++;

            console.error(
              `[KafkaConsumer] Error processing message, attempt ${attempt} of ${this.MAX_RETRIES}: ${error}`
            );

            if (attempt >= this.MAX_RETRIES) {
              console.info(`[KafkaConsumer] Sending message to DLQ: ${topic}`);

              await this.producer.sendDLQ(topic, parsedMessage);
            }
          }
        }
      },
    });
  }
}
