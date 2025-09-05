# Agentic Toolkit v2.0

**Enterprise-Grade AI-Powered Development Platform** - Autonomous software development with multi-agent orchestration
**Multi-Agent Architecture** - Specialized agents for planning, implementation, testing, and deployment
**Infrastructure-Aware** - Intelligent adaptation to enterprise environments and deployment requirements

## Enterprise Capabilities

### Multi-Agent Architecture
- **Planning Agent**: Transforms business requirements into hierarchical executable task structures
- **Implementation Agent**: Automated code generation with comprehensive testing and optimization
- **Testing Agent**: Intelligent test suite generation and validation frameworks
- **Deployment Agent**: Enterprise-grade infrastructure provisioning and production deployment
- **Monitoring Agent**: Real-time performance tracking and continuous optimization

### Agentic Workflow Integration
- **Hierarchical Task Decomposition**: Multi-level planning optimized for autonomous agent processing
- **Parallel Execution Engine**: Simultaneous task processing with intelligent dependency management
- **Dynamic Adaptation**: Real-time plan evolution based on agent feedback and environmental changes
- **Infrastructure Intelligence**: Automated deployment strategy selection based on detected environment

### Open Core Business Model

**Open Source Core**: Essential agent capabilities available under MIT License
**Enterprise Features**: Advanced multi-agent orchestration with commercial licensing

#### Core Features (MIT License)
- Agent-optimized project planning and task decomposition
- OpenRouter and Ollama AI provider integration
- Command-line interface for agent workflow orchestration
- Automated infrastructure detection and deployment recommendations
- Community support and foundational agent orchestration

#### Enterprise Features (Commercial License)
- **Multi-Agent Swarm Orchestration**: Advanced agent coordination and complex workflow management
- **Advanced AI Model Integration**: Custom model deployments and specialized AI solutions
- **Enterprise Security & Compliance**: SOC2, HIPAA, GDPR compliance frameworks and audit trails
- **Priority Enterprise Support**: 24/7 dedicated support with SLA guarantees
- **Custom Agent Development**: Tailored agent development for industry-specific use cases
- **Extended Automation**: Enterprise-scale multi-agent orchestration and workflow automation

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
