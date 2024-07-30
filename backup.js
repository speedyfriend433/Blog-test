const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'database.sqlite');
const backupPath = path.join(__dirname, 'backup', `database-backup-${Date.now()}.sqlite`);

fs.copyFile(sourcePath, backupPath, (err) => {
  if (err) {
    console.error('Error backing up database:', err);
  } else {
    console.log('Database backup successful:', backupPath);
  }
});
