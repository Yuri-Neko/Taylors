const handler = async (m, { conn, usedPrefix, command, args }) => {
    if (global.db.data.chats[m.chat]?.simi) return m.reply("Matikan fitur *SIMI* terlebih dahulu. Ketik *SIMI STOP*");

    const features = ["antiCall", "antiDelete", "antiLink", "antiLinkFb", "antiLinkHttp", "antiLinkIg", "antiLinkTel", "antiLinkTik", "antiLinkWa", "antiLinkYt", "antiSatir", "antiSticker", "antiVirtex", "antiToxic", "antibule", "autoBio", "autoJoin", "autoPresence", "autoReply", "autoSticker", "autoVn", "viewStory", "bcjoin", "detect", "getmsg", "nsfw", "antiSpam", "simi", "updateAnime", "updateAnimeNews", "viewonce", "welcome", "autoread", "gconly", "nyimak", "pconly", "self", "swonly", "lastAnime", "latestNews"];

    const action = /^(on|enable)$/i.test(command) ? true : /^(off|disable)$/i.test(command) ? false : null;
    if (action === null) return m.reply(`Gunakan *${usedPrefix}on* <nomor fitur> untuk mengaktifkan dan *${usedPrefix}off* <nomor fitur> untuk menonaktifkan.`);

    const numFeature = parseInt(args[0]);
    if (isNaN(numFeature) || numFeature <= 0 || numFeature > features.length) {
        let featureList = "*📋 Daftar Fitur dan Status*\n";
        features.forEach((feature, index) => {
            let status = global.db.data.chats[m.chat][feature];
            if (/^(antiDelete|detect|getmsg|lastAnime|latestNews|welcome)$/i.test(feature)) status = !status;
            featureList += `\n*${index + 1}.* ${feature}: ${status ? '✅ Aktif' : '❌ Nonaktif'}`;
        });
        featureList += `\n\nGunakan *${usedPrefix}on* <nomor fitur> untuk mengaktifkan dan *${usedPrefix}off* <nomor fitur> untuk menonaktifkan fitur.`;
        return m.reply(featureList);
    }

    const feature = features[numFeature - 1];
    if (!feature) return m.reply("Fitur tidak ditemukan. Gunakan *help* untuk melihat daftar fitur yang tersedia.");

    if (/^(antiDelete|detect|getmsg|lastAnime|latestNews|welcome)$/i.test(feature)) {
        global.db.data.chats[m.chat][feature] = !global.db.data.chats[m.chat][feature];
        const previousStatus = !global.db.data.chats[m.chat][feature] ? '✅ aktif' : '❌ nonaktif';
        return m.reply(`✨ Fitur *${feature}* telah di${action ? '✅ aktifkan' : '❌ nonaktifkan'}.\nSebelumnya fitur ini ${previousStatus}.`);
    } else {
        global.db.data.chats[m.chat][feature] = action;
    }

    const previousStatus = !global.db.data.chats[m.chat][feature] ? '✅ aktif' : '❌ nonaktif';
        return m.reply(`✨ Fitur *${feature}* telah di${action ? '✅ aktifkan' : '❌ nonaktifkan'}.\nSebelumnya fitur ini ${previousStatus}.`);
};

handler.help = ["on", "off"];
handler.tags = ["main"];
handler.command = /^(on|off|enable|disable)$/i;
handler.limit = true;

export default handler;