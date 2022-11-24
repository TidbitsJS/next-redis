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

export async function createIndex() {
  await connect();

  const repository = new Repository(carSchema, client);
  await repository.createIndex();
}

// save a document
export async function createCar(data) {
  await connect();

  const repository = client.fetchRepository(carSchema);
  const car = repository.createEntity(data);
  const id = await repository.save(car);

  return id;
}

// display all keys
export async function allCars() {
  await connect();

  const repository = client.fetchRepository(carSchema);
  const cars = await repository.search().return.all();

  return cars;
}

// find car
export async function findCar(id) {
  await connect();

  const repository = client.fetchRepository(carSchema);
  const car = await repository.fetch(id);

  // OR
  // const car = await client.jsonget(`Car:${id}`);

  return car;
}
