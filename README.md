# 🤖 Agentic Toolkit v2.0

**Truly Agentic Development** - AI-powered planning and execution for autonomous software development
**Multi-Agent Architecture** - Specialized agents for planning, implementation, testing, and deployment
**Infrastructure-Aware** - Automatically adapts to your environment and deployment requirements

## 🚀 v2 Agentic Capabilities

### 🤖 Agent Swarm Architecture
- **Planning Agent**: Transforms requirements into hierarchical executable tasks
- **Implementation Agent**: Code generation with automated testing and optimization
- **Testing Agent**: Comprehensive test suite generation and validation
- **Deployment Agent**: Infrastructure provisioning and production deployment
- **Monitoring Agent**: Performance tracking and continuous optimization

### 🎯 Agentic Workflow Integration
- **Hierarchical Task Breakdown**: Multi-level planning optimized for agent processing
- **Parallel Execution**: Agents work simultaneously on independent tasks
- **Real-time Adaptation**: Dynamic plan evolution based on agent feedback
- **Infrastructure Intelligence**: Deployment strategies based on detected environment

### 📋 Open Core Model

**Free & Open Source**: Core agent capabilities available under MIT License
**Premium Features**: Advanced multi-agent orchestration with commercial licensing

#### Core Features (Free)
- ✅ Agent-optimized task planning and breakdown
- ✅ OpenRouter and Ollama AI provider integration
- ✅ CLI interface for agent workflow management
- ✅ Infrastructure detection and recommendations
- ✅ Community support and basic agent orchestration

#### Premium Features (Commercial License Required)
- 🔒 Multi-agent swarm orchestration
- 🔒 Advanced AI model integrations
- 🔒 Enterprise-grade security and compliance
- 🔒 Priority support and custom agent development
- 🔒 Extended automation and monitoring capabilities

## Installation

### Global Installation (Recommended)

```bash
npm install -g agentic-toolkit
```

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/chibuenyim/Agentic-Toolkit.git
   cd agentic-toolkit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Link for development:
   ```bash
   npm link
   ```

## Setup

1. Copy the environment template:
   ```bash
   cp config/.env.example .env
   ```

2. Edit `.env` with your API keys:
   - For OpenRouter: Add your `OPENROUTER_API_KEY`
   - For Ollama: Configure the VPS IP and model

## Usage

### Basic Commands

```bash
# Show usage
agentic-toolkit

# Generate tasks from plan.md
agentic-toolkit plan

# Show example plan template
agentic-toolkit example
```

### Provider Switching

```bash
# Switch to OpenRouter
./scripts/switch-openrouter.sh

# Switch to Ollama
./scripts/switch-ollama.sh
```

### Development Workflow

```bash
# Use the convenience script
./scripts/plan.sh
```

## Configuration

The toolkit supports multiple AI providers:

### OpenRouter (Default)
- Uses Claude 3.5 Sonnet
- Requires API key
- Best for production use

### Ollama (Self-hosted)
- Runs on your VPS
- No API costs
- Requires Ollama server setup

## Project Structure

```
agentic-toolkit/
├── bin/
│   └── agentic-toolkit.js    # Main CLI entry point
├── config/
│   └── .env.example          # Environment template
├── templates/
│   └── plan.md               # Example project plan
└── scripts/
    ├── plan.sh               # Convenience script
    ├── switch-openrouter.sh  # Provider switcher
    └── switch-ollama.sh      # Provider switcher
```

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project follows an Open Core model - see the LICENSE file for complete licensing details.
