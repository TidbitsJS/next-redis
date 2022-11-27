import { connect, createIndex } from "../../lib";

// one time operation that needs to be done whenever the schema changes
async function handler(req, res) {
  await connect();

  await createIndex();
  res.status(200).send("ok");
}

export default handler;
