import "./config.js";
import { program, msgCommand, imgCommand } from "./cli.js";
import { sendMessage, sendImage } from "./commands.js";
msgCommand.action(sendMessage);
imgCommand.action(sendImage);
program.parse();
