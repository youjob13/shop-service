import { KafkaConfig, ProducerConfig } from 'kafkajs';

import { initKafkaClient } from 'src/init.js';
import { KafkaProducer } from './kafka-producer.js';

let producer: KafkaProducer;

export function initKafkaProducer(config: KafkaConfig, producerConfig?: ProducerConfig) {
  if (!producer) {
    const kafka = initKafkaClient(config);
    producer = new KafkaProducer(kafka, producerConfig);
  }

  return producer;
}

export { KafkaProducer };
