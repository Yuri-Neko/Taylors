import wiktionary from '../lib/wiktionary-api.js';
let handler = async (m, { text }) => {
const result = await wiktionary(text);
let message = `*Word:* ${result.word}\n*Language:* ${result.language}\n\n`;
result.definitions.forEach((definition, index) => {
  message += `*Speech:* ${definition.speech}\n`;
  definition.lines.forEach((line, lineIndex) => {
    message += `  *Define:* ${line.define}\n`;
  });
  message += '\n';
});

await m.reply(message);
};
handler.help = ["wiktionary"];
handler.tags = ["internet"];
handler.command = /^(wiktionary)$/i;
export default handler;
