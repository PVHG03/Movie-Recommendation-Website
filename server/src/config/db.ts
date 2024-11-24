import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";
import neo4jClient from "../utils/Neo4j";

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI).then(() => {
      console.log(`Connected to the database ${MONGO_URI}`);
    });

    await neo4jClient.getInstance().then((instance) => {
      instance.getServerInfo().then((info) => {
        console.log(`Connected to the database ${info.address}`);
      });
    });
  } catch (error) {
    console.log("Error connecting to the database: ", error);
    process.exit(1);
  }
};

export default connectToDB;
