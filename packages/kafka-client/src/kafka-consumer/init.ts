import { ConsumerConfig, KafkaConfig, Logger } from 'kafkajs';
import { KafkaConsumer } from './kafka-consumer.js';
import { initKafkaClient } from '../init.js';
import { initKafkaProducer } from '../kafka-producer/init.js';

let consumer: KafkaConsumer;

export async function initKafkaConsumer(
  config: KafkaConfig,
  consumerConfig: ConsumerConfig & { logger: Omit<Logger, 'namespace' | 'setLogLevel'> }
): Promise<KafkaConsumer> {
  if (!consumer) {
    const kafka = initKafkaClient(config);
    console.log('DEBUG. INIT KAFKA CONSUMER');
    const producer = initKafkaProducer(config);
    await producer.connect();
    console.log('DEBUG. CONNECTED TO KAFKA PRODUCER');
    consumer = new KafkaConsumer(kafka, consumerConfig, producer);
    await consumer.connect();
    console.log('DEBUG. CONNECTED TO KAFKA CONSUMER');
  }

  return consumer;
}
