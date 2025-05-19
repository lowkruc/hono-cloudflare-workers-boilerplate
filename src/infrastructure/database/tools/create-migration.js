#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

// Ensure migrations directory exists
if (!fs.existsSync(MIGRATIONS_DIR)) {
  fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get migration name from command line arguments or prompt
const getMigrationName = () => {
  return new Promise((resolve) => {
    const args = process.argv.slice(2);
    if (args.length > 0) {
      resolve(args[0]);
    } else {
      rl.question('Enter migration name (e.g. add_users_table): ', (answer) => {
        resolve(answer);
      });
    }
  });
};

// Get the next migration number
const getNextMigrationNumber = () => {
  const files = fs.readdirSync(MIGRATIONS_DIR);
  
  if (files.length === 0) {
    return '0000';
  }
  
  const numbers = files
    .filter(file => file.endsWith('.sql'))
    .map(file => parseInt(file.split('_')[0], 10))
    .filter(num => !isNaN(num))
    .sort((a, b) => b - a);
  
  const nextNumber = numbers.length > 0 ? numbers[0] + 1 : 0;
  return nextNumber.toString().padStart(4, '0');
};

// Create migration file
const createMigration = async () => {
  const migrationName = await getMigrationName();
  if (!migrationName) {
    console.error('Migration name is required');
    rl.close();
    return;
  }
  
  const formattedName = migrationName.toLowerCase().replace(/\s+/g, '_');
  const nextNumber = getNextMigrationNumber();
  const fileName = `${nextNumber}_${formattedName}.sql`;
  const filePath = path.join(MIGRATIONS_DIR, fileName);
  
  // Migration file template
  const migrationContent = `-- Migration: ${formattedName}
-- Description: 
-- Created: ${new Date().toISOString()}

-- Up migration

-- Down migration
-- Add DOWN migration statements below (commented out)
-- These will be used by the migrate-down tool
-- -- DROP TABLE table_name;
`;
  
  fs.writeFileSync(filePath, migrationContent);
  console.log(`Created migration: ${filePath}`);
  rl.close();
};

createMigration().catch(err => {
  console.error('Error creating migration:', err);
  rl.close();
}); 