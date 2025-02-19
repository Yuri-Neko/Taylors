import got from 'got';
import { format } from 'util';

let handler = async (m, { text }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  let name = await conn.getName(who);
  if (!text) throw '*Masukkan Link*\n*Ex:* https://s.id';
  if (text.includes('http')) {
    let { href: url, origin } = new URL(text);
    let res = await got(url, { headers: { 'referer': origin } });
    if (res.headers['content-length'] > 100 * 1024 * 1024 * 1024) throw `Content-Length: ${res.headers['content-length']}`;
    if (!/text|json/.test(res.headers['content-type'])) return conn.sendFile(m.chat, url, ucapan, author, m);
    let txt = res.body;
    try {
      txt = format(JSON.parse(txt + ''));
    } catch (e) {
      txt = txt + '';
    } finally {
      m.reply(txt.slice(0, 65536) + '');
    }
  } else {
    let { href: url, origin } = new URL('https://' + text);
    let res = await got(url, { headers: { 'referer': origin } });
    if (res.headers['content-length'] > 100 * 1024 * 1024 * 1024) throw `Content-Length: ${res.headers['content-length']}`;
    if (!/text|json/.test(res.headers['content-type'])) return conn.sendFile(m.chat, url, ucapan, author, m);
    let txt = res.body;
    try {
      txt = format(JSON.parse(txt + ''));
    } catch (e) {
      txt = txt + '';
    } finally {
      m.reply(txt.slice(0, 65536) + '');
    }
  }
};

handler.help = ['fetch'];
handler.tags = ['tools'];
handler.alias = ['get', 'fetch'];
handler.command = /^(fetch|get)$/i;

export default handler;
