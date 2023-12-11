import terminalKit from 'terminal-kit';

const { terminal } = terminalKit;

const channel = () => {
  terminal.red('Enter channel\n');
  terminal.inputField((err, channelInput) => {

  });
};

const command = () => {
  terminal.red('Enter command\n');
  terminal.inputField((err, commandInput) => {
    if (commandInput === 'c') channel();
    process.exit();
  });
};

export default class ApplicationService {
  static start() {
    command();
  }
}

export { ApplicationService };
