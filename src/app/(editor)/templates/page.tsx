import TemplateSelectionPage from "./TemplateSelectionPage";
import { getAllLayouts } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Page() {
  const layouts = await getAllLayouts();
  return <TemplateSelectionPage layouts={layouts} />;
}
