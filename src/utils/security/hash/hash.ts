import { SALT_ROUNDS } from "../../../config/env";
import { hash,compare } from "bcrypt";

export const hashText = async ({
  plainText,
  saltRounds = Number(SALT_ROUNDS),
}: {
  plainText: string;
  saltRounds?: number;
}): Promise<string> => {
  return await hash(plainText, saltRounds);
};
export const compareHash = async ({
  plainText,
  cipherText,
}: {
  plainText: string;
  cipherText: string;
}): Promise<boolean> => {
  return await compare(plainText, cipherText);
};
