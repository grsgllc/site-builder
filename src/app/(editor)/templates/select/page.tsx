import TemplateSelectionPage from "./TemplateSelectionPage";
import { getTemplates } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Page() {
  const templates = await getTemplates();
  return <TemplateSelectionPage templates={templates} />;
}
