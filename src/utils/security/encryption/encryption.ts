import { AES } from "crypto-js";
import { ENCRYPTION_KEY } from "../../../config/env";

export const encryptText = ({
  cipherText,
  encryptionKey = ENCRYPTION_KEY as string,
}: {
  cipherText: string;
  encryptionKey?: string;
}): string => {
  return AES.encrypt(cipherText, encryptionKey).toString();
};
export const decryptText = ({
  cipherText,
  encryptionKey = ENCRYPTION_KEY as string,
}: {
  cipherText: string;
  encryptionKey?: string;
}): string => {
  return AES.decrypt(cipherText, encryptionKey).toString();
};
