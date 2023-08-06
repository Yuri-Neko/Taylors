import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { sticker } from '../lib/sticker.js';

async function emojiPedia(emoji) {
  const response = await fetch(`https://emojipedia.org/${encodeURI(emoji)}`);
  const html = await response.text();
  const $ = cheerio.load(html);
  return $('section.vendor-list > ul > li').map((_, v) => ({
    vendor: $('h2 a', v).text(),
    url: `https://emojipedia.org/${$('h2 a', v).attr('href').replace(/^\//, '')}`,
    image: $('.vendor-image img', v).attr('src').replace('/120/', '/240/'),
    version: $('.vendor-rollout li', v).map((_, ve) => ({
      name: $('.version-name a', ve).text(),
      url: `https://emojipedia.org/${$('.version-name a', ve).attr('href').replace(/^\//, '')}`,
      image: $('.vendor-image img', ve).attr('data-src').replace('/60/', '/240/'),
    })).get(),
  })).get();
}

let handler = async (m, { args, usedPrefix, command }) => {
  
  if (!args[0]) return m.reply('Silakan masukkan *emoji* atau perintah yang benar.');

  try {
    const emojiData = await emojiPedia(args[0]);
    if (!emojiData.length) return m.reply('Emoji tidak ditemukan atau input tidak valid. Silakan coba lagi.');

    if (!args[1]) {
      const vendorsList = emojiData.map((data, index) => `*${index + 1}.* ${data.vendor}`);
      return m.reply(`Daftar vendor untuk *${args[0]}*:\n\n${vendorsList.join('\n')}\n\nContoh: *${usedPrefix + command}* [emoji] [vendor] [version]`);
    }

    const vendorIndex = parseInt(args[1]) - 1;
    if (isNaN(vendorIndex) || vendorIndex < 0 || vendorIndex >= emojiData.length) return m.reply(`Indeks vendor tidak valid. Harap berikan nomor yang valid dari angka 1 sampai ${emojiData.length}.`);

    const vendorData = emojiData[vendorIndex];

    if (!args[2]) {
      if (vendorData.url) {
        m.reply(`Informasi emoji untuk *${args[0]}* (${vendorData.vendor}):\n\nURL: ${vendorData.url}\nGambar: ${vendorData.image}`);
        return m.reply(await sticker(false, vendorData.image, packname, m.name));
      } else {
        return m.reply('eror');
      }
      const versionsList = vendorData.version.map((version, index) => `${index + 1}. ${version.name}`);
      return m.reply(`Daftar versi untuk *${args[0]}* (${vendorData.vendor}):\n\n${versionsList.join('\n')}\n\nContoh: ${usedPrefix + command} [emoji] [vendor] [version]`);
    }

    const versionIndex = parseInt(args[2]) - 1;
    if (isNaN(versionIndex) || versionIndex < 0 || versionIndex >= vendorData.version.length) return m.reply(`Indeks versi tidak valid. Harap berikan nomor yang valid dari angka 1 sampai ${vendorData.version.length}.`);

    const versionData = vendorData.version[versionIndex];
    m.reply(`Informasi emoji untuk *${args[0]}* (${vendorData.vendor} - ${versionData.name}):\n\nURL: ${versionData.url}\nGambar: ${versionData.image}`);
    return m.reply(await sticker(false, versionData.image, packname, m.name));
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    return m.reply('Terjadi kesalahan saat mencari data emoji.');
  }
};

handler.help = ['emoji'];
handler.tags = ['sticker'];
handler.command = /^(emo(jis|(ji)?)|se?moji)$/i;
export default handler;