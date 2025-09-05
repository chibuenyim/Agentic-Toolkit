# 🛠️ Agentic Toolkit

A global CLI for agentic development with multi-provider AI support (OpenRouter & Ollama).

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

This project is licensed under the MIT License - see the LICENSE file for details.
