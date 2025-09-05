#!/usr/bin/env bash
echo "🔄 Switching to Ollama provider..."
cp config/.env.example .env
# Modify .env to use Ollama
sed -i 's/^# PROVIDER=openai/PROVIDER=openai/' .env
sed -i 's/^# OPENAI_API_KEY=dummy/OPENAI_API_KEY=dummy/' .env
sed -i 's/^# OPENAI_BASE_URL=http:\/\/<YOUR_VPS_IP>:11434\/v1/OPENAI_BASE_URL=http:\/\/<YOUR_VPS_IP>:11434\/v1/' .env
sed -i 's/^# MODEL=llama3:8b/MODEL=llama3:8b/' .env
echo "✅ Configured for Ollama. Update <YOUR_VPS_IP> in .env."
