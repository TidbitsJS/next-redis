import { createCar } from "../../lib";

async function handler(req, res) {
  switch (req.method) {
    case "POST":
      const id = await createCar(req.body);
      res.status(200).json({ id });
      break;
    default:
      res.status(200).json({ message: "No such route request exist" });
  }
}

export default handler;
