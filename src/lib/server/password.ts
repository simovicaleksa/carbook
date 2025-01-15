import { hash, verify } from "argon2";

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    hashLength: 32,
    parallelism: 1,
  });
}

export async function verifyPasswordHash(
  hash: string,
  password: string,
): Promise<boolean> {
  return await verify(hash, password);
}
