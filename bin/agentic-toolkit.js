#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const args = process.argv.slice(2);

function generateTasks() {
  const planPath = path.resolve(process.cwd(), "plan.md");
  const tasksPath = path.resolve(process.cwd(), "tasks.json");

  try {
    const planContent = readFileSync(planPath, "utf-8");
    console.log("📖 Reading plan.md...");

    // Simple task generation simulation
    const tasks = {
      tasks: [
        {
          id: "1",
          title: "Analyze project requirements",
          description: "Review plan.md and identify key components",
          status: "pending"
        },
        {
          id: "2",
          title: "Set up project structure",
          description: "Create directories and initial files",
          status: "pending"
        },
        {
          id: "3",
          title: "Implement core features",
          description: "Build main functionality based on plan",
          status: "pending"
        }
      ]
    };

    writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));
    console.log("✅ Generated tasks.json");
  } catch (error) {
    console.error("❌ Error generating tasks:", error.message);
    console.log("Make sure plan.md exists in the current directory");
  }
}

if (args[0] === "plan") {
  console.log("🛠️ Generating tasks.json...");
  generateTasks();
} else if (args[0] === "example") {
  console.log(readFileSync(path.resolve(__dirname, "../templates/plan.md"), "utf-8"));
} else {
  console.log(`
Usage: agentic-toolkit <command>

Commands:
  plan      Generate tasks.json from plan.md
  example   Show sample plan.md
`);
}
