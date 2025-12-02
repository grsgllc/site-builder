import NewSitePage from "./NewSitePage";
import { auth } from "@/lib/auth";
import { getAllLayouts } from "@/lib/prisma";

export default async function Page() {
  const session = await auth();

  const layouts = await getAllLayouts();

  return <NewSitePage layouts={layouts} />;
}
