#!/usr/bin/env bash

# Agentic Toolkit - VS Code Setup Script

set -e

echo "🤖 Agentic Toolkit - VS Code Setup"
echo "=================================="

# Check if VS Code is installed
if ! command -v code &> /dev/null; then
    echo "❌ VS Code is not installed or not in PATH"
    echo "Please install VS Code and make sure 'code' command is available"
    exit 1
fi

echo "✅ VS Code found"

# Create .vscode directory if it doesn't exist
mkdir -p .vscode

# Create settings.json
echo "⚙️ Creating VS Code settings..."
cat > .vscode/settings.json << EOF
{
  // Agentic Toolkit Configuration
  "agentic.enable": true,
  "agentic.autoPlan": true,
  "agentic.provider": "openrouter",
  "agentic.model": "anthropic/claude-3.5-sonnet",
  "agentic.complexityThreshold": 3,
  "agentic.autoRun": false,

  // Editor settings for better development experience
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  // File associations
  "files.associations": {
    "plan.md": "markdown",
    "tasks.json": "json"
  },

  // Recommended extensions
  "recommendations": [
    "ms-vscode.vscode-json",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss"
  ]
}
EOF

# Create tasks.json for VS Code tasks
echo "📋 Creating VS Code tasks..."
cat > .vscode/tasks.json << EOF
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Agentic: Plan Project",
      "type": "shell",
      "command": "agentic",
      "args": ["plan"],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "Agentic: Get Next Task",
      "type": "shell",
      "command": "agentic",
      "args": ["next"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Agentic: Analyze Complexity",
      "type": "shell",
      "command": "agentic",
      "args": ["analyze"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Agentic: List Tasks",
      "type": "shell",
      "command": "agentic",
      "args": ["list"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
EOF

# Create launch.json for debugging
echo "🐛 Creating VS Code launch configuration..."
cat > .vscode/launch.json << EOF
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Agentic Toolkit",
      "type": "node",
      "request": "launch",
      "program": "\${workspaceFolder}/bin/agentic-toolkit.js",
      "args": ["--help"],
      "console": "integratedTerminal",
      "skipFiles": [
        "<node_internals>/**"
      ]
    },
    {
      "name": "Debug Current Project",
      "type": "node",
      "request": "launch",
      "program": "\${workspaceFolder}/src/index.js",
      "console": "integratedTerminal",
      "skipFiles": [
        "<node_internals>/**"
      ]
    }
  ]
}
EOF

# Create extensions.json for workspace recommendations
echo "📦 Creating extension recommendations..."
cat > .vscode/extensions.json << EOF
{
  "recommendations": [
    "ms-vscode.vscode-json",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-jest",
    "ms-vscode.vscode-node-debug",
    "ms-vscode.vscode-node-debug2"
  ],
  "unwantedRecommendations": [
    "ms-vscode.vscode-typescript",
    "hookyqr.beautify"
  ]
}
EOF

echo ""
echo "✅ VS Code configuration completed!"
echo ""
echo "📂 Created files:"
echo "   ├── .vscode/settings.json      # Agentic Toolkit settings"
echo "   ├── .vscode/tasks.json         # VS Code tasks for Agentic commands"
echo "   ├── .vscode/launch.json        # Debug configurations"
echo "   └── .vscode/extensions.json    # Recommended extensions"
echo ""
echo "🚀 VS Code is now configured for Agentic Toolkit!"
echo ""
echo "💡 Next steps:"
echo "   1. Reload VS Code window (Ctrl/Cmd + Shift + P → 'Developer: Reload Window')"
echo "   2. Install recommended extensions when prompted"
echo "   3. Use Command Palette (Ctrl/Cmd + Shift + P) to access Agentic commands:"
echo "      - 'Tasks: Run Task' → Select Agentic commands"
echo "      - 'Agentic: Plan Project' (if extension is available)"
echo ""
echo "🤖 Happy coding with Agentic Toolkit in VS Code!"
