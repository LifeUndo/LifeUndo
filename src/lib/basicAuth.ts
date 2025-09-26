export function checkBasicAuth(header?: string) {
  const user = process.env.BASIC_AUTH_USER || "admin";
  const pass = process.env.BASIC_AUTH_PASS || "changeme";
  if (!header?.startsWith("Basic ")) return false;
  const creds = Buffer.from(header.split(" ")[1], "base64").toString();
  const [u, p] = creds.split(":");
  return u === user && p === pass;
}

