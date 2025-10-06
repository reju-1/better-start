#!/bin/bash
set -e  # Exit on any error

# Redirect output to log file
exec > >(tee -a /var/log/ec2_user_data.log)
exec 2>&1

echo "Starting user data script..."

# ====== Update and Upgrade ======
export DEBIAN_FRONTEND=noninteractive
apt-get update -y && apt-get upgrade -y

# ====== Install Python, pip, and pipx ======
apt-get install -y python3 python3-pip python3-venv pipx

# ====== Ensure pipx is in PATH ======
pipx ensurepath

# ====== Install uv via pipx ======
pipx install uv

# ====== Make uv available system-wide ======
# pipx installs to /root/.local/bin by default
export PATH="$PATH:/root/.local/bin"
echo 'export PATH="$PATH:/root/.local/bin"' >> /root/.bashrc
echo 'export PATH="$PATH:/root/.local/bin"' >> /etc/profile

# ====== Verify Installation ======
echo "Python version:"
python3 --version
echo "Pip version:"
pip3 --version
echo "UV version:"
/root/.local/bin/uv --version

echo "User data script completed successfully!"
