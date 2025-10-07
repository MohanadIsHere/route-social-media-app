import { Model } from "mongoose"
import { DatabaseRepository } from "./database.repository"
import { IPost } from "../models"

export class PostRepository extends DatabaseRepository<IPost> {
  constructor(protected override readonly  model: Model<IPost>){
    super(model)
  }
}