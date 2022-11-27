import { connect, searchCars } from "../../../lib";

async function handler(req, res) {
  await connect();

  switch (req.method) {
    case "GET":
      try {
        const cars = await searchCars(req.query.term);
        res.status(200).json(cars);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
      break;
    default:
      console.log(req.params);
      res.status(200).json({ message: "No such route request exist" });
  }
}

export default handler;
