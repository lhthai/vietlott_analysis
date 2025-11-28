const fs = require('fs');
const path = require('path');

// Test script to check current data
function checkCurrentData() {
  const dataFile = path.join(__dirname, 'data', 'power655.jsonl');
  
  if (!fs.existsSync(dataFile)) {
    console.log('Data file does not exist');
    return;
  }
  
  const content = fs.readFileSync(dataFile, 'utf8');
  const lines = content.trim().split('\n');
  const data = lines.map(line => JSON.parse(line));
  
  console.log(`Total entries in file: ${data.length}`);
  console.log(`Latest 5 entries:`);
  
  data.slice(0, 5).forEach((item, index) => {
    console.log(`${index + 1}. ID: ${item.id}, Date: ${item.date}, Numbers: ${item.result.join(', ')}`);
  });
  
  console.log(`\nOldest 5 entries:`);
  data.slice(-5).forEach((item, index) => {
    console.log(`${index + 1}. ID: ${item.id}, Date: ${item.date}, Numbers: ${item.result.join(', ')}`);
  });
  
  // Check for duplicate IDs
  const ids = data.map(item => item.id);
  const uniqueIds = new Set(ids);
  console.log(`\nUnique IDs: ${uniqueIds.size}, Total entries: ${ids.length}`);
  
  if (uniqueIds.size !== ids.length) {
    console.log('WARNING: Duplicate IDs found!');
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    console.log('Duplicate IDs:', [...new Set(duplicates)]);
  }
}

// Check public data file too
function checkPublicData() {
  const publicDataFile = path.join(__dirname, 'public', 'data', 'power655.jsonl');
  
  if (!fs.existsSync(publicDataFile)) {
    console.log('Public data file does not exist');
    return;
  }
  
  const content = fs.readFileSync(publicDataFile, 'utf8');
  const lines = content.trim().split('\n');
  const data = lines.map(line => JSON.parse(line));
  
  console.log(`\nPublic data file entries: ${data.length}`);
}

if (require.main === module) {
  console.log('=== Checking Current Data ===');
  checkCurrentData();
  checkPublicData();
} 