import { Producer, Kafka, ProducerConfig, Message, ProducerBatch, TopicMessages } from 'kafkajs';

export class KafkaProducer {
  private producer: Producer;

  constructor(kafka: Kafka, config?: ProducerConfig) {
    this.producer = kafka.producer({
      allowAutoTopicCreation: false,
      transactionTimeout: 30000,
      retry: {
        retries: 3,
        initialRetryTime: 100,
      },
      ...config,
    });
  }

  async connect() {
    await this.producer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
  }

  async send(topic: string, message: Message | Message[]) {
    await this.producer.send({
      topic,
      messages: Array.isArray(message) ? message : [message],
    });
  }

  async sendDLQ(topic: string, message: Message | Message[]) {
    await this.send(`${topic}-dlq`, message);
  }

  async sendBatch(messages: TopicMessages[], config?: Omit<ProducerBatch, 'topicMessages'>) {
    await this.producer.sendBatch({ topicMessages: messages, ...config });
  }
}
