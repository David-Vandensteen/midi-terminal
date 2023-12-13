/* eslint-disable lines-between-class-members */
import easymidi from 'easymidi';
import terminalKit from 'terminal-kit';
import { MidiNormalizer } from 'midi-normalizer';

const { log, error } = console;
const { terminal } = terminalKit;

export default class ApplicationService {
  #midiOutDeviceName;
  #midiOutInstance;
  #midiChannel = 0;
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
    terminal.green('\nSelected device : ', this.#midiOutDeviceName, '\n');
    terminal.green('Selected channel : ', this.#midiChannel, '\n');
    terminal.green('Selected controller : ', this.#midiController, '\n\n');
    terminal.red('Enter command\n');
    terminal.inputField(async (err, inputCommand) => {
      try {
        const inputNumber = Number(inputCommand);
        if (!Number.isNaN(inputNumber) && Number.isInteger(inputNumber)) {
          this.#handleNumberCommand(inputNumber);
        } else {
          await this.#handleTextCommand(inputCommand);
        }
      } catch (commandError) {
        error('Error processing command:', commandError.message);
      }
    });
  }

  async #handleNumberCommand(inputNumber) {
    await this.#sendMidiMessage(inputNumber);
    await this.#command();
  }

  async #handleTextCommand(inputCommand) {
    const regex = /([a-zA-Z]+)(\d+)/;
    const matchResult = inputCommand.match(regex);

    if (matchResult) {
      const commandNumber = matchResult[1].toUpperCase();
      const commandValue = Number.parseInt(matchResult[2], 10);

      if (commandNumber === 'C') this.#midiChannel = MidiNormalizer.channel(commandValue);
      if (commandNumber === 'CC') this.#midiController = MidiNormalizer.controller(commandValue);

      await this.#command();
    } else {
      error('Invalid command format.');
      await this.#command();
    }
  }

  async #sendMidiMessage(value) {
    const midiMessage = {
      channel: this.#midiChannel,
      controller: this.#midiController,
      value: MidiNormalizer.value(value),
    };
    log('\nsend midi :', midiMessage);
    this.#midiOutInstance.send('cc', midiMessage);
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
      } catch (selecMidiOutDeviceError) {
        error('Error selecting MIDI device:', selecMidiOutDeviceError.message);
        process.exit(1);
      }
    });
  }
}

export { ApplicationService };
