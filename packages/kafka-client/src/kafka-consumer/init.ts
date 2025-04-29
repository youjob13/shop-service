import { ConsumerConfig, KafkaConfig, Logger } from 'kafkajs';
import { KafkaConsumer } from './kafka-consumer.js';
import { initKafkaClient } from 'src/init.js';
import { initKafkaProducer } from '../kafka-producer/init.js';

let consumer: KafkaConsumer;

export async function initKafkaConsumer(
  config: KafkaConfig,
  consumerConfig: ConsumerConfig & { logger: Omit<Logger, 'namespace' | 'setLogLevel'> }
) {
  if (!consumer) {
    const kafka = initKafkaClient(config);
    const producer = initKafkaProducer(config);
    consumer = new KafkaConsumer(kafka, consumerConfig, producer);
  }

  await consumer.connect();

  return consumer;
}
