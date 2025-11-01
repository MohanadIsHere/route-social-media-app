import { Model } from "mongoose"
import { DatabaseRepository } from "./database.repository"
import { IChat } from "../models"

export class ChatRepository extends DatabaseRepository<IChat> {
  constructor(protected override readonly  model: Model<IChat>){
    super(model)
  }
}