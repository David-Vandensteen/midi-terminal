#! /usr/bin/env node
import { argService } from '#src/service/arg';
import { ApplicationService } from '#src/service/application';

const { base } = argService;

if (argService.help === true) argService.checkArgumentsAndHelp();
ApplicationService.start({ base });
