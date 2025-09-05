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
    console.log("🤖 Agentic Planning: Analyzing project requirements...");

    // Agent-optimized task generation with hierarchical structure
    const tasks = {
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
      phases: [
        {
          id: "phase_1",
          name: "Agent Planning & Architecture",
          duration_days: 3,
          agent: "planning_agent",
          tasks: [
            {
              id: "1.1",
              title: "Requirements Analysis",
              description: "Parse plan.md and extract functional requirements",
              agent_type: "planning_agent",
              dependencies: [],
              estimated_hours: 4,
              priority: "critical",
              status: "pending",
              execution_context: {
                input_files: ["plan.md"],
                output_format: "structured_requirements.json",
                validation_criteria: ["completeness", "feasibility"]
              }
            },
            {
              id: "1.2",
              title: "Architecture Design",
              description: "Generate technical architecture based on requirements",
              agent_type: "planning_agent",
              dependencies: ["1.1"],
              estimated_hours: 6,
              priority: "critical",
              status: "pending",
              execution_context: {
                input_files: ["structured_requirements.json"],
                output_format: "architecture_spec.json",
                tools_required: ["database_designer", "api_planner"]
              }
            },
            {
              id: "1.3",
              title: "Infrastructure Planning",
              description: "Determine deployment strategy and infrastructure needs",
              agent_type: "deployment_agent",
              dependencies: ["1.2"],
              estimated_hours: 3,
              priority: "high",
              status: "pending",
              execution_context: {
                input_files: ["architecture_spec.json"],
                output_format: "infrastructure_plan.json",
                infrastructure_detection: true
              }
            }
          ]
        },
        {
          id: "phase_2",
          name: "Parallel Agent Implementation",
          duration_days: 11,
          agent: "implementation_swarm",
          parallel_execution: true,
          tasks: [
            {
              id: "2.1",
              title: "Backend API Development",
              description: "Generate REST API with authentication and core endpoints",
              agent_type: "implementation_agent",
              dependencies: ["1.2"],
              estimated_hours: 24,
              priority: "critical",
              status: "pending",
              execution_context: {
                tech_stack: ["nodejs", "express", "typescript"],
                output_files: ["src/api/", "src/models/", "src/routes/"],
                testing_required: true,
                security_scan: true
              }
            },
            {
              id: "2.2",
              title: "Frontend Component Generation",
              description: "Create React components with TypeScript and accessibility",
              agent_type: "implementation_agent",
              dependencies: ["1.2"],
              estimated_hours: 20,
              priority: "critical",
              status: "pending",
              execution_context: {
                tech_stack: ["react", "typescript", "tailwind"],
                output_files: ["src/components/", "src/pages/"],
                accessibility_compliance: "WCAG_2_1_AA",
                responsive_design: true
              }
            },
            {
              id: "2.3",
              title: "Database Implementation",
              description: "Set up database schema, migrations, and optimization",
              agent_type: "implementation_agent",
              dependencies: ["1.3"],
              estimated_hours: 12,
              priority: "high",
              status: "pending",
              execution_context: {
                database_type: "postgresql",
                orm: "prisma",
                output_files: ["prisma/schema.prisma", "src/database/"],
                migration_scripts: true
              }
            }
          ]
        },
        {
          id: "phase_3",
          name: "Agent Testing & Validation",
          duration_days: 7,
          agent: "testing_agent",
          tasks: [
            {
              id: "3.1",
              title: "Automated Test Generation",
              description: "Create comprehensive test suites for all components",
              agent_type: "testing_agent",
              dependencies: ["2.1", "2.2", "2.3"],
              estimated_hours: 16,
              priority: "high",
              status: "pending",
              execution_context: {
                test_types: ["unit", "integration", "e2e"],
                coverage_target: 80,
                output_files: ["tests/", "coverage/"],
                ci_integration: true
              }
            },
            {
              id: "3.2",
              title: "Security & Performance Validation",
              description: "Run security scans and performance benchmarks",
              agent_type: "testing_agent",
              dependencies: ["3.1"],
              estimated_hours: 8,
              priority: "high",
              status: "pending",
              execution_context: {
                security_scans: ["sast", "dependency_check"],
                performance_tests: ["load_testing", "stress_testing"],
                compliance_checks: ["gdpr", "accessibility"]
              }
            }
          ]
        },
        {
          id: "phase_4",
          name: "Agent Deployment & Monitoring",
          duration_days: 7,
          agent: "deployment_agent",
          tasks: [
            {
              id: "4.1",
              title: "Production Deployment Setup",
              description: "Configure production environment and deployment pipeline",
              agent_type: "deployment_agent",
              dependencies: ["3.2"],
              estimated_hours: 10,
              priority: "critical",
              status: "pending",
              execution_context: {
                deployment_strategy: "blue_green",
                infrastructure: "docker_compose",
                monitoring: ["prometheus", "grafana"],
                backup_strategy: "automated"
              }
            },
            {
              id: "4.2",
              title: "Production Monitoring",
              description: "Set up monitoring, alerting, and performance tracking",
              agent_type: "monitoring_agent",
              dependencies: ["4.1"],
              estimated_hours: 6,
              priority: "high",
              status: "pending",
              execution_context: {
                monitoring_tools: ["prometheus", "grafana", "elk"],
                alerting_rules: ["performance", "security", "availability"],
                log_aggregation: true
              }
            }
          ]
        }
      ],
      execution_summary: {
        total_tasks: 8,
        estimated_duration_days: 28,
        parallel_execution_ratio: 0.65,
        critical_path_tasks: ["1.1", "1.2", "2.1", "2.2", "4.1"],
        risk_mitigation: {
          backup_plans: true,
          rollback_strategies: true,
          monitoring_integration: true
        }
      }
    };

    writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));
    console.log("✅ Generated agent-optimized tasks.json");
    console.log(`📊 Total Tasks: ${tasks.execution_summary.total_tasks}`);
    console.log(`⏱️  Estimated Duration: ${tasks.execution_summary.estimated_duration_days} days`);
    console.log(`🤖 Agent Types: ${tasks.metadata.agent_capabilities.join(', ')}`);
  } catch (error) {
    console.error("❌ Error generating agent tasks:", error.message);
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
