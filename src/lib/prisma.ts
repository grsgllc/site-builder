import { Prisma, PrismaClient } from "@prisma/client";
import { Site } from "@prisma/client";
import { Template } from "@/types";
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id: id } });
  return user;
}
export async function getUserByCustomerId(customerId: string) {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });
  return user;
}
export async function approveAccess(id: string, customerid: string) {
  await prisma.user.update({
    where: { id: id },
    data: { stripeCustomerId: customerid, hasAccess: true },
  });
}
export async function revokeAccess(id: string) {
  await prisma.user.updateMany({
    where: { stripeCustomerId: id },
    data: { hasAccess: false },
  });
}
export async function setUserCustomerId(id: string, customerid: string) {
  await prisma.user.update({
    where: { id: id },
    data: { stripeCustomerId: customerid },
  });
}

// ===== Site Functions =====

export async function createSite(data: {
  subdomain: string;
  name: string;
  userId: string;
  description?: string;
}) {
  const site = await prisma.site.create({
    data: {
      subdomain: data.subdomain,
      name: data.name,
      userId: data.userId,
      description: data.description,
      isTemplate: false,
    },
    include: {
      user: true,
    },
  });
  return site;
}

export async function getSite(id: string) {
  const site = await prisma.site.findUnique({
    where: { id },
    include: {
      user: true,
      pages: {
        include: {
          components: true,
        },
      },
      collaborators: {
        include: {
          user: true,
        },
      },
    },
  });
  return site;
}

export async function getSiteBySubdomain(subdomain: string) {
  const site = await prisma.site.findUnique({
    where: { subdomain },
    include: {
      user: true,
      pages: {
        include: {
          components: true,
        },
      },
    },
  });
  return site;
}

