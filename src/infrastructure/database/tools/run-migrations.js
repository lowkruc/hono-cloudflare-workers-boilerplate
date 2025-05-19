#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get environment from command line
const args = process.argv.slice(2);
const environment = args[0] || '';
const envFlag = environment ? `--env ${environment}` : '';

// Define the migrations directory
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

// Database name from wrangler.toml (could be made more robust by actually parsing the file)
const DB_BINDING = 'DB';

// Check if migrations directory exists
if (!fs.existsSync(MIGRATIONS_DIR)) {
  console.error(`Migrations directory not found: ${MIGRATIONS_DIR}`);
  process.exit(1);
}

// Check if there are any migration files
const migrationFiles = fs.readdirSync(MIGRATIONS_DIR).filter(file => file.endsWith('.sql'));
if (migrationFiles.length === 0) {
  console.log('No migration files found.');
  process.exit(0);
}

console.log(`Found ${migrationFiles.length} migration files.`);
console.log(`Running migrations with ${environment ? `${environment} environment` : 'default environment'}`);

try {
  // Run migrations using wrangler
  const command = `npx wrangler d1 migrations apply ${DB_BINDING} ${envFlag}`;
  console.log(`Executing: ${command}`);
  
  const output = execSync(command, { stdio: 'inherit' });
  
  console.log('Migrations completed successfully!');
} catch (error) {
  console.error('Error running migrations:', error.message);
  process.exit(1);
} 