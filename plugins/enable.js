const features = ["antiCall", "antiDelete", "antiLink", "antiLinkFb", "antiLinkHttp", "antiLinkIg", "antiLinkTel", "antiLinkTik", "antiLinkWa", "antiLinkYt", "antiSatir", "antiSticker", "antiVirtex", "antiToxic", "antibule", "autoBio", "autoJoin", "autoPresence", "autoReply", "autoSticker", "autoVn", "viewStory", "bcjoin", "detect", "getmsg", "nsfw", "antiSpam", "simi", "updateAnime", "updateAnimeNews", "viewonce", "welcome", "autoread", "gconly", "nyimak", "pconly", "self", "swonly", "lastAnime", "latestNews"];

let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  const listEnab = `
🛠️ *DAFTAR FITUR*
${features.map((f, index) => `🔹 ${index + 1}. ${f} [${global.db.data.chats[m.chat][f] ? 'Aktif' : 'Tidak aktif'}]`).join('\n')}

*===========================
📝 CARA MENGGUNAKAN:*
→ *AKTIFKAN* ${usedPrefix}on [nomor]
→ *NONAKTIFKAN* ${usedPrefix}off [nomor]

📚 CONTOH:
→ *AKTIFKAN* ${usedPrefix}on 2
→ *NONAKTIFKAN* ${usedPrefix}off 3`;

  let isEnable = !/false|disable|(turn)?off|0/i.test(command);
  let chat = global.db.data.chats[m.chat];
  let user = global.db.data.users[m.sender];
  let index = parseInt(args[0]) - 1;

  if (isNaN(index) || index < 0 || index >= features.length) {
    return await conn.reply(m.chat, listEnab, m);
  }

  let type = features[index];

  if (!m.isGroup && !isOwner) {
    conn.reply(m.chat, "Maaf, fitur ini hanya bisa digunakan di dalam grup oleh pemilik bot.", m);
    throw false;
  }

  if (m.isGroup && !isAdmin) {
    conn.reply(m.chat, "Maaf, fitur ini hanya bisa digunakan oleh admin grup.", m);
    throw false;
  }
if (["antiDelete", "detect", "getmsg", "lastAnime", "latestNews", "welcome"].includes(type)) {
  chat[type] = !isEnable;
  conn.reply(m.chat, `✅ *${type}* berhasil ${isEnable ? 'diaktifkan' : 'dinonaktifkan'}.`, m);
  } else {
  chat[type] = isEnable;
  conn.reply(m.chat, `✅ *${type}* berhasil ${isEnable ? 'diaktifkan' : 'dinonaktifkan'}.`, m);
  }
};
handler.help = ["en", "dis"].map(v => v + "able <nomor>");
handler.tags = ["group", "owner"];
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i;

export default handler;
