const handler = async (m, {
    conn,
    usedPrefix,
    command,
    args
}) => {
    if (global.db.data.chats[m.chat]?.simi) return m.reply("Matikan fitur *SIMI* terlebih dahulu. Ketik *SIMI STOP*")

    const features = [
        "antiCall", "antiDelete", "antiLink", "antiLinkFb", "antiLinkHttp", "antiLinkIg", "antiLinkTel",
        "antiLinkTik", "antiLinkWa", "antiLinkYt", "antiSatir", "antiSticker", "antiVirtex", "antiToxic",
        "antibule", "autoBio", "autoJoin", "autoPresence", "autoReply", "autoSticker", "autoVn", "viewStory",
        "bcjoin", "detect", "getmsg", "nsfw", "antiSpam", "simi", "updateAnime", "updateAnimeNews",
        "viewonce", "welcome", "autoread", "gconly", "nyimak", "pconly", "self", "swonly", "lastAnime", "latestNews"
    ];

    const index = parseInt(args[0]) - 1;

    if (!command || !["on", "off", "enable", "disable"].includes(command) || isNaN(index) || index < 0 || index >= features.length) {
        const featureList = features.map((feature, idx) => {
            const currentValue = global.db.data.chats[m.chat]?.[feature];
            const status = currentValue ? "✅ Aktif" : "❌ Nonaktif";
            return `*${idx + 1}.* ${feature} - ${status}`;
        }).join('\n');
        return m.reply(`
⚠️ *Gunakan format yang benar* ⚠️

📜 *List Fitur*:
${featureList}
        
*Contoh Penggunaan*:
*${usedPrefix}on 1* atau *${usedPrefix}off 1*
        `);
    }

    const feature = features[index];

    if (["on", "enable"].includes(command)) {
        if (["antiDelete", "detect", "getmsg", "lastAnime", "latestNews"].includes(feature)) {
            if (global.db.data.chats[m.chat]?.[feature]) {
                return m.reply(`❗ Fitur *${feature}* sudah aktif ❗`);
            }
            global.db.data.chats[m.chat][feature] = true;
            const status = global.db.data.chats[m.chat]?.[feature] ? "Aktif ✅" : "Nonaktif ❌";
            return m.reply(`✅ Fitur *${feature}* berhasil diaktifkan. Status: ${status}`);
        } else {
            if (!global.db.data.chats[m.chat]?.[feature]) {
                return m.reply(`❗ Fitur *${feature}* sudah nonaktif ❗`);
            }
            global.db.data.chats[m.chat][feature] = false;
            const status = global.db.data.chats[m.chat]?.[feature] ? "Aktif ✅" : "Nonaktif ❌";
            return m.reply(`❌ Fitur *${feature}* berhasil dinonaktifkan. Status: ${status}`);
        }
    }

    if (["off", "disable"].includes(command)) {
        if (["antiDelete", "detect", "getmsg", "lastAnime", "latestNews"].includes(feature)) {
            if (!global.db.data.chats[m.chat]?.[feature]) {
                return m.reply(`❗ Fitur *${feature}* sudah nonaktif ❗`);
            }
            global.db.data.chats[m.chat][feature] = false;
            const status = global.db.data.chats[m.chat]?.[feature] ? "Aktif ✅" : "Nonaktif ❌";
            return m.reply(`❌ Fitur *${feature}* berhasil dinonaktifkan. Status: ${status}`);
        } else {
            if (global.db.data.chats[m.chat]?.[feature]) {
                return m.reply(`❗ Fitur *${feature}* sudah aktif ❗`);
            }
            global.db.data.chats[m.chat][feature] = true;
            const status = global.db.data.chats[m.chat]?.[feature] ? "Aktif ✅" : "Nonaktif ❌";
            return m.reply(`✅ Fitur *${feature}* berhasil diaktifkan. Status: ${status}`);
        }
    }
};

handler.help = ["on", "off"];
handler.tags = ["main"];
handler.command = /^(on|off|enable|disable)$/i;
handler.limit = true;

export default handler;