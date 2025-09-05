import { execSync, spawn } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { TaskManager } from './task-manager.js';
import { RulesEngine } from './rules-engine.js';

export class AutoExecutor {
  constructor() {
    this.taskManager = new TaskManager();
    this.rulesEngine = new RulesEngine();
    this.isRunning = false;
    this.currentExecution = null;
    this.executionHistory = [];
  }

  async startAutoExecution(options = {}) {
    if (this.isRunning) {
      throw new Error('Auto execution is already running');
    }

    this.isRunning = true;
    this.executionHistory = [];

    console.log('🤖 Starting Auto Execution Mode...');
    console.log('⚙️  Configuration:', options);

    try {
      await this.executionLoop(options);
    } catch (error) {
      console.error('❌ Auto execution failed:', error.message);
      this.logExecution('error', 'Auto execution failed', { error: error.message });
    } finally {
      this.isRunning = false;
      this.currentExecution = null;
    }
  }

  async stopAutoExecution() {
    this.isRunning = false;
    if (this.currentExecution) {
      this.currentExecution.kill();
    }
    console.log('🛑 Auto execution stopped');
  }

  async executionLoop(options) {
    const {
      maxIterations = 100,
      delayBetweenTasks = 2000,
      autoApprove = false,
      rulesCheck = true,
      parallelExecution = false
    } = options;

    let iteration = 0;

    while (this.isRunning && iteration < maxIterations) {
      iteration++;

      try {
        // Load current tasks
        this.taskManager.loadTasks();

        // Get next task(s)
        let tasksToExecute;
        if (parallelExecution) {
          tasksToExecute = this.getParallelTasks();
        } else {
          const nextTask = this.taskManager.getNextTask();
          tasksToExecute = nextTask ? [nextTask] : [];
        }

        if (tasksToExecute.length === 0) {
          console.log('✅ No pending tasks found. Auto execution complete.');
          break;
        }

        // Execute tasks
        for (const task of tasksToExecute) {
          await this.executeTask(task, { autoApprove, rulesCheck });
        }

        // Wait before next iteration
        if (delayBetweenTasks > 0) {
          await this.delay(delayBetweenTasks);
        }

      } catch (error) {
        console.error(`❌ Execution iteration ${iteration} failed:`, error.message);
        this.logExecution('error', `Iteration ${iteration} failed`, { error: error.message });

        if (!options.continueOnError) {
          break;
        }
      }
    }

    console.log(`🏁 Auto execution completed after ${iteration} iterations`);
  }

  getParallelTasks() {
    // Get tasks that can run in parallel (no dependencies on each other)
    this.taskManager.loadTasks();
    const pendingTasks = this.taskManager.tasks.filter(t => t.status === 'pending');

    const executableTasks = [];
    const processedIds = new Set();

    for (const task of pendingTasks) {
      if (processedIds.has(task.id)) continue;

      // Check if task dependencies are met
      if (!this.taskManager.areDependenciesMet(task)) continue;

      // Find other tasks that can run in parallel
      const parallelTasks = pendingTasks.filter(t =>
        !processedIds.has(t.id) &&
        this.taskManager.areDependenciesMet(t) &&
        !this.haveCircularDependency(task, t)
      );

      executableTasks.push(...parallelTasks.slice(0, 3)); // Limit parallel execution
      parallelTasks.forEach(t => processedIds.add(t.id));
    }

    return executableTasks;
  }

  haveCircularDependency(task1, task2) {
    // Simple check - in production, this would be more sophisticated
    return false;
  }

  async executeTask(task, options = {}) {
    console.log(`\n🎯 Executing Task: ${task.title}`);
    console.log(`🤖 Agent: ${task.agent_type}`);
    console.log(`⏱️  Estimated: ${task.estimated_hours}h`);

    this.currentExecution = { taskId: task.id, startTime: Date.now() };

    try {
      // Update task status
      this.taskManager.updateTaskStatus(task.id, 'in_progress');
      this.logExecution('start', task.title, { taskId: task.id });

      // Pre-execution checks
      if (options.rulesCheck) {
        await this.performRulesCheck(task);
      }

      // Execute based on agent type
      const result = await this.executeByAgent(task);

      // Post-execution validation
      if (result.success) {
        this.taskManager.updateTaskStatus(task.id, 'completed');
        this.logExecution('complete', task.title, {
          taskId: task.id,
          duration: Date.now() - this.currentExecution.startTime,
          result: result.output
        });
        console.log(`✅ Task completed successfully`);
      } else {
        throw new Error(result.error || 'Task execution failed');
      }

    } catch (error) {
      this.taskManager.updateTaskStatus(task.id, 'pending'); // Reset on failure
      this.logExecution('fail', task.title, {
        taskId: task.id,
        error: error.message,
        duration: Date.now() - this.currentExecution.startTime
      });
      console.error(`❌ Task failed: ${error.message}`);

      if (!options.continueOnError) {
        throw error;
      }
    } finally {
      this.currentExecution = null;
    }
  }

  async performRulesCheck(task) {
    if (!task.execution_context || !task.execution_context.output_files) {
      return;
    }

    console.log('🔍 Performing rules check...');

    for (const filePath of task.execution_context.output_files) {
      if (existsSync(filePath)) {
        const violations = this.rulesEngine.validateFile(filePath);
        if (violations.some(v => v.action === 'block')) {
          throw new Error(`Rules violation in ${filePath}: ${violations.find(v => v.action === 'block').description}`);
        }
      }
    }
  }

  async executeByAgent(task) {
    const agentType = task.agent_type || 'implementation_agent';

    switch (agentType) {
      case 'planning_agent':
        return await this.executePlanningTask(task);
      case 'implementation_agent':
        return await this.executeImplementationTask(task);
      case 'testing_agent':
        return await this.executeTestingTask(task);
      case 'deployment_agent':
        return await this.executeDeploymentTask(task);
      default:
        return await this.executeGenericTask(task);
    }
  }

  async executePlanningTask(task) {
    console.log('📋 Executing planning task...');

    // Simulate planning execution
    const planningResult = {
      requirements: ['Analyzed requirements', 'Created specifications'],
      nextSteps: ['Implementation planning', 'Resource allocation']
    };

    return {
      success: true,
      output: planningResult,
      duration: Math.random() * 3600000 + 1800000 // 30min to 1.5h
    };
  }

  async executeImplementationTask(task) {
    console.log('⚙️ Executing implementation task...');

    const techStack = task.execution_context?.tech_stack || ['general'];
    console.log(`🛠️  Tech Stack: ${techStack.join(', ')}`);

    // Simulate implementation based on tech stack
    const implementationResult = {
      filesCreated: task.execution_context?.output_files || [],
      features: ['Core functionality implemented', 'Error handling added'],
      tests: task.execution_context?.testing_required ? ['Unit tests created'] : []
    };

    return {
      success: true,
      output: implementationResult,
      duration: Math.random() * 7200000 + 3600000 // 1h to 3h
    };
  }

  async executeTestingTask(task) {
    console.log('🧪 Executing testing task...');

    const testResult = {
      testsRun: Math.floor(Math.random() * 50) + 10,
      passed: 0,
      failed: 0,
      coverage: Math.floor(Math.random() * 30) + 70
    };

    testResult.passed = Math.floor(testResult.testsRun * (testResult.coverage / 100));
    testResult.failed = testResult.testsRun - testResult.passed;

    if (testResult.failed > 0) {
      return {
        success: false,
        error: `${testResult.failed} tests failed`,
        output: testResult
      };
    }

    return {
      success: true,
      output: testResult,
      duration: Math.random() * 1800000 + 600000 // 10min to 40min
    };
  }

  async executeDeploymentTask(task) {
    console.log('🚀 Executing deployment task...');

    const deploymentResult = {
      environment: task.execution_context?.infrastructure || 'development',
      services: ['Database deployed', 'API deployed', 'Frontend deployed'],
      monitoring: ['Health checks configured', 'Logging enabled']
    };

    return {
      success: true,
      output: deploymentResult,
      duration: Math.random() * 1800000 + 900000 // 15min to 45min
    };
  }

  async executeGenericTask(task) {
    console.log('🔧 Executing generic task...');

    // Simulate generic task execution
    return {
      success: true,
      output: { message: 'Task executed successfully' },
      duration: Math.random() * 1800000 + 300000 // 5min to 35min
    };
  }

  logExecution(type, message, metadata = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      metadata
    };

    this.executionHistory.push(logEntry);

    // Save to execution log file
    try {
      const logPath = path.resolve(process.cwd(), 'execution-log.json');
      const existingLogs = existsSync(logPath) ?
        JSON.parse(readFileSync(logPath, 'utf-8')) : [];

      existingLogs.push(logEntry);

      // Keep only last 1000 entries
      const recentLogs = existingLogs.slice(-1000);
      writeFileSync(logPath, JSON.stringify(recentLogs, null, 2));
    } catch (error) {
      console.warn('⚠️ Could not save execution log:', error.message);
    }
  }

  getExecutionHistory(filters = {}) {
    let filtered = [...this.executionHistory];

    if (filters.type) {
      filtered = filtered.filter(log => log.type === filters.type);
    }

    if (filters.since) {
      const sinceDate = new Date(filters.since);
      filtered = filtered.filter(log => new Date(log.timestamp) >= sinceDate);
    }

    return filtered;
  }

  getExecutionStats() {
    const history = this.executionHistory;
    const stats = {
      total: history.length,
      successful: history.filter(h => h.type === 'complete').length,
      failed: history.filter(h => h.type === 'fail' || h.type === 'error').length,
      averageDuration: 0,
      successRate: 0
    };

    const completedTasks = history.filter(h => h.type === 'complete' && h.metadata.duration);
    if (completedTasks.length > 0) {
      stats.averageDuration = completedTasks.reduce((sum, h) => sum + h.metadata.duration, 0) / completedTasks.length;
    }

    if (stats.total > 0) {
      stats.successRate = (stats.successful / (stats.successful + stats.failed)) * 100;
    }

    return stats;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Enterprise features
  async executeWithApproval(task, approverCallback) {
    console.log(`⏳ Task "${task.title}" requires approval`);

    const approved = await approverCallback(task);

    if (!approved) {
      throw new Error('Task execution denied by approver');
    }

    return await this.executeTask(task);
  }

  async executeWithRollback(task, rollbackCallback) {
    try {
      return await this.executeTask(task);
    } catch (error) {
      console.log('🔄 Executing rollback...');
      await rollbackCallback(task);
      throw error;
    }
  }

  generateExecutionReport() {
    const stats = this.getExecutionStats();
    const recentHistory = this.getExecutionHistory({ since: new Date(Date.now() - 24 * 60 * 60 * 1000) });

    return {
      timestamp: new Date().toISOString(),
      summary: stats,
      recentActivity: recentHistory.slice(-10),
      recommendations: this.generateExecutionRecommendations(stats)
    };
  }

  generateExecutionRecommendations(stats) {
    const recommendations = [];

    if (stats.successRate < 80) {
      recommendations.push('Review and fix failing tasks to improve success rate');
    }

    if (stats.averageDuration > 3600000) { // 1 hour
      recommendations.push('Consider breaking down long-running tasks');
    }

    if (stats.failed > stats.successful) {
      recommendations.push('Investigate root causes of task failures');
    }

    return recommendations;
  }
}
