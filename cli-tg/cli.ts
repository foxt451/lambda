import { Command } from "commander";

const program = new Command();

program
  .name("telegram-cli")
  .description("quickly save content to telegram through console");

const msgCommand = program
  .command("message")
  .alias("m")
  .description("send text")
  .argument("<text>", "text to send");

const imgCommand = program
  .command("image")
  .alias("i")
  .description("send image")
  .argument("<path>", "path to image (you can just drag and drop the image)");

export { program, msgCommand, imgCommand };
