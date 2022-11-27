import { Client, Entity, Schema, Repository } from "redis-om";

const client = new Client();

export async function connect() {
  console.log("connecting to redis...");

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
    description: { type: "text" },
  },
  {
    dataStructure: "JSON",
  }
);

export async function createIndex() {
  const repository = new Repository(carSchema, client);
  await repository.createIndex();
}

// save a document
export async function createCar(data) {
  const carRepository = client.fetchRepository(carSchema);
  const car = carRepository.createEntity(data);

  const id = await carRepository.save(car);

  return id;
}

// display all keys
export async function allCars() {
  const carRepository = client.fetchRepository(carSchema);
  const cars = await carRepository.search().return.all();

  return cars;
}

// find car
export async function findCar(id) {
  const carRepository = client.fetchRepository(carSchema);
  const car = await carRepository.fetch(id);

  return car;
}

/**
 * Search item in all repositories
 * @param {number} id
 * @returns {object} car
 *
 * export async function findCar(id) {
 *   const car = await client.jsonget(`Car:${id}`)
 *   return car
 * }
 **/

// update car
export async function updateCar(id, reqBody) {
  const carRepository = client.fetchRepository(carSchema);
  const car = await carRepository.fetch(id);

  if (car.title) {
    car.title = reqBody.title ?? car.title;
    car.brand = reqBody.brand ?? car.brand;
    car.price = reqBody.price ?? car.price;
    car.capacity = reqBody.capacity ?? car.capacity;
    car.type = reqBody.type ?? car.type;
    car.image = reqBody.image ?? car.image;
    car.description = reqBody.description ?? car.description;

    await carRepository.save(car);
  }

  return car;
}

// delete document
export async function deleteCar(id) {
  const carRepository = client.fetchRepository(carSchema);
  await carRepository.remove(id);
}

// search cars
export async function searchCars(term) {
  const carRepository = client.fetchRepository(carSchema);

  const cars = await carRepository
    .search()
    .where("title")
    .equals(term)
    .or("brand")
    .equals(term)
    .or("description")
    .matches(term)
    .return.all();

  return cars;
}
