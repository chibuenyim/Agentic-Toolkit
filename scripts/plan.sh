#!/usr/bin/env bash
if [ ! -f ".env" ]; then
  echo "⚠️ Copy config/.env.example to .env first."
  exit 1
fi

agentic-toolkit plan
