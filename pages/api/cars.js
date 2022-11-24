import { allCars } from "../../lib";

async function handler(req, res) {
  try {
    const cars = await allCars();
    res.status(200).json(cars);
  } catch (err) {
    re.status(400).json({ message: err.message });
  }
}

export default handler;
