# Makefile for managing Docker Compose services
.DEFAULT_GOAL := help

# Commands
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  Start   - Start the service (for local development)"

.PHONY: start
start:
	python3 -m http.server 8000