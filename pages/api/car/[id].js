import { connect, deleteCar, findCar, updateCar } from "../../../lib";

async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await connect();

  switch (method) {
    case "GET":
      try {
        const car = await findCar(id);
        console.log("car", car);

        if (car.title) {
          res.status(200).json(car);
        } else {
          res.status(404).json({ message: "Car does not exist" });
        }
      } catch (err) {
        res.status(400).json({ message: "Failed to fetch the car info" });
      }
      break;

    case "PUT":
      try {
        const car = await updateCar(id, req.body);

        if (car.title) {
          res.status(200).json(car);
        } else {
          res.status(404).json({ message: "Car does not exist" });
        }
      } catch (err) {
        res.status(400).json({ message: "Failed to update the car info" });
      }
      break;

    case "DELETE":
      try {
        await deleteCar(id);
        res.status(200).json({ message: `${id} deleted` });
      } catch (err) {
        res.status(400).json({ message: "Failed to delete the car info" });
      }
      break;

    default:
      res.status(200).json({ message: "No such route request exist" });
  }
}

export default handler;
