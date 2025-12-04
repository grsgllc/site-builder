import NewSitePage from "./NewSitePage";
import { auth } from "@/lib/auth";
import { EditorProvider } from "@/context/EditorContext";

export default async function Page() {
  return (
    <EditorProvider>
      <NewSitePage />
    </EditorProvider>
  );
}
