const baseUrl = process.env.NEXT_PUBLIC_URL;

export default async function sitemap() {
  const routes = [
    "",
    "/charts/free",
    "/charts",
    "/feedback",
    "/signin",
    "/subscribe",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));
}
