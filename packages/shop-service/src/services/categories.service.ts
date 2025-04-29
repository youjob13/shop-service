export class CategoriesService {
  constructor(private readonly kafkaProducer: KafkaProducer) {}

  async createCategory(category: Category) {
    return this.kafkaProducer.send('categories', category);
  }
}
