import terminalKit from 'terminal-kit';

const { terminal } = terminalKit;

const channel = () => {
  terminal.red('Enter channel\n');
  terminal.inputField((err, channelInput) => channelInput);
};

const controller = () => {
  terminal.red('Enter controller\n');
  terminal.inputField((err, controllerInput) => controllerInput);
};

const command = () => {
  let channelInput = null;
  let controllerInput = null;
  terminal.red('Enter command\n');
  terminal.inputField((err, commandInput) => {
    if (commandInput === 'c') channelInput = channel();
    if (commandInput === 'cc') controllerInput = controller();
    terminal.green('Channel', channelInput, '\n');
    terminal.green('Controller', controllerInput, '\n');
    process.exit();
  });
};

export default class ApplicationService {
  static start() {
    command();
  }
}

export { ApplicationService };
