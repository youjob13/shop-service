import { KafkaConfig, ProducerConfig } from 'kafkajs';

import { initKafkaClient } from '../init.js';
import { KafkaProducer } from './kafka-producer.js';

let producer: KafkaProducer;

function initKafkaProducer(config: KafkaConfig, producerConfig?: ProducerConfig): KafkaProducer {
  if (!producer) {
    const kafka = initKafkaClient(config);
    producer = new KafkaProducer(kafka, producerConfig);
  }

  return producer;
}

export { initKafkaProducer, KafkaProducer };
