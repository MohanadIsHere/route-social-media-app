import { connect } from "mongoose";
import { DB_URI } from "../config/env";
import chalk from "chalk";
import { User } from "./models/user.model";

const connectToDatabase = async (): Promise<void> => {
  try {
    await connect(DB_URI as unknown as string);
    await User.syncIndexes();
    console.log(
      chalk.green.bold("Connected to MongoDB Server Successfully ✅")
    );
  } catch (error) {
    console.error(chalk.red.bold("Error connecting to MongoDB Server:"), error);
  }
};
export default connectToDatabase;
