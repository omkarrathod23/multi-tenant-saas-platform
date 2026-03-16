# Deployment Guide

## AWS EC2 Deployment

### Prerequisites
- AWS Account
- EC2 Instance (t3.medium or larger recommended)
- Domain name (optional, for SSL)
- Security groups configured

### Step 1: Launch EC2 Instance

1. Log in to AWS Console
2. Navigate to EC2 → Launch Instance
3. Choose Ubuntu 22.04 LTS
4. Select instance type: t3.medium (minimum)
5. Configure security group:
   - SSH (22) from your IP
   - HTTP (80) from anywhere
   - HTTPS (443) from anywhere
   - Custom TCP (8080) from anywhere (or restrict to your IP)
6. Launch instance and download key pair

### Step 2: Connect to EC2 Instance

```bash
# Set permissions for key file
chmod 400 your-key.pem

# Connect via SSH
ssh -i your-key.pem ubuntu@<your-ec2-ip>
```

### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 17
sudo apt install openjdk-17-jdk -y
java -version  # Verify installation

# Install Maven
sudo apt install maven -y
mvn -version  # Verify installation

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # Verify installation
npm -v   # Verify installation

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
docker --version  # Verify installation

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version  # Verify installation

# Log out and log back in for Docker group to take effect
exit
# Reconnect via SSH
```

### Step 4: Clone and Configure Application

```bash
# Install Git if not already installed
sudo apt install git -y

# Clone your repository
git clone <your-repo-url>
cd multi-tenant-saas

# Create .env file
cat > .env << EOF
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password-here
JWT_SECRET=your-256-bit-secret-key-minimum-32-characters-long
EOF

# Generate a secure JWT secret (optional)
openssl rand -base64 32
```

### Step 5: Build and Deploy with Docker

```bash
# Build and start all services
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Check running containers
docker-compose ps
```

### Step 6: Configure Nginx Reverse Proxy (Recommended)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/saas-app
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or EC2 IP

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/saas-app /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

### Step 7: Set Up SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com

# Certbot will automatically configure Nginx and set up auto-renewal
# Test renewal
sudo certbot renew --dry-run
```

### Step 8: Configure Firewall

```bash
# Allow Nginx through firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow 'OpenSSH'
sudo ufw enable
sudo ufw status
```

### Step 9: Set Up Auto-Start on Reboot

```bash
# Create systemd service for docker-compose (optional)
sudo nano /etc/systemd/system/saas-app.service
```

Add:

```ini
[Unit]
Description=Multi-Tenant SaaS Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/multi-tenant-saas
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

```bash
# Enable service
sudo systemctl enable saas-app.service
sudo systemctl start saas-app.service
```

### Step 10: Monitor Application

```bash
# View application logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Check container status
docker-compose ps

# View resource usage
docker stats
```

### Step 11: Database Backup (Important)

```bash
# Create backup script
nano ~/backup-db.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker-compose exec -T postgres pg_dump -U postgres saas_db > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

```bash
# Make executable
chmod +x ~/backup-db.sh

# Add to crontab for daily backups at 2 AM
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup-db.sh
```

## Troubleshooting

### Application Not Starting

```bash
# Check Docker containers
docker-compose ps

# Check logs
docker-compose logs

# Restart services
docker-compose restart
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose exec postgres pg_isready

# Connect to database
docker-compose exec postgres psql -U postgres -d saas_db

# Check database schemas
\dn
```

### Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :8080
sudo lsof -i :3000
sudo lsof -i :5432

# Kill process if needed
sudo kill -9 <PID>
```

### Nginx Not Working

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t
```

## Security Best Practices

1. **Change Default Passwords**: Update all default passwords in `.env`
2. **Use Strong JWT Secret**: Generate a secure 32+ character secret
3. **Restrict Security Groups**: Only open necessary ports
4. **Enable SSL**: Always use HTTPS in production
5. **Regular Updates**: Keep system and dependencies updated
6. **Backup Database**: Set up automated backups
7. **Monitor Logs**: Regularly check application logs
8. **Use Environment Variables**: Never commit secrets to repository

## Scaling Considerations

### Horizontal Scaling

For multiple instances:
1. Use AWS RDS for PostgreSQL (managed database)
2. Use AWS Application Load Balancer
3. Use AWS S3 for file storage
4. Use Redis for session management (if needed)
5. Use AWS CloudFront for CDN

### Vertical Scaling

1. Upgrade EC2 instance type
2. Increase database connection pool size
3. Add more memory to containers
4. Optimize database queries

## Cost Optimization

1. Use reserved instances for long-term deployments
2. Use spot instances for development
3. Enable auto-scaling based on load
4. Use CloudWatch for monitoring
5. Set up billing alerts

## Maintenance

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Update System

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker
sudo apt upgrade docker.io

# Restart services
docker-compose restart
```

---

**Note**: This deployment guide assumes a single-server setup. For production environments with high availability, consider using AWS ECS, EKS, or similar container orchestration services.

