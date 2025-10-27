import { IMainDto } from "../../gateway";


export interface ISayHiDto extends IMainDto {
  message: string;
  
}