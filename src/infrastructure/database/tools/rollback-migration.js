#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Get environment from command line
const args = process.argv.slice(2);
const environment = args[0] || 'dev'; // Default to dev environment
const envFlag = environment ? `--env ${environment}` : '';

// Define the migrations directory
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');
const MIGRATIONS_STATE_FILE = path.join(__dirname, '..', '.migration_state.json');

// Database name from wrangler.toml
const DB_BINDING = 'DB';

console.log(`Using environment: ${environment}`);

// Check if migrations directory exists
if (!fs.existsSync(MIGRATIONS_DIR)) {
  console.error(`Migrations directory not found: ${MIGRATIONS_DIR}`);
  process.exit(1);
}

// Confirm rollback with user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const promptForConfirmation = (migrationFile) => {
  return new Promise((resolve) => {
    rl.question(`Are you sure you want to roll back migration '${migrationFile}'? (y/N): `, (answer) => {
      resolve(answer.toLowerCase() === 'y');
    });
  });
};

// Get all migration files
const getMigrationFiles = () => {
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort((a, b) => {
      const numA = parseInt(a.split('_')[0], 10);
      const numB = parseInt(b.split('_')[0], 10);
      return numA - numB; // Sort ascending
    });
};

// Extract down migrations from a file
const extractDownMigration = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const downSection = content.split('-- Down migration')[1];
    
    if (!downSection) {
      return null;
    }
    
    // Uncomment the SQL statements (remove the '-- ' prefix)
    const downMigration = downSection
      .split('\n')
      .filter(line => line.trim().startsWith('-- --')) // Find commented-out SQL
      .map(line => line.replace('-- --', '').trim()) // Remove comment markers
      .join('\n');
    
    return downMigration || null;
  } catch (error) {
    console.error(`Error parsing migration file ${filePath}:`, error.message);
    return null;
  }
};

// Execute a D1 SQL query
const executeD1Query = (sql) => {
  try {
    // Create a temporary SQL file
    const tempSqlFile = path.join(__dirname, 'temp_rollback.sql');
    fs.writeFileSync(tempSqlFile, sql);
    
    // Execute the SQL file with environment flag
    const command = `npx wrangler d1 execute ${DB_BINDING} ${envFlag} --file=${tempSqlFile}`;
    console.log(`Executing SQL from file with ${envFlag}...`);
    execSync(command, { stdio: 'inherit' });
    
    // Clean up the temp file
    fs.unlinkSync(tempSqlFile);
    
    return true;
  } catch (error) {
    console.error('Error executing SQL:', error.message);
    return false;
  }
};

// Rollback the most recent migration
const rollbackLatestMigration = async () => {
  const migrationFiles = getMigrationFiles();
  
  if (migrationFiles.length === 0) {
    console.log('No migration files found.');
    rl.close();
    return;
  }
  
  // Get the latest migration
  const latestMigration = migrationFiles[migrationFiles.length - 1];
  const migrationPath = path.join(MIGRATIONS_DIR, latestMigration);
  
  console.log(`Latest migration: ${latestMigration}`);
  
  // Extract down migration SQL
  const downMigration = extractDownMigration(migrationPath);
  
  if (!downMigration) {
    console.error(`No down migration found in ${latestMigration}. Ensure it has a "-- Down migration" section with commented SQL statements.`);
    rl.close();
    return;
  }
  
  // Confirm with user
  const confirmed = await promptForConfirmation(latestMigration);
  
  if (!confirmed) {
    console.log('Rollback cancelled.');
    rl.close();
    return;
  }
  
  // Execute down migration
  console.log(`Rolling back migration: ${latestMigration}`);
  const success = executeD1Query(downMigration);
  
  if (success) {
    console.log(`Successfully rolled back migration: ${latestMigration}`);
    
    // Update migration state in D1
    const updateMigrationState = `DELETE FROM d1_migrations WHERE name = '${latestMigration}';`;
    executeD1Query(updateMigrationState);
    
    console.log('Migration state updated.');
  }
  
  rl.close();
};

rollbackLatestMigration().catch(err => {
  console.error('Error rolling back migration:', err);
  rl.close();
  process.exit(1);
}); 