---
title: "Terraform Basics"
description: "Essential Terraform commands and infrastructure as code fundamentals"
tags: [terraform, infrastructure-as-code, devops, aws, cloud]
draft: false
date: 2025-10-21
lastmod: 2025-10-21
---

## Core Concepts

Terraform is an Infrastructure as Code (IaC) tool for building, changing, and versioning infrastructure safely and efficiently.

- **Declarative**: Define what infrastructure you want, not how to create it
- **State Management**: Tracks actual infrastructure state
- **Provider-Agnostic**: Works with AWS, Azure, GCP, and others
- **Plan Before Apply**: Preview changes before execution

## Installation

```bash
# macOS
brew install terraform

# Verify installation
terraform version
```

## Essential Commands

### Initialize Project

```bash
# Initialize working directory (first command to run)
terraform init

# Download and install provider plugins
# Creates .terraform directory and lock file
```

### Format and Validate

```bash
# Format code to canonical style
terraform fmt

# Validate configuration syntax
terraform validate
```

### Plan Changes

```bash
# Preview changes before applying
terraform plan

# Save plan to file
terraform plan -out=tfplan

# Show what will be destroyed
terraform plan -destroy
```

### Apply Changes

```bash
# Apply changes (with confirmation)
terraform apply

# Apply without confirmation prompt
terraform apply -auto-approve

# Apply saved plan
terraform apply tfplan
```

### Destroy Resources

```bash
# Destroy all resources (with confirmation)
terraform destroy

# Destroy without confirmation
terraform destroy -auto-approve

# Destroy specific resource
terraform destroy -target=aws_instance.example
```

### Show Current State

```bash
# Show current state
terraform show

# List resources in state
terraform state list

# Show specific resource
terraform state show aws_instance.example
```

## Basic Configuration

### Simple Example

```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  
  tags = {
    Name = "example-instance"
  }
}
```

### Variables

```hcl
# variables.tf
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

# Use in main.tf
resource "aws_instance" "example" {
  instance_type = var.instance_type
}
```

### Outputs

```hcl
# outputs.tf
output "instance_id" {
  description = "ID of EC2 instance"
  value       = aws_instance.example.id
}

output "instance_public_ip" {
  description = "Public IP of EC2 instance"
  value       = aws_instance.example.public_ip
}
```

## Common Workflow

```bash
# 1. Initialize project
terraform init

# 2. Format code
terraform fmt

# 3. Validate configuration
terraform validate

# 4. Preview changes
terraform plan

# 5. Apply changes
terraform apply

# 6. View outputs
terraform output

# 7. When done, destroy
terraform destroy
```

## State Management

```bash
# Refresh state from actual infrastructure
terraform refresh

# Pull remote state
terraform state pull

# Push local state to remote
terraform state push

# Remove resource from state (doesn't destroy)
terraform state rm aws_instance.example

# Move resource in state
terraform state mv aws_instance.old aws_instance.new
```

## Workspace Commands

```bash
# List workspaces
terraform workspace list

# Create new workspace
terraform workspace new dev

# Switch workspace
terraform workspace select dev

# Delete workspace
terraform workspace delete dev
```

## Import Existing Resources

```bash
# Import existing AWS instance into state
terraform import aws_instance.example i-1234567890abcdef0

# General syntax
terraform import <resource_type>.<name> <resource_id>
```

## Common Patterns

### Multiple Resources

```hcl
resource "aws_instance" "web" {
  count         = 3
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  
  tags = {
    Name = "web-${count.index}"
  }
}
```

### Data Sources

```hcl
# Query existing resources
data "aws_ami" "ubuntu" {
  most_recent = true
  
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
}

resource "aws_instance" "example" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t2.micro"
}
```

### Locals

```hcl
locals {
  common_tags = {
    Project     = "MyProject"
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}

resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  tags          = local.common_tags
}
```

## Backend Configuration

```hcl
# Store state in S3
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}
```

## Troubleshooting

```bash
# Enable detailed logging
export TF_LOG=DEBUG
terraform apply

# Specific log levels: TRACE, DEBUG, INFO, WARN, ERROR
export TF_LOG=TRACE

# Save logs to file
export TF_LOG_PATH=./terraform.log

# Disable logging
unset TF_LOG

# Unlock state if locked
terraform force-unlock <lock-id>
```

## Best Practices

```bash
# Always format before commit
terraform fmt -recursive

# Use version constraints
terraform {
  required_version = ">= 1.0"
}

# Use remote state for team projects
# Keep state files secure (never commit to git)

# Use .gitignore
echo ".terraform/" >> .gitignore
echo "*.tfstate" >> .gitignore
echo "*.tfstate.backup" >> .gitignore
echo "terraform.tfvars" >> .gitignore
```

## Related Topics

- [[aws]] - AWS services and infrastructure
- [[docker]] - Container infrastructure
- [[ci-cd]] - Deployment automation
