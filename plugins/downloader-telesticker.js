import { stickerTelegram } from '@bochilteam/scraper';

let handler = async (m, { args }) => {
  try {
    if (args && args.join(' ')) {
      let [query, page] = args.join(' ').split('|');
      let ris = await stickerTelegram(query, page);

      if (!ris.length) throw `Query "${args.join(' ')}" not found`;

      const resultMessage = ris.map(v => `*${v.title}*\n_${v.link}_`).join('\n\n');
      m.reply(`*🌟 Sticker Telegram Search Result 🌟*\n\n${resultMessage}`);
    } else {
      throw 'Input Query / Telesticker Url';
    }
  } catch (e) {
    m.reply('Error.');
  }
};
handler.help = ['telesticker']
handler.tags = ['downloader']
handler.command = /^(telestic?ker|stic?kertele)$/i

export default handler
