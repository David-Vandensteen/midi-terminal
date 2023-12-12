/* eslint-disable lines-between-class-members */
import easymidi from 'easymidi';
import terminalKit from 'terminal-kit';

const { log } = console;
const { terminal } = terminalKit;

export default class ApplicationService {
  #midiOutDeviceName;
  #midiOutInstance;
  #midiOutChannel = 0;
  #midiController = 0;

  static start() {
    const applicationInstance = new ApplicationService();
    terminal.on('key', (name) => {
      if (name === 'CTRL_C') {
        log('Exiting ...');
        applicationInstance.#stop();
        process.exit();
      }
    });
    applicationInstance.#selectMidiOutDevice();
  }

  #stop() {
    if (this.#midiOutInstance) {
      this.#midiOutInstance.close();
      log('MIDI communication closed.');
    }
  }

  async #command() {
    terminal.red('Enter command\n');
    terminal.green('Selected channel : ', this.#midiOutChannel, '\n');
    terminal.green('Selected controller : ', this.#midiController, '\n');
    terminal.inputField(async (err, inputCommand) => {
      try {
        const inputNumber = Number(inputCommand);

        if (!Number.isNaN(inputNumber) && Number.isInteger(inputNumber)) {
          console.log('value :', inputNumber);
          await this.#sendMidiMessage(inputNumber);
          await this.#command();
        } else {
          await this.#processTextCommand(inputCommand);
        }
      } catch (error) {
        console.error('Error processing command:', error.message);
      }
    });
  }

  async #processTextCommand(inputCommand) {
    const regex = /([a-zA-Z]+)(\d+)/;
    const matchResult = inputCommand.match(regex);

    if (matchResult) {
      const commandNumber = matchResult[1].toUpperCase();
      const commandValue = matchResult[2];

      if (commandNumber === 'C') this.#midiOutChannel = commandValue;
      if (commandNumber === 'CC') this.#midiController = commandValue;

      console.log('command :', commandNumber);
      console.log('value :', commandValue);

      await this.#command();
    } else {
      console.log('Invalid command format.');
      await this.#command();
    }
  }

  async #sendMidiMessage(value) {
    this.#midiOutInstance.send('cc', {
      controller: this.#midiController,
      value,
      channel: this.#midiOutChannel,
    });
  }

  #selectMidiOutDevice() {
    terminal.red('Select MIDI device\n');

    easymidi
      .getOutputs()
      .forEach((midiDevive, inc) => log(inc, midiDevive));

    terminal.inputField(async (err, deviceNumber) => {
      try {
        this.#midiOutDeviceName = easymidi.getOutputs()[deviceNumber];
        this.#midiOutInstance = new easymidi.Output(this.#midiOutDeviceName);
        await this.#command();
      } catch (error) {
        console.error('Error selecting MIDI device:', error.message);
      }
    });
  }
}

export { ApplicationService };
