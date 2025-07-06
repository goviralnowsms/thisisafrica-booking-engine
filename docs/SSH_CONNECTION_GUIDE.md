# SSH Connection Guide for Tourplan Booking Engine

This guide helps you connect to your AWS EC2 instance using SSH from your Windows development environment.

## Prerequisites

- AWS EC2 instance running Ubuntu
- SSH key file (`tourplan-ubuntu-key.pem`)
- Security group configured to allow SSH from your IP
- Elastic IP associated with your instance

## Quick Setup

### 1. Copy SSH Key to Project

```powershell
.\scripts\copy-key-file.ps1
