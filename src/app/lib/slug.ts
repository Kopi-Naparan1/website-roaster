export function urlToSlug(hostname: string, pathname: string): string {
  return Buffer.from(`${hostname}${pathname}`).toString("base64url");
}

export function slugToKey(slug: string): string {
  return Buffer.from(slug, "base64url").toString("utf-8");
}
