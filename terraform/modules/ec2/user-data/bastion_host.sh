#!/bin/bash
set -e  # Exit on any error

# Redirect all output to a log file
exec > >(tee -a /var/log/ec2_user_data.log)
exec 2>&1

echo "Starting user data script..."

# create note as ubuntu user
sudo -u ubuntu bash -c 'echo "# Bastion Host Initialized" > /home/ubuntu/bastion_host.md'
sudo -u ubuntu bash -c 'echo "Created on first boot" >> /home/ubuntu/bastion_host.md'

echo "User data script completed successfully!"
