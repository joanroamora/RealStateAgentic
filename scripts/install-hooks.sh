#!/usr/bin/env bash
# Script to install git hooks into the repository configuration

chmod +x .githooks/commit-msg
git config core.hooksPath .githooks

echo "[INFO] Git hooks configured successfully. Hooks path set to '.githooks'."
