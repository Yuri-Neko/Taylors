import { WAMessageStubType } from '@adiwajshing/baileys';
import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile } from 'fs';

const terminalImage = global.opts['img'] ? require('terminal-image') : '';
const urlRegex = (await import('url-regex-safe')).default({ strict: false });

export default async function (m, conn = { user: {} }) {
  let _name = await conn.getName(m.sender);
  let sender = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') + (_name ? ' ~' + _name : '');
  let chat = await conn.getName(m.chat);
  let img;
  try {
    if (global.opts['img'])
      img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false;
  } catch (e) {
    console.error(e);
  }
  let filesize = (m.msg ?
    m.msg.vcard ?
      m.msg.vcard.length :
      m.msg.fileLength ?
        m.msg.fileLength.low || m.msg.fileLength :
        m.msg.axolotlSenderKeyDistributionMessage ?
          m.msg.axolotlSenderKeyDistributionMessage.length :
          m.text ?
            m.text.length :
            0
    : m.text ? m.text.length : 0) || 0;
  let user = global.DATABASE.data.users[m.sender];
  let me = PhoneNumber('+' + (conn.user?.jid).replace('@s.whatsapp.net', '')).getNumber('international');

  // Output Message Info
  console.log(chalk.redBright('\n📨 Message Info:'));
  console.log(chalk.cyan('   - Message Type:'), m.mtype ? m.mtype.replace(/message$/i, '').replace('audio', m.msg.ptt ? 'PTT' : 'audio').replace(/^./, v => v.toUpperCase()) : 'Unknown');
  console.log(chalk.cyan('   - Message ID:'), m.msg?.id || 'N/A');
  console.log(chalk.cyan('   - Sent Time:'), (m.messageTimestamp ? new Date(1000 * (m.messageTimestamp.low || m.messageTimestamp)) : new Date).toLocaleString());
  console.log(chalk.cyan('   - Message Size:'), filesize + ' bytes');
  console.log(chalk.cyan('   - Sender ID:'), m.sender);
  console.log(chalk.cyan('   - Sender Name:'), conn.user.name);
  console.log(chalk.cyan('   - Chat ID:'), m.chat);
  console.log(chalk.cyan('   - Chat Name:'), chat || 'N/A');

  // Output text message with formatting
  if (typeof m.text === 'string' && m.text) {
    let log = m.text.replace(/\u200e+/g, '');
    let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g;
    let mdFormat = (depth = 4) => (_, type, text, monospace) => {
      let types = {
        _: 'italic',
        '*': 'bold',
        '~': 'strikethrough'
      };
      text = text || monospace;
      let formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)));
      return formatted;
    };
    
    if (log.length < 4096)
      log = log.replace(urlRegex, (url, i, text) => {
        let end = url.length + i;
        return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1])) ? chalk.blueBright(url) : url;
      });

    log = log.replace(mdRegex, mdFormat(4));

    if (m.mentionedJid) for (let user of m.mentionedJid) log = log.replace('@' + user.split`@`[0], chalk.blueBright('@' + await conn.getName(user)));

    console.log(m.error != null ? chalk.red(`🚨 ${log}`) : m.isCommand ? chalk.yellow(`⚙️ ${log}`) : log);
  }

  // Output attached contacts
  if (m.messageStubParameters) {
    console.log(chalk.redBright('\n📎 Attached Contacts:'));
    console.log(m.messageStubParameters.map(jid => {
      jid = conn.decodeJid(jid);
      let name = conn.getName(jid);
      return `   - ${PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')} ${name ? `~ ${name}` : ''}`;
    }).join('\n'));
  }

  // Output attached document, contacts, or audio
  if (/document/i.test(m.mtype)) {
    console.log(chalk.redBright(`📄 Attached Document: ${m.msg.fileName || m.msg.displayName || 'Document'}`));
  } else if (/ContactsArray/i.test(m.mtype)) {
    console.log(chalk.redBright('\n👨‍👩‍👧‍👦 Attached Contacts:'));
  } else if (/contact/i.test(m.mtype)) {
    console.log(chalk.redBright(`👨 Attached Contact: ${m.msg.displayName || 'N/A'}`));
  } else if (/audio/i.test(m.mtype)) {
    const duration = m.msg.seconds;
    console.log(chalk.redBright(`🎵 Attached Audio: ${m.msg.ptt ? '(PTT' : '(Audio'} - Duration: ${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)})`));
  }

  // Output sender and receiver details
  console.log(chalk.greenBright(`\n  From: ${sender}`));
  console.log(chalk.blueBright(`    To: ${me}`));

  // Loading animation if no m.msg available
  if (!m.msg) {
    console.log(chalk.yellowBright('\n⌛ Waiting for messages...'));
    const loadingAnimation = ['|', '/', '-', '\\'];
    let i = 0;
    const loadingInterval = setInterval(() => {
      process.stdout.write(`\r⌛ Waiting for messages... ${loadingAnimation[i]}`);
      i = (i + 1) % loadingAnimation.length;
    }, 250);

    // Simulate waiting for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));

    clearInterval(loadingInterval);
    console.log(chalk.whiteBright("\r📨 No messages to process."));
    return;
  }

  console.log();
}

let file = global.__filename(import.meta.url);
watchFile(file, () => {
  console.log(chalk.redBright("Update 'lib/print.js'"));
});
