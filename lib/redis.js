import { Client, Entity, Schema, Repository } from "redis-om";

const client = new Client();

async function connect() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
  }
}

// define a schema
class Car extends Entity {}
let carSchema = new Schema(
  Car,
  {
    title: { type: "string" },
    brand: { type: "string" },
    price: { type: "number" },
    capacity: { type: "number" },
    type: { type: "string" },
    image: { type: "string" },
    description: { type: "string", textSearch: true },
  },
  {
    dataStructure: "JSON",
  }
);

// save a document
export async function createCar(data) {
  await connect();

  const repository = client.fetchRepository(carSchema);
  const car = repository.createEntity(data);
  const id = await repository.save(car);

  return id;
}
