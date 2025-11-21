import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default layouts
  const layouts = [
    {
      name: "Brutalist Stack",
      description: "Simple vertical stack layout with bold sections",
      isDefault: true,
      structure: {
        type: "stack",
        sections: [
          {
            id: "header",
            name: "Header",
            height: "auto",
            minHeight: 80,
            maxHeight: 200,
            backgroundColor: "#000000",
            borderBottom: "4px solid #000",
          },
          {
            id: "hero",
            name: "Hero Section",
            height: "auto",
            minHeight: 400,
            maxHeight: 800,
            backgroundColor: "#FFFF00",
            borderBottom: "8px solid #000",
          },
          {
            id: "content",
            name: "Content Area",
            height: "auto",
            minHeight: 600,
            backgroundColor: "#FFFFFF",
            borderBottom: "4px solid #000",
          },
          {
            id: "footer",
            name: "Footer",
            height: "auto",
            minHeight: 200,
            backgroundColor: "#FF0000",
          },
        ],
      },
    },
    {
      name: "Asymmetric Grid",
      description: "Bold asymmetric grid layout with offset sections",
      isDefault: false,
      structure: {
        type: "grid",
        sections: [
          {
            id: "header",
            name: "Header",
            gridArea: "1 / 1 / 2 / 3",
            minHeight: 100,
            backgroundColor: "#000000",
            border: "4px solid #000",
          },
          {
            id: "sidebar",
            name: "Sidebar",
            gridArea: "2 / 1 / 4 / 2",
            minHeight: 400,
            backgroundColor: "#00FF00",
            border: "4px solid #000",
          },
          {
            id: "main",
            name: "Main Content",
            gridArea: "2 / 2 / 3 / 3",
            minHeight: 600,
            backgroundColor: "#FFFFFF",
            border: "4px solid #000",
          },
          {
            id: "feature",
            name: "Feature Section",
            gridArea: "3 / 2 / 4 / 3",
            minHeight: 400,
            backgroundColor: "#FF00FF",
            border: "4px solid #000",
          },
          {
            id: "footer",
            name: "Footer",
            gridArea: "4 / 1 / 5 / 3",
            minHeight: 150,
            backgroundColor: "#0000FF",
            border: "4px solid #000",
          },
        ],
      },
    },
    {
      name: "Split Screen",
      description: "Dramatic 50/50 split layout for contrasting content",
      isDefault: false,
      structure: {
        type: "split",
        sections: [
          {
            id: "header",
            name: "Header",
            position: "top",
            height: 100,
            backgroundColor: "#000000",
            borderBottom: "8px solid #000",
          },
          {
            id: "left",
            name: "Left Panel",
            position: "left",
            width: "50%",
            minHeight: 800,
            backgroundColor: "#FFFFFF",
            borderRight: "8px solid #000",
          },
          {
            id: "right",
            name: "Right Panel",
            position: "right",
            width: "50%",
            minHeight: 800,
            backgroundColor: "#000000",
          },
          {
            id: "footer",
            name: "Footer",
            position: "bottom",
            height: 150,
            backgroundColor: "#FFFF00",
            borderTop: "8px solid #000",
          },
        ],
      },
    },
    {
      name: "Freeform Canvas",
      description: "Total creative freedom - position components anywhere",
      isDefault: false,
      structure: {
        type: "freeform",
        sections: [
          {
            id: "canvas",
            name: "Canvas",
            width: "100%",
            minHeight: 1200,
            backgroundColor: "#F5F5F5",
            gridSize: 20, // snap to 20px grid
            showGrid: true,
          },
        ],
      },
    },
  ];

  for (const layout of layouts) {
    const existing = await prisma.layout.findUnique({
      where: { name: layout.name },
    });

    if (!existing) {
      await prisma.layout.create({
        data: layout,
      });
      console.log(`Created layout: ${layout.name}`);
    } else {
      console.log(`Layout already exists: ${layout.name}`);
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
