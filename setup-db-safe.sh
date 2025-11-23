#!/bin/bash

# Safe Database Setup Script for Existing Servers
# This script creates the database and user without reinstalling PostgreSQL

set -e

# Configuration
DB_NAME="takatracker_db"
DB_USER="takatracker_user"
DB_PASS="CHANGE_THIS_SECURE_PASSWORD" # Change this!

echo "🚀 Setting up Takatracker database..."

# Check if PostgreSQL is running
if ! systemctl is-active --quiet postgresql; then
    echo "❌ PostgreSQL is not running! Please start it first."
    exit 1
fi

echo "✅ PostgreSQL is running."

# Create User
echo "👤 Creating database user '$DB_USER'..."
sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';" || echo "⚠️  User might already exist (ignoring)"

# Create Database
echo "🗄️  Creating database '$DB_NAME'..."
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" || echo "⚠️  Database might already exist (ignoring)"

# Grant Privileges
echo "🔑 Granting privileges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Verify
echo "🔍 Verifying setup..."
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "✅ Database '$DB_NAME' exists."
else
    echo "❌ Failed to create database."
    exit 1
fi

echo "✅ Database setup complete!"
echo "👉 Update your .env file with:"
echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME\""
