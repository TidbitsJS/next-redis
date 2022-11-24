import { allCars, createCar } from "../../lib";

async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const cars = await allCars();
      res.status(200).json({ cars });
      break;
    case "POST":
      const id = await createCar(req.body);
      res.status(200).json({ id });
      break;
    default:
      res.status(200).json({ message: "No such route request" });
  }
}

export default handler;
