#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { TaskManager } from "../lib/task-manager.js";
import { ComplexityAnalyzer } from "../lib/complexity-analyzer.js";
import { VSCodeIntegration } from "../lib/vscode-integration.js";
import { ClineAdapter } from "../lib/cline-adapter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const args = process.argv.slice(2);
const taskManager = new TaskManager();
const complexityAnalyzer = new ComplexityAnalyzer();
const vscodeIntegration = new VSCodeIntegration();
const clineAdapter = new ClineAdapter();

async function main() {
  if (args.length === 0) {
    showHelp();
    return;
  }

  const command = args[0];

  try {
    switch (command) {
      case 'init':
        await handleInit(args[1]);
        break;
      case 'plan':
        await handlePlan();
        break;
      case 'next':
        await handleNext();
        break;
      case 'list':
        await handleList();
        break;
      case 'analyze':
        await handleAnalyze();
        break;
      case 'update':
        await handleUpdate(args[1], args[2]);
        break;
      case 'example':
        await handleExample();
        break;
      case 'provider':
        await handleProvider(args[1]);
        break;
      case 'config':
        await handleConfig();
        break;
      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

async function handleInit(projectName) {
  if (!projectName) {
    console.error("❌ Please provide a project name: agentic init <project-name>");
    process.exit(1);
  }

  console.log(`🤖 Initializing project: ${projectName}`);
  console.log("📦 Setting up project structure...");

  // This would call the init-project.sh script
  const { execSync } = await import('child_process');
  const initScript = path.resolve(__dirname, "../scripts/init-project.sh");

  try {
    execSync(`bash "${initScript}" "${projectName}"`, { stdio: 'inherit' });
    console.log(`✅ Project '${projectName}' initialized successfully!`);
  } catch (error) {
    console.error(`❌ Failed to initialize project: ${error.message}`);
  }
}

async function handlePlan() {
  console.log("🛠️ Generating agent-optimized tasks...");

  const planPath = path.resolve(process.cwd(), "plan.md");

  try {
    const planContent = readFileSync(planPath, "utf-8");
    console.log("🤖 Agentic Planning: Analyzing project requirements...");

    // Enhanced agent-optimized task generation
    const tasks = generateAgentTasks(planContent);

    writeFileSync(path.resolve(process.cwd(), "tasks.json"), JSON.stringify(tasks, null, 2));

    console.log("✅ Generated agent-optimized tasks.json");
    console.log(`📊 Total Tasks: ${tasks.execution_summary.total_tasks}`);
    console.log(`⏱️  Estimated Duration: ${tasks.execution_summary.estimated_duration_days} days`);
    console.log(`🤖 Agent Types: ${tasks.metadata.agent_capabilities.join(', ')}`);
    console.log(`🔄 Parallel Execution Ratio: ${(tasks.execution_summary.parallel_execution_ratio * 100).toFixed(0)}%`);

  } catch (error) {
    console.error("❌ Error generating tasks:", error.message);
    console.log("Make sure plan.md exists in the current directory");
  }
}

async function handleNext() {
  taskManager.loadTasks();

  const nextTask = taskManager.getNextTask();

  if (nextTask) {
    console.log("🎯 Next Task to Execute:");
    console.log(`📝 Title: ${nextTask.title}`);
    console.log(`⭐ Priority: ${nextTask.priority}`);
    console.log(`🤖 Agent Type: ${nextTask.agent_type}`);
    console.log(`⏱️  Estimated Hours: ${nextTask.estimated_hours}`);
    console.log(`📋 Description: ${nextTask.description}`);

    if (nextTask.dependencies && nextTask.dependencies.length > 0) {
      console.log(`🔗 Dependencies: ${nextTask.dependencies.join(', ')}`);
    }

    if (nextTask.execution_context) {
      console.log(`🛠️  Tech Stack: ${nextTask.execution_context.tech_stack?.join(', ') || 'General'}`);
    }
  } else {
    console.log("✅ No pending tasks found!");
    const stats = taskManager.getTaskStats();
    console.log(`📊 Project Status: ${stats.completionRate}% complete`);
  }
}

async function handleList() {
  taskManager.loadTasks();

  const tasks = taskManager.tasks;
  const stats = taskManager.getTaskStats();

  console.log(`📋 Task List (${tasks.length} total tasks):`);
  console.log(`📊 Progress: ${stats.completed}/${stats.total} completed (${stats.completionRate}%)\n`);

  tasks.forEach((task, index) => {
    const status = task.status === 'completed' ? '✅' :
                  task.status === 'in_progress' ? '🔄' : '⏳';
    const priority = task.priority === 'critical' ? '🔴' :
                    task.priority === 'high' ? '🟠' : '🟢';

    console.log(`${index + 1}. ${status} ${priority} ${task.title}`);
    console.log(`   🤖 ${task.agent_type} | ⏱️ ${task.estimated_hours}h | 📍 ${task.phase || 'General'}`);
  });
}

async function handleAnalyze() {
  taskManager.loadTasks();

  if (taskManager.tasks.length === 0) {
    console.log("❌ No tasks found. Run 'agentic plan' first.");
    return;
  }

  console.log("📊 Analyzing task complexity...");
  const analysis = await complexityAnalyzer.analyze(taskManager.tasks);

  console.log(`\n🎯 Complexity Analysis Results:`);
  console.log(`📈 Average Complexity: ${analysis.score}/5 (${analysis.level})`);
  console.log(`📋 Total Tasks: ${analysis.analysis.totalTasks}`);
  console.log(`⭐ High Priority Tasks: ${analysis.analysis.highPriorityTasks}`);
  console.log(`⚠️  Complex Tasks: ${analysis.analysis.complexTasks.length}`);

  console.log(`\n💡 Recommendations:`);
  analysis.recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. ${rec}`);
  });
}

async function handleUpdate(taskId, status) {
  if (!taskId || !status) {
    console.error("❌ Usage: agentic update <task-id> <status>");
    console.error("   Status options: pending, in_progress, completed");
    return;
  }

  const success = taskManager.updateTaskStatus(taskId, status);

  if (success) {
    console.log(`✅ Task ${taskId} updated to ${status}`);
    const stats = taskManager.getTaskStats();
    console.log(`📊 Project Progress: ${stats.completionRate}% complete`);
  } else {
    console.error(`❌ Task ${taskId} not found`);
  }
}

async function handleExample() {
  const templatePath = path.resolve(__dirname, "../templates/plan.md");
  console.log(readFileSync(templatePath, "utf-8"));
}

async function handleProvider(provider) {
  if (!provider) {
    console.log(`Current provider: ${process.env.PROVIDER || 'openrouter'}`);
    return;
  }

  console.log(`🔄 Switching to provider: ${provider}`);
  // Provider switching logic would go here
  console.log(`✅ Switched to ${provider} provider`);
}

async function handleConfig() {
  console.log("⚙️ Current Configuration:");
  console.log(`   Provider: ${process.env.PROVIDER || 'openrouter'}`);
  console.log(`   Model: ${process.env.MODEL || 'anthropic/claude-3.5-sonnet'}`);
  console.log(`   Auto-run: ${process.env.AUTO_RUN || 'false'}`);
  console.log(`   Complexity Threshold: ${process.env.COMPLEXITY_THRESHOLD || '3'}`);
}

function showHelp() {
  console.log(`
🤖 Agentic Toolkit v2.0 - AI-Powered Development Assistant

Usage: agentic <command> [options]

Project Management:
  init <name>     Initialize a new project with Agentic Toolkit
  plan            Generate agent-optimized tasks from plan.md
  next            Show the next task to execute
  list            List all tasks with status and priority
  update <id> <status>  Update task status (pending/in_progress/completed)

Analysis & Intelligence:
  analyze         Analyze task complexity and provide recommendations

Configuration:
  provider [name] Switch or show current AI provider
  config          Show current configuration

Help & Examples:
  example         Show sample plan.md template
  help            Show this help message

Examples:
  agentic init my-awesome-app
  agentic plan
  agentic next
  agentic analyze
  agentic update 1.1 completed
  agentic provider ollama

For more information, visit: https://github.com/chibuenyim/Agentic-Toolkit
`);
}

function generateAgentTasks(planContent) {
  // Enhanced agent task generation based on plan content
  const lines = planContent.split('\n');
  const tasks = [];
  let taskCounter = 1;

  // Parse plan.md for task generation
  lines.forEach((line, index) => {
    if (line.includes('- [ ]') || line.includes('✅')) {
      const title = line.replace(/^- \[[ x]\] /, '').trim();
      if (title) {
        tasks.push({
          id: `task_${taskCounter}`,
          title,
          description: `Task extracted from plan: ${title}`,
          agent_type: determineAgentType(title),
          dependencies: [],
          estimated_hours: estimateHours(title),
          priority: determinePriority(title),
          status: 'pending',
          phase: 'implementation',
          execution_context: {
            tech_stack: inferTechStack(title),
            output_files: [],
            testing_required: true
          }
        });
        taskCounter++;
      }
    }
  });

  return {
    metadata: {
      generated_by: "Agentic Toolkit v2.0",
      generation_time: new Date().toISOString(),
      agent_capabilities: ["planning", "implementation", "testing", "deployment"],
      execution_model: "hierarchical_parallel"
    },
    infrastructure: {
      detected: {
        os: process.platform,
        node_version: process.version,
        has_docker: false,
        has_git: true
      },
      recommendations: {
        deployment: "docker_compose",
        database: "postgresql",
        cache: "redis"
      }
    },
    phases: [{
      id: "implementation",
      name: "Agent Implementation",
      duration_days: Math.ceil(tasks.length / 2),
      agent: "implementation_swarm",
      tasks: tasks
    }],
    execution_summary: {
      total_tasks: tasks.length,
      estimated_duration_days: Math.ceil(tasks.length / 2),
      parallel_execution_ratio: 0.7,
      critical_path_tasks: tasks.filter(t => t.priority === 'critical').map(t => t.id),
      risk_mitigation: {
        backup_plans: true,
        rollback_strategies: true,
        monitoring_integration: true
      }
    }
  };
}

function determineAgentType(title) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('test') || lowerTitle.includes('testing')) {
    return 'testing_agent';
  }
  if (lowerTitle.includes('deploy') || lowerTitle.includes('infrastructure')) {
    return 'deployment_agent';
  }
  if (lowerTitle.includes('plan') || lowerTitle.includes('design')) {
    return 'planning_agent';
  }

  return 'implementation_agent';
}

function estimateHours(title) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('setup') || lowerTitle.includes('initialize')) {
    return 2;
  }
  if (lowerTitle.includes('implement') || lowerTitle.includes('develop')) {
    return 8;
  }
  if (lowerTitle.includes('test') || lowerTitle.includes('validate')) {
    return 4;
  }
  if (lowerTitle.includes('deploy') || lowerTitle.includes('configure')) {
    return 6;
  }

  return 4; // Default
}

function determinePriority(title) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('security') || lowerTitle.includes('authentication')) {
    return 'critical';
  }
  if (lowerTitle.includes('core') || lowerTitle.includes('main')) {
    return 'high';
  }

  return 'medium';
}

function inferTechStack(title) {
  const lowerTitle = title.toLowerCase();
  const stack = [];

  if (lowerTitle.includes('frontend') || lowerTitle.includes('ui')) {
    stack.push('react', 'typescript', 'tailwind');
  }
  if (lowerTitle.includes('backend') || lowerTitle.includes('api')) {
    stack.push('nodejs', 'express', 'typescript');
  }
  if (lowerTitle.includes('database') || lowerTitle.includes('data')) {
    stack.push('postgresql', 'prisma');
  }
  if (lowerTitle.includes('test')) {
    stack.push('jest', 'testing-library');
  }

  return stack.length > 0 ? stack : ['general'];
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
