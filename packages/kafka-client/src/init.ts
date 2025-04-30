import { Kafka, KafkaConfig } from 'kafkajs';

let kafka: Kafka;

export function initKafkaClient(config: KafkaConfig) {
  if (!kafka) {
    kafka = new Kafka({ ...config, brokers: ['kafka:9092'] });
  }

  return kafka;
}
