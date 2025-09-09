import { type Secret, sign, type SignOptions } from "jsonwebtoken";
import {
  ACCESS_TOKEN_ADMIN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_USER_SECRET,
  REFRESH_TOKEN_ADMIN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_USER_SECRET,
} from "../../config/env";
import {
  type HydratedUserDoc,
  UserRoles,
} from "../../database/models/user.model";
export enum SignatureLevelsEnum {
  Bearer = "Bearer",
  System = "System",
}
export const generateToken = ({
  payload,
  secret = ACCESS_TOKEN_USER_SECRET as string,
  options = { expiresIn: Number(ACCESS_TOKEN_EXPIRES_IN) },
}: {
  payload: object;
  secret?: Secret;
  options?: SignOptions;
}): string => {
  return sign({ ...payload }, secret, options);
};
// export const verifyToken = ({ token, secret } = {}) => {
//   return jwt.verify(token, secret);
// };

export const detectSignatureLevel = (
  role: UserRoles = UserRoles.user
): SignatureLevelsEnum => {
  let signatureLevel: SignatureLevelsEnum = SignatureLevelsEnum.Bearer; // default to user
  switch (
    role // determine signature level based on role
  ) {
    case UserRoles.admin:
      signatureLevel = SignatureLevelsEnum.System; // admin
      break;
    default:
      signatureLevel = SignatureLevelsEnum.Bearer; // user
      break;
  }
  
  return signatureLevel; // return signature level either admin(System) or user(Bearer)
};
export const getSignatures = (
  signatureLevel: SignatureLevelsEnum = SignatureLevelsEnum.Bearer // default to user(Bearer)
): { access_signature: string; refresh_signature: string } => {
  let signatures: { access_signature: string; refresh_signature: string } = {
    access_signature: "",
    refresh_signature: "", // default empty
  };

  switch (signatureLevel) {
    case SignatureLevelsEnum.System: // dealing with an admin
      signatures.access_signature = ACCESS_TOKEN_ADMIN_SECRET as string; // define admin access signature
      signatures.refresh_signature = REFRESH_TOKEN_ADMIN_SECRET as string; // define admin refresh signature
      break;
    default: // dealing with a user
      signatures.access_signature = ACCESS_TOKEN_USER_SECRET as string; // define user access signature
      signatures.refresh_signature = REFRESH_TOKEN_USER_SECRET as string; // define user refresh signature
      break;
  }
  return signatures; // return the signatures either for admin or user
};
export const createLoginCredentials = (
  user: HydratedUserDoc
): { accessToken: string; refreshToken: string } => {
  // detect signature level based on user role either admin or user
  const signatureLevel = detectSignatureLevel(user.role);
  // get the signatures based on the signature level
  const signatures = getSignatures(signatureLevel);

  const accessToken = generateToken({
    payload: { id: user._id, email: user.email, role: user.role },
    secret: signatures.access_signature as string, // assign the access signature
    options: { expiresIn: Number(ACCESS_TOKEN_EXPIRES_IN) },
  });
  const refreshToken = generateToken({
    payload: { id: user._id, email: user.email, role: user.role },
    secret: signatures.refresh_signature as string, // assign the refresh signature
    options: { expiresIn: Number(REFRESH_TOKEN_EXPIRES_IN) },
  });
  return { accessToken, refreshToken };
};