export async function getUserSites(userId: string): Promise<Site[]> {
  const sites = await prisma.site.findMany({
    where: {
      userId,
      isTemplate: false,
    },
    include: {
      pages: true,
      collaborators: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  return sites;
}

export async function getUserCollaboratingSites(userId: string) {
  const collaborations = await prisma.siteCollaborator.findMany({
    where: {
      userId,
      site: {
        isTemplate: false,
      },
    },
    include: {
      site: {
        include: {
          pages: true,
          user: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  return collaborations.map((c) => c.site);
}

export async function updateSite(
  id: string,
  data: {
    name?: string;
    description?: string;
    subdomain?: string;
    published?: boolean;
    themeSettings?: any;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
    favicon?: string;
  }
) {
  const site = await prisma.site.update({
    where: { id },
    data,
  });
  return site;
}

export async function deleteSite(id: string) {
  await prisma.site.delete({
    where: { id },
  });
}

export async function checkSubdomainAvailable(subdomain: string) {
  const existing = await prisma.site.findUnique({
    where: { subdomain },
  });
  return !existing;
}

// ===== Site Collaborator Functions =====

export async function addCollaborator(data: {
  siteId: string;
  userId: string;
  role: string;
  invitedBy?: string;
}) {
  const collaborator = await prisma.siteCollaborator.create({
    data,
    include: {
      user: true,
    },
  });
  return collaborator;
}

export async function removeCollaborator(siteId: string, userId: string) {
  await prisma.siteCollaborator.delete({
    where: {
      siteId_userId: {
        siteId,
        userId,
      },
    },
  });
}

export async function getSiteCollaborators(siteId: string) {
  const collaborators = await prisma.siteCollaborator.findMany({
    where: { siteId },
    include: {
      user: true,
    },
  });
  return collaborators;
}

export async function updateCollaboratorRole(
  siteId: string,
  userId: string,
  role: string
) {
  const collaborator = await prisma.siteCollaborator.update({
    where: {
      siteId_userId: {
        siteId,
        userId,
      },
    },
    data: { role },
  });
  return collaborator;
}

// ===== Page Functions =====

export async function createPage(data: {
  siteId: string;
  title: string;
  slug: string;
  isHome?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}) {
  const page = await prisma.page.create({
    data,
  });
  return page;
}

export async function getPage(id: string) {
  const page = await prisma.page.findUnique({
    where: { id },
    include: {
      components: {
        orderBy: { zIndex: "asc" },
      },
      site: true,
    },
  });
  return page;
}

export async function getSitePages(siteId: string) {
  const pages = await prisma.page.findMany({
    where: { siteId },
    include: {
      components: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return pages;
}

export async function updatePage(
  id: string,
  data: {
    title?: string;
    slug?: string;
    isHome?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
  }
) {
  const page = await prisma.page.update({
    where: { id },
    data,
  });
  return page;
}

export async function deletePage(id: string) {
  await prisma.page.delete({
    where: { id },
  });
}

// ===== Component Functions =====

export async function createComponent(data: {
  pageId: string;
  type: string;
  props: any;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  zIndex?: number;
  layoutSection?: string;
}) {
  const component = await prisma.component.create({
    data: {
      pageId: data.pageId,
      type: data.type,
      props: data.props,
      positionX: data.positionX,
      positionY: data.positionY,
      width: data.width,
      height: data.height,
      zIndex: data.zIndex,
      layoutSection: data.layoutSection,
    },
  });
  return component;
}

export async function updateComponent(
  id: string,
  data: {
    type?: string;
    props?: any;
    positionX?: number;
    positionY?: number;
    width?: number;
    height?: number;
    zIndex?: number;
    layoutSection?: string;
  }
) {
  const component = await prisma.component.update({
    where: { id },
    data,
  });
  return component;
}

export async function deleteComponent(id: string) {
  await prisma.component.delete({
    where: { id },
  });
}

export async function bulkUpdateComponents(
  updates: Array<{
    id: string;
    positionX?: number;
    positionY?: number;
    width?: number;
    height?: number;
    zIndex?: number;
    props?: any;
  }>
) {
  const promises = updates.map((update) =>
    prisma.component.update({
      where: { id: update.id },
      data: {
        positionX: update.positionX,
        positionY: update.positionY,
        width: update.width,
        height: update.height,
        zIndex: update.zIndex,
        props: update.props,
      },
    })
  );
  await Promise.all(promises);
}

// ===== Template Functions =====

export async function getTemplates(): Promise<Template[]> {
  const templates = await prisma.site.findMany({
    select: {
      id: true,
      subdomain: true,
      name: true,
      description: true,
      previewImg: true,
    },
    where: { isTemplate: true },
    orderBy: { createdAt: "asc" },
  });
  return templates;
}

export async function getTemplate(id: string): Promise<Site | null> {
  const template = await prisma.site.findUnique({
    where: { id, isTemplate: true },
    include: {
      pages: {
        include: {
          components: true,
        },
      },
    },
  });
  return template;
}

export async function copyTemplateToSite(
  templateId: string,
  userId: string,
  subdomain: string,
  name: string,
  description?: string
) {
  const template = await prisma.site.findUnique({
    where: { id: templateId, isTemplate: true },
    include: {
      pages: {
        include: {
          components: true,
        },
      },
    },
  });
  if (!template) throw new Error("Template not found");

  // Create new site from template
  const newSite = await prisma.site.create({
    data: {
      name,
      subdomain,
      description,
      userId,
      isTemplate: false,
      sourceTemplateId: templateId,
      published: false,
      themeSettings: template.themeSettings ?? undefined,
      favicon: template.favicon,
      seoTitle: template.seoTitle,
      seoDescription: template.seoDescription,
    },
  });

  // Copy all pages
  for (const templatePage of template.pages) {
    const newPage = await prisma.page.create({
      data: {
        siteId: newSite.id,
        title: templatePage.title,
        slug: templatePage.slug,
        isHome: templatePage.isHome,
        seoTitle: templatePage.seoTitle,
        seoDescription: templatePage.seoDescription,
      },
    });

    // Copy all components for this page
    for (const component of templatePage.components) {
      await prisma.component.create({
        data: {
          pageId: newPage.id,
          type: component.type,
          props: component.props ?? Prisma.JsonNull,
          positionX: component.positionX,
          positionY: component.positionY,
          width: component.width,
          height: component.height,
          zIndex: component.zIndex,
          layoutSection: component.layoutSection,
        },
      });
    }
  }

  return newSite;
}

// ===== Asset Functions =====

export async function createAsset(data: {
  userId: string;
  siteId?: string;
  url: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
}) {
  const asset = await prisma.asset.create({
    data,
  });
  return asset;
}

export async function getAsset(id: string) {
  const asset = await prisma.asset.findUnique({
    where: { id },
  });
  return asset;
}

export async function getUserAssets(userId: string) {
  const assets = await prisma.asset.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return assets;
}

export async function getSiteAssets(siteId: string) {
  const assets = await prisma.asset.findMany({
    where: { siteId },
    orderBy: { createdAt: "desc" },
  });
  return assets;
}

export async function deleteAsset(id: string) {
  await prisma.asset.delete({
    where: { id },
  });
}
