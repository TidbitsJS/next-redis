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
let carSchema = new Schema(Car, {
  title: { type: "string" },
  brand: { type: "string" },
  price: { type: "number" },
  capacity: { type: "number" },
  type: { type: "string" },
  image: { type: "string" },
  description: { type: "text" },
});

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

/**
 * 
  {
    "title": "Ferrari F8 Spider",
    "brand": "Ferrari",
    "price": 274000,
    "capacity": 2,
    "type": "Roadster",
    "image": "https://cdni.autocarindia.com/Utils/ImageResizer.ashx?n=https://cdni.autocarindia.com/ExtraImages/20190909120157_Ferrari-F8_Spider-front.jpg",
    "description": "In all likelihood, the F8 Tributo will go down as the last Ferrari sports car ever to feature a mid-mounted V8 engine. As the name suggests, this model is a tribute to the Italian automaker’s past and present. Available with a fixed or retractable top, the F8 delivers as much as 710 horsepower and 568 pound-feet of torque. These numbers are good enough to sprint from 0-100 km/h in just 2.9 seconds. Must buy!"
  }
  {
    "title": "Porsche Panamera",
    "brand": "Porsche",
    "price": 228900,
    "capacity": 4,
    "type": "Sedan",
    "image": "https://media.porsche.com/mediakit/panamera/Pictures/Panamera_Outdoor/image-thumb__4957__mk2-modal-item/P20_0428_a3_rgb.jpg",
    "description": "Following a round of updates last year, the biggest change Porsche has made to the Panamera for 2022 was adding Android Auto. Like every other vehicle in the German automaker’s lineup, this luxury sedan offers a wide array of models and powertrains including explosive plug-in hybrid variants with as much as 690 horsepower. Let’s not forget the Panamera Sport Turismo, a wagon-style alternative for sporty drivers seeking extra versatility. Sure buy!"
  }
 *
**/
