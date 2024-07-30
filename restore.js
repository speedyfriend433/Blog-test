const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, 'backup', 'database-backup-to-restore.sqlite');
const destinationPath = path.join(__dirname, 'database.sqlite');

fs.copyFile(backupPath, destinationPath, (err) => {
  if (err) {
    console.error('Error restoring database:', err);
  } else {
    console.log('Database restore successful:', destinationPath);
  }
});
