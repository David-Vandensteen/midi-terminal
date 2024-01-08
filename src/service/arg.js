import arg from 'arg';

// import {
//   name,
//   author,
//   version,
//   license,
// } from '#src/lib/package';

import {
  name,
  author,
  version,
  license,
} from 'package-reader';

const { log } = console;

const showHelp = () => {
  log('');
  log('');
  log(name, '[options]');
  log('');
  log('     Required options:');
  log('');
  log('   -m    --mode                -- [master\\slave]');
  log('   -o    --interface-out       -- midi out interface name (needed on server mode)');
  log('   -h    --host                -- host');
  log('   -p    --port                -- port');
  log('   -k    --key                 -- mapping config key in yaml format');
  log('');
  log('     Extra options:');
  log('');
  log('   -i         --interface-in   -- midi in interface name');
  log('   --list     -l               -- show available midi interfaces');
  log('   --help                      -- show help');
  log('');
  log('master example :');
  log(name, '-m master -i mcc-in -o mcc-out -h 0.0.0.0 -p 7070');
  log('');
  log('slave example :');
  log(name, '-m slave -h 192.168.0.1 -p 7070');
  log('');
  log('version', version, author, license);
  process.exit(0);
};

class ArgService {
  constructor() {
    this.args = arg({
      '--help': Boolean,
      '--base': Number,

      // Aliases
      '-h': '--help',
      '-b': '--base',
    });
  }

  get base() { return this.args['--base']; }

  get help() { return this.args['--help']; }

  checkArgumentsAndHelp() {
    showHelp();
    return this;
  }
}

const argService = new ArgService();

argService.getOptions = () => this;

export default argService;
export { argService };
