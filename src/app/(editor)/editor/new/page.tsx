import NewSitePage from "./NewSitePage";
import { auth } from "@/lib/auth";
import { getAllLayouts } from "@/lib/prisma";
import { EditorProvider } from "@/context/EditorContext";

export default async function Page() {
  const session = await auth();

  const layouts = await getAllLayouts();

  return (
    <EditorProvider>
      <NewSitePage layouts={layouts} />
    </EditorProvider>
  );
}
