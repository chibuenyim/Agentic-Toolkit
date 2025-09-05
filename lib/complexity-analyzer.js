export class ComplexityAnalyzer {
  constructor() {
    this.weights = {
      dependencies: 0.3,
      descriptionLength: 0.2,
      priority: 0.25,
      technicalDifficulty: 0.25
    };
  }

  async analyze(tasks) {
    if (!tasks || tasks.length === 0) {
      return {
        score: 0,
        level: 'none',
        recommendations: ['No tasks to analyze']
      };
    }

    const analysis = {
      totalTasks: tasks.length,
      averageComplexity: 0,
      highPriorityTasks: 0,
      complexTasks: [],
      recommendations: []
    };

    let totalScore = 0;

    for (const task of tasks) {
      const taskScore = this.calculateTaskComplexity(task);
      totalScore += taskScore;

      if (task.priority === 'high') {
        analysis.highPriorityTasks++;
      }

      if (taskScore > 4) {
        analysis.complexTasks.push({
          id: task.id,
          title: task.title,
          score: taskScore
        });
      }
    }

    analysis.averageComplexity = totalScore / tasks.length;

    // Generate recommendations
    analysis.recommendations = this.generateRecommendations(analysis, tasks);

    return {
      score: Math.round(analysis.averageComplexity * 10) / 10,
      level: this.getComplexityLevel(analysis.averageComplexity),
      analysis,
      recommendations: analysis.recommendations
    };
  }

  calculateTaskComplexity(task) {
    let score = 0;

    // Dependencies factor
    const depCount = task.dependencies ? task.dependencies.length : 0;
    score += Math.min(depCount * 0.5, 2) * this.weights.dependencies;

    // Description length factor
    const descLength = task.description ? task.description.length : 0;
    const descScore = Math.min(descLength / 100, 2); // Max 2 points for very detailed descriptions
    score += descScore * this.weights.descriptionLength;

    // Priority factor
    const priorityScore = task.priority === 'high' ? 2 :
                         task.priority === 'medium' ? 1 : 0.5;
    score += priorityScore * this.weights.priority;

    // Technical difficulty (estimated from keywords)
    const techScore = this.estimateTechnicalDifficulty(task);
    score += techScore * this.weights.technicalDifficulty;

    return Math.min(Math.max(score, 1), 5); // Clamp between 1-5
  }

  estimateTechnicalDifficulty(task) {
    const title = task.title.toLowerCase();
    const description = task.description ? task.description.toLowerCase() : '';

    const text = title + ' ' + description;

    let difficulty = 1; // Base difficulty

    // Technical keywords that increase difficulty
    const techKeywords = {
      high: ['authentication', 'security', 'encryption', 'real-time', 'websocket', 'api', 'database', 'optimization'],
      medium: ['frontend', 'backend', 'testing', 'deployment', 'integration', 'ui', 'ux']
    };

    // Count high-difficulty keywords
    techKeywords.high.forEach(keyword => {
      if (text.includes(keyword)) {
        difficulty += 0.8;
      }
    });

    // Count medium-difficulty keywords
    techKeywords.medium.forEach(keyword => {
      if (text.includes(keyword)) {
        difficulty += 0.4;
      }
    });

    return Math.min(difficulty, 3); // Max 3 points for technical difficulty
  }

  getComplexityLevel(score) {
    if (score >= 4) return 'very-high';
    if (score >= 3) return 'high';
    if (score >= 2) return 'medium';
    if (score >= 1.5) return 'low';
    return 'very-low';
  }

  generateRecommendations(analysis, tasks) {
    const recommendations = [];

    if (analysis.averageComplexity > 3.5) {
      recommendations.push('Break down complex tasks into smaller subtasks');
    }

    if (analysis.highPriorityTasks > analysis.totalTasks * 0.6) {
      recommendations.push('Rebalance task priorities to avoid bottlenecks');
    }

    if (analysis.complexTasks.length > 0) {
      recommendations.push(`Focus on ${analysis.complexTasks.length} high-complexity tasks first`);
    }

    const tasksWithDeps = tasks.filter(t => t.dependencies && t.dependencies.length > 2);
    if (tasksWithDeps.length > 0) {
      recommendations.push('Simplify dependency chains for better parallel execution');
    }

    if (recommendations.length === 0) {
      recommendations.push('Project complexity is well-balanced');
    }

    return recommendations;
  }

  // Advanced analysis methods
  analyzeDependencies(tasks) {
    const graph = {};
    const cycles = [];

    // Build dependency graph
    tasks.forEach(task => {
      graph[task.id] = task.dependencies || [];
    });

    // Detect cycles (simplified)
    for (const taskId in graph) {
      if (this.hasCycle(taskId, graph, new Set())) {
        cycles.push(taskId);
      }
    }

    return {
      totalDependencies: Object.values(graph).reduce((sum, deps) => sum + deps.length, 0),
      cyclesDetected: cycles.length,
      longestChain: this.findLongestChain(graph),
      parallelTasks: this.findParallelTasks(graph)
    };
  }

  hasCycle(taskId, graph, visited) {
    if (visited.has(taskId)) return true;
    visited.add(taskId);

    for (const dep of graph[taskId] || []) {
      if (this.hasCycle(dep, graph, new Set(visited))) {
        return true;
      }
    }

    return false;
  }

  findLongestChain(graph) {
    let maxLength = 0;

    for (const taskId in graph) {
      const length = this.getChainLength(taskId, graph, new Set());
      maxLength = Math.max(maxLength, length);
    }

    return maxLength;
  }

  getChainLength(taskId, graph, visited) {
    if (visited.has(taskId)) return 0;
    visited.add(taskId);

    let maxChildLength = 0;
    for (const dep of graph[taskId] || []) {
      maxChildLength = Math.max(maxChildLength, this.getChainLength(dep, graph, new Set(visited)));
    }

    return 1 + maxChildLength;
  }

  findParallelTasks(graph) {
    const inDegree = {};

    // Calculate in-degrees
    for (const taskId in graph) {
      inDegree[taskId] = 0;
    }

    for (const deps of Object.values(graph)) {
      deps.forEach(dep => {
        inDegree[dep] = (inDegree[dep] || 0) + 1;
      });
    }

    // Tasks with no dependencies can run in parallel
    return Object.entries(inDegree)
      .filter(([_, degree]) => degree === 0)
      .map(([taskId, _]) => taskId);
  }
}
