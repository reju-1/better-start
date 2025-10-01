## -----------------------Backend-Instance------------------------------
resource "aws_instance" "backend" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = var.public_subnet_ids[0]
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.public_sg["backend"].id]

  tags = {
    Name = "BS-Backend-Instance"
    Role = "Backend"
  }
}

## -----------------------Frontend-Instance------------------------------
resource "aws_instance" "frontend" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = var.public_subnet_ids[0]
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.public_sg["frontend"].id]

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

  tags = {
    Name = "BS-Worker-Instance"
    Role = "Worker"
  }
}
