/** Match n8n-core Cipher (aes-256-cbc, salted). */
import crypto from "node:crypto";

const RANDOM_BYTES = Buffer.from("53616c7465645f5f", "hex");

function getKeyAndIv(encryptionKey, salt) {
  const password = Buffer.concat([Buffer.from(encryptionKey, "binary"), salt]);
  const hash1 = crypto.createHash("md5").update(password).digest();
  const hash2 = crypto.createHash("md5").update(Buffer.concat([hash1, password])).digest();
  const iv = crypto.createHash("md5").update(Buffer.concat([hash2, password])).digest();
  const key = Buffer.concat([hash1, hash2]);
  return [key, iv];
}

export function encryptCredentialPayload(data, encryptionKey) {
  const salt = crypto.randomBytes(8);
  const [key, iv] = getKeyAndIv(encryptionKey, salt);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const body = typeof data === "string" ? data : JSON.stringify(data);
  const encrypted = cipher.update(body);
  return Buffer.concat([RANDOM_BYTES, salt, encrypted, cipher.final()]).toString("base64");
}