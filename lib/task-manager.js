import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

export class TaskManager {
  constructor() {
    this.tasks = [];
    this.taskFile = path.resolve(process.cwd(), 'tasks.json');
  }

  loadTasks() {
    try {
      const data = readFileSync(this.taskFile, 'utf-8');
      const parsed = JSON.parse(data);
      this.tasks = parsed.phases ? this.flattenPhases(parsed.phases) : parsed.tasks || [];
    } catch (error) {
      this.tasks = [];
    }
    return this.tasks;
  }

  flattenPhases(phases) {
    const tasks = [];
    phases.forEach(phase => {
      if (phase.tasks) {
        phase.tasks.forEach(task => {
          tasks.push({
            ...task,
            phase: phase.name,
            phaseId: phase.id
          });
        });
      }
    });
    return tasks;
  }

  saveTasks() {
    const data = {
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalTasks: this.tasks.length,
        completedTasks: this.tasks.filter(t => t.status === 'completed').length
      },
      tasks: this.tasks
    };
    writeFileSync(this.taskFile, JSON.stringify(data, null, 2));
  }

  getNextTask() {
    // Find highest priority pending task with all dependencies met
    const pendingTasks = this.tasks.filter(task => task.status === 'pending');

    for (const task of pendingTasks) {
      if (this.areDependenciesMet(task)) {
        return task;
      }
    }

    return null;
  }

  areDependenciesMet(task) {
    if (!task.dependencies || task.dependencies.length === 0) {
      return true;
    }

    return task.dependencies.every(depId => {
      const depTask = this.tasks.find(t => t.id === depId);
      return depTask && depTask.status === 'completed';
    });
  }

  updateTaskStatus(taskId, status) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      task.lastUpdated = new Date().toISOString();
      this.saveTasks();
      return true;
    }
    return false;
  }

  getTasksByStatus(status) {
    return this.tasks.filter(task => task.status === status);
  }

  getTasksByPriority(priority) {
    return this.tasks.filter(task => task.priority === priority);
  }

  getTaskStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.status === 'completed').length;
    const inProgress = this.tasks.filter(t => t.status === 'in_progress').length;
    const pending = this.tasks.filter(t => t.status === 'pending').length;

    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate: total > 0 ? (completed / total * 100).toFixed(1) : 0
    };
  }

  listTasks(options = {}) {
    let filteredTasks = [...this.tasks];

    if (options.status) {
      filteredTasks = filteredTasks.filter(t => t.status === options.status);
    }

    if (options.priority) {
      filteredTasks = filteredTasks.filter(t => t.priority === options.priority);
    }

    if (options.phase) {
      filteredTasks = filteredTasks.filter(t => t.phaseId === options.phase);
    }

    return filteredTasks;
  }
}
