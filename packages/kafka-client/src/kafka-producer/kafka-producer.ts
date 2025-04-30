import { Producer, Kafka, ProducerConfig, Message, ProducerBatch, TopicMessages } from 'kafkajs';

type KafkaMessage<TPayload> = Omit<Message, 'value'> & { value: TPayload };

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

  async send<TPayload>(topic: string, message: KafkaMessage<TPayload> | KafkaMessage<TPayload>[]) {
    const messages = Array.isArray(message) ? message : [message];
    await this.producer.send({
      topic,
      messages: messages.map((message) => ({
        ...message,
        value: JSON.stringify(message.value),
      })),
    });
  }

  async sendDLQ(topic: string, message: Message | Message[]) {
    await this.send(`${topic}-dlq`, message);
  }

  async sendBatch(messages: TopicMessages[], config?: Omit<ProducerBatch, 'topicMessages'>) {
    await this.producer.sendBatch({ topicMessages: messages, ...config });
  }
}
