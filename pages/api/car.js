import { createCar } from "../../lib";

async function handler(req, res) {
  console.log(req.body);

  const id = await createCar(req.body);
  res.status(200).json({ id });
}

export default handler;
