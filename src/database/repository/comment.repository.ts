import { Model } from "mongoose"
import { DatabaseRepository } from "./database.repository"
import { IComment } from "../models"

export class CommentRepository extends DatabaseRepository<IComment> {
  constructor(protected override readonly  model: Model<IComment>){
    super(model)
  }
}