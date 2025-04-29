import { Message } from 'kafkajs';
import { KafkaProducer } from '@shop/kafka-client/kafka-producer';

export class RpcService {
  private instance: RpcService | undefined;

  constructor(private readonly kafkaProducer: KafkaProducer) {
    if (!this.instance) {
      this.instance = new RpcService(kafkaProducer);
    }
    return this.instance;
  }

  async processMessage<T>(
    topic: string,
    message: Omit<Message, 'value'> & { value: T },
    partition?: number
  ): Promise<void> {
    const { key, value } = message;

    this.kafkaProducer.send(topic, {
      key: key ?? crypto.randomUUID(),
      value: JSON.stringify({ value }),
      partition,
    });
  }
}
