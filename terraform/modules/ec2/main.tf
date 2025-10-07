## -----------------------Bastion-Host------------------------------
resource "aws_instance" "bastion" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = var.public_subnet_ids[0]
  key_name               = var.key_name
  vpc_security_group_ids = [var.bastion_host_sg_id]

  tags = {
    Name = "BS-Bastion-Host"
    Role = "Bastion-host"
  }
}

## -----------------------Backend-Instance------------------------------
resource "aws_instance" "backend" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = var.private_subnet_ids[0]
  key_name               = var.key_name
  vpc_security_group_ids = [var.ec2_sg_id]
  user_data              = file("${path.module}/user-data/python_backend.sh")

  tags = {
    Name = "BS-Backend-Instance"
    Role = "Backend"
  }
}

## -----------------------Frontend-Instance------------------------------
resource "aws_instance" "frontend" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = var.private_subnet_ids[0]
  key_name               = var.key_name
  vpc_security_group_ids = [var.ec2_sg_id]
  user_data              = file("${path.module}/user-data/node_frontend.sh")


  tags = {
    Name = "BS-Frontend-Instance"
    Role = "Frontend"
  }
}

## ----------------------------Worker-Instance----------------------------------
resource "aws_instance" "worker" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = var.private_subnet_ids[0]
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.worker_sg.id]
  user_data              = file("${path.module}/user-data/python_worker.sh")

  tags = {
    Name = "BS-Worker-Instance"
    Role = "Worker"
  }
}
