import { connect, createCar } from "../../../lib";

async function handler(req, res) {
  await connect();

  switch (req.method) {
    case "POST":
      try {
        const id = await createCar(req.body);
        res.status(200).json({ id });
      } catch (err) {
        res.status(400).json({ message: "Failed to create a car" });
      }
      break;
    default:
      console.log(req.params);
      res.status(200).json({ message: "No such route request exist" });
  }
}

export default handler;
