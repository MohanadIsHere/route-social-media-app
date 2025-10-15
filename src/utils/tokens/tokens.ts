import {
  type JwtPayload,
  type Secret,
  sign,
  type SignOptions,
  verify,
} from "jsonwebtoken";
import { v4 as uuid } from "uuid";

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
  userModel,
  UserRoles,
  HydratedTokenDoc,
  tokenModel,
} from "../../database/models";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../response";
import {
  UserRepository,
  TokenRepository,
} from "../../database/repository";

const _userModel = new UserRepository(userModel);
const _tokenModel = new TokenRepository(tokenModel);

export enum SignatureLevelsEnum {
  Bearer = "Bearer",
  System = "System",
}
export enum TokenEnum {
  access = "access",
  refresh = "refresh",
}
export enum LogoutEnum {
  only = "only",
  all = "all",
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
export const verifyToken = ({
  token,
  secret = ACCESS_TOKEN_USER_SECRET as string,
}: {
  token: string;
  secret: Secret;
}): JwtPayload => {
  return verify(token, secret) as JwtPayload;
};

export const detectSignatureLevel = (
  role: UserRoles = UserRoles.user
): SignatureLevelsEnum => {
  let signatureLevel: SignatureLevelsEnum = SignatureLevelsEnum.Bearer; // default to user
  switch (
    role // determine signature level based on role
  ) {
    case UserRoles.admin:
    case UserRoles.superAdmin:
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
  const jwtid = uuid();

  const accessToken = generateToken({
    payload: { id: user._id, email: user.email, role: user.role },
    secret: signatures.access_signature as string, // assign the access signature
    options: { expiresIn: Number(ACCESS_TOKEN_EXPIRES_IN), jwtid },
  });
  const refreshToken = generateToken({
    payload: { id: user._id, email: user.email, role: user.role },
    secret: signatures.refresh_signature as string, // assign the refresh signature
    options: { expiresIn: Number(REFRESH_TOKEN_EXPIRES_IN), jwtid },
  });
  return { accessToken, refreshToken };
};
export const decodeToken = async ({
  authorization,
  tokenType = TokenEnum.access,
}: {
  authorization: string;
  tokenType?: TokenEnum;
}) => {
  const [key, token] = authorization.split(" ");
  if (!token || !key) throw new UnauthorizedException("Missing token parts");
  const signatures = getSignatures(key as SignatureLevelsEnum);
  const decoded: JwtPayload = verifyToken({
    token,
    secret:
      tokenType === TokenEnum.access
        ? (signatures.access_signature as string)
        : (signatures.refresh_signature as string),
  });

  if (!decoded?.id || !decoded?.iat)
    throw new BadRequestException("Invalid token");

  if (await _tokenModel.findOne({ jti: decoded.jti! }))
    throw new UnauthorizedException("Token revoked");

  const user = await _userModel.findOne({ email: decoded?.email });
  if (!user) throw new NotFoundException("User not found");

  if ((user.changeCredentialsAt?.getTime() || 0) > decoded.iat * 1000)
    throw new UnauthorizedException("Token revoked");

  return { user, decoded };
};
export const createRevokeToken = async ({
  decoded,
}: {
  decoded: JwtPayload;
}): Promise<HydratedTokenDoc> => {
  const result = await _tokenModel.create({
    data: {
      jti: decoded.jti as string,
      expiresIn: decoded.iat! + Number(REFRESH_TOKEN_EXPIRES_IN),
      userId: decoded.id,
    },
  });
  if (!result) throw new BadRequestException("Failed To Revoke This Token");
  return result as HydratedTokenDoc;
};
