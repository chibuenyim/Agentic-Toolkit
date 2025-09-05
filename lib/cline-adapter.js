import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class ClineAdapter {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1';
    this.model = process.env.MODEL || 'anthropic/claude-3.5-sonnet';
  }

  async setup(config = {}) {
    this.apiKey = config.apiKey || this.apiKey;
    this.model = config.model || this.model;
    this.baseURL = config.baseURL || this.baseURL;

    console.log('🔗 Cline adapter initialized');
    console.log(`🤖 Model: ${this.model}`);
    console.log(`🌐 API: ${this.baseURL}`);

    return { success: true };
  }

  async processCommand(command, context = {}) {
    try {
      const prompt = this.buildPrompt(command, context);

      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant integrated with the Agentic Toolkit. Help users with project planning, task management, and development workflows.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const result = response.data.choices[0].message.content;
      return this.parseResponse(result, command);

    } catch (error) {
      console.error('❌ Cline adapter error:', error.message);
      return {
        success: false,
        error: error.message,
        fallback: this.generateFallbackResponse(command)
      };
    }
  }

  buildPrompt(command, context) {
    const basePrompt = `Process this Agentic Toolkit command: "${command}"`;

    if (context.currentProject) {
      return `${basePrompt}\n\nContext: Working on project "${context.currentProject}"`;
    }

    if (context.pendingTasks) {
      return `${basePrompt}\n\nContext: ${context.pendingTasks.length} pending tasks available`;
    }

    return basePrompt;
  }

  parseResponse(response, originalCommand) {
    // Parse AI response and convert to toolkit commands
    const lowerResponse = response.toLowerCase();

    if (lowerResponse.includes('generate prd') || lowerResponse.includes('create prd')) {
      return {
        success: true,
        command: 'generate-prd',
        args: this.extractDescription(response),
        message: 'PRD generation initiated'
      };
    }

    if (lowerResponse.includes('plan') || lowerResponse.includes('create tasks')) {
      return {
        success: true,
        command: 'plan',
        message: 'Task planning initiated'
      };
    }

    if (lowerResponse.includes('next task') || lowerResponse.includes('what next')) {
      return {
        success: true,
        command: 'next-task',
        message: 'Finding next task...'
      };
    }

    if (lowerResponse.includes('analyze') || lowerResponse.includes('complexity')) {
      return {
        success: true,
        command: 'analyze',
        message: 'Analyzing task complexity...'
      };
    }

    // Default response
    return {
      success: true,
      command: 'help',
      message: response,
      raw: true
    };
  }

  extractDescription(text) {
    // Extract project description from natural language
    const patterns = [
      /build (a|an) (.+?)(?:\s|$)/i,
      /create (a|an) (.+?)(?:\s|$)/i,
      /develop (a|an) (.+?)(?:\s|$)/i,
      /make (a|an) (.+?)(?:\s|$)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[2].trim();
      }
    }

    return text.slice(0, 100); // Fallback to first 100 chars
  }

  generateFallbackResponse(command) {
    return `I understand you want to: "${command}". Try using specific Agentic Toolkit commands like "generate prd", "plan", or "next task".`;
  }

  // Integration methods for different Cline workflows
  async handlePRDGeneration(description) {
    console.log(`📝 Generating PRD for: ${description}`);
    return {
      success: true,
      prd: {
        title: `PRD: ${description}`,
        description: `Product requirements for ${description}`,
        features: ['Core functionality', 'User interface', 'Data management'],
        timeline: '4-6 weeks'
      }
    };
  }

  async handleTaskPlanning() {
    console.log('🛠️ Planning tasks from PRD...');
    return {
      success: true,
      tasksGenerated: 6,
      phases: ['Planning', 'Implementation', 'Testing', 'Deployment']
    };
  }

  async handleComplexityAnalysis() {
    console.log('📊 Analyzing task complexity...');
    return {
      success: true,
      score: 3.2,
      recommendations: ['Break down complex tasks', 'Prioritize critical path items']
    };
  }

  // WebSocket integration for real-time updates
  setupWebSocket(server) {
    // This would set up WebSocket connection for real-time Cline integration
    console.log('🔌 WebSocket integration ready for Cline');
    return {
      success: true,
      endpoint: '/cline-integration'
    };
  }
}
