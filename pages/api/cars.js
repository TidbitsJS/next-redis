import { allCars } from "../../lib";

async function handler(req, res) {
  try {
    const cars = await allCars();
    res.status(200).json(cars);
  } catch (err) {
    res.status(400).json({ message: "Failed to get all cars" });
  }
}

export default handler;
