#!/bin/bash
set -e  # Exit on any error

# Redirect all output to a log file
exec > >(tee -a /var/log/ec2_user_data.log)
exec 2>&1

echo "=== Starting Node.js installation via NVM ==="

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl build-essential git

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Source NVM in the current shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install and use Node.js
nvm install 22
nvm use 22
nvm alias default 22

# Create system-wide symlinks (optional - only if needed)
NODE_PATH=$(which node)
NPM_PATH=$(which npm)
ln -sf "$NODE_PATH" /usr/local/bin/node 2>/dev/null || true
ln -sf "$NPM_PATH" /usr/local/bin/npm 2>/dev/null || true

# Verify installation
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"
echo "NVM version: $(nvm --version)"

echo "=== Node.js installation completed successfully! ==="

# Optional: Add to bashrc for future sessions
cat >> ~/.bashrc << 'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF


# =======================Create a note and Bring the Code============================

# Create a note as ubuntu user
sudo -u ubuntu bash -c 'echo "# Frontend Initialized" > /home/ubuntu/frontend.md'
sudo -u ubuntu bash -c 'echo "Created on first boot" >> /home/ubuntu/frontend.md'

# Clone repo as ubuntu user
sudo -u ubuntu git clone https://github.com/reju-1/better-start.git /home/ubuntu/better-start
