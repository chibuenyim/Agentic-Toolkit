import { readFileSync } from 'fs';
import path from 'path';
import { TaskManager } from './task-manager.js';
import { ComplexityAnalyzer } from './complexity-analyzer.js';

export class VSCodeIntegration {
  constructor() {
    this.taskManager = new TaskManager();
    this.complexityAnalyzer = new ComplexityAnalyzer();
  }

  async activate(context) {
    // This would be called when VS Code extension activates
    console.log('🤖 Agentic Toolkit VS Code extension activated');

    // Register commands that would be available in VS Code
    this.registerCommands();
  }

  registerCommands() {
    // Simulate VS Code command registration
    const commands = {
      'agentic.plan': () => this.handlePlanCommand(),
      'agentic.analyze': () => this.handleAnalyzeCommand(),
      'agentic.nextTask': () => this.handleNextTaskCommand(),
      'agentic.listTasks': () => this.handleListTasksCommand(),
      'agentic.updateTask': () => this.handleUpdateTaskCommand()
    };

    console.log('📋 Registered VS Code commands:', Object.keys(commands));
    return commands;
  }

  async handlePlanCommand() {
    try {
      // Simulate getting active document content
      const prdPath = path.resolve(process.cwd(), 'plan.md');
      const prdContent = readFileSync(prdPath, 'utf-8');

      console.log('📖 Reading PRD from plan.md...');
      console.log('🛠️ Generating tasks from PRD...');

      // This would call the task parser
      const tasks = await this.parsePRD(prdContent);

      console.log(`✅ Generated ${tasks.length} tasks from PRD`);
      return { success: true, tasksCount: tasks.length };
    } catch (error) {
      console.error(`❌ Failed to generate tasks: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async handleAnalyzeCommand() {
    try {
      this.taskManager.loadTasks();
      const complexity = await this.complexityAnalyzer.analyze(this.taskManager.tasks);

      console.log(`📊 Task complexity analyzed: ${complexity.score}/5`);
      console.log(`📈 Recommendations: ${complexity.recommendations.join(', ')}`);

      return { success: true, complexity };
    } catch (error) {
      console.error(`❌ Failed to analyze complexity: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async handleNextTaskCommand() {
    try {
      this.taskManager.loadTasks();
      const nextTask = this.taskManager.getNextTask();

      if (nextTask) {
        console.log(`🎯 Next task: ${nextTask.title}`);
        console.log(`⭐ Priority: ${nextTask.priority}`);
        console.log(`📝 Description: ${nextTask.description}`);
        if (nextTask.dependencies && nextTask.dependencies.length > 0) {
          console.log(`🔗 Dependencies: ${nextTask.dependencies.join(', ')}`);
        }
        return { success: true, task: nextTask };
      } else {
        console.log('✅ No pending tasks found');
        return { success: true, message: 'No pending tasks' };
      }
    } catch (error) {
      console.error(`❌ Failed to get next task: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async handleListTasksCommand() {
    try {
      this.taskManager.loadTasks();
      const tasks = this.taskManager.tasks;

      console.log(`📋 Task List (${tasks.length} total):`);
      tasks.forEach((task, index) => {
        const status = task.status === 'completed' ? '✅' :
                      task.status === 'in_progress' ? '🔄' : '⏳';
        console.log(`${index + 1}. ${status} ${task.title} (${task.priority})`);
      });

      return { success: true, tasks };
    } catch (error) {
      console.error(`❌ Failed to list tasks: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async handleUpdateTaskCommand() {
    try {
      // This would typically show a VS Code input box
      console.log('🔄 Task update functionality would open VS Code input dialog');
      console.log('📝 User would select task and new status');

      return { success: true, message: 'Update dialog opened' };
    } catch (error) {
      console.error(`❌ Failed to update task: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async parsePRD(content) {
    // Simple PRD parsing - in real implementation this would use AI
    const lines = content.split('\n');
    const tasks = [];

    lines.forEach((line, index) => {
      if (line.includes('- [ ]') || line.includes('✅')) {
        const title = line.replace(/^- \[[ x]\] /, '').trim();
        if (title) {
          tasks.push({
            id: `task_${index + 1}`,
            title,
            description: `Task extracted from PRD: ${title}`,
            status: 'pending',
            priority: 'medium',
            dependencies: []
          });
        }
      }
    });

    return tasks;
  }

  // VS Code extension configuration
  getConfiguration() {
    return {
      enable: true,
      autoPlan: true,
      provider: 'openrouter',
      model: 'anthropic/claude-3.5-sonnet',
      complexityThreshold: 3,
      autoRun: false
    };
  }

  // Status bar integration
  createStatusBarItem() {
    return {
      text: '🤖 Agentic',
      tooltip: 'Agentic Toolkit - Click for commands',
      command: 'agentic.showMenu'
    };
  }
}
