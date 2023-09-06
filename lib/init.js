import os from 'node:os';
import process from 'node:process';
import child_process from 'node:child_process';

if (os.platform() === 'win32') {
  let optionalDependencies = {
    'registry-js': '^1.15.1'
  };
  let deps = Object.entries(optionalDependencies).map(([name, version]) => (name + '@' + version)).join(' ');
  let command = 'npm install --no-save ' + deps;
  console.log('Executing command ' + command);
  child_process.exec(command, function (error, stdout, stderr) {
    if (stdout) {
      process.stdout.write(stdout);
    }
    if (stderr) {
      process.stderr.write(stderr);
    }
    if (error) {
      console.error('Failed to install registry-js');
    }
  });
}
