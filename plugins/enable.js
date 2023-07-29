const handler = async (m, {
    conn,
    usedPrefix,
    args
}) => {
if (global.db.data.chats[m.chat]?.simi) return m.reply("Matikan fitur *SIMI* terlebih dahulu\nKetik *SIMI STOP*")
    conn.optionsData = conn.optionsData ? conn.optionsData : {}

    const idop = [
        "antiDelete", "antiCall", "antiLink", "antiLinkFb", "antiLinkHttp", "antiLinkIg", "antiLinkTel",
        "antiLinkTik", "antiLinkWa", "antiLinkYt", "antiSatir", "antiSticker", "antiVirtex", "antiToxic",
        "antibule", "autoBio", "autoJoin", "autoPresence", "autoReply", "autoSticker", "autoVn", "viewStory",
        "bcjoin", "detect", "getmsg", "nsfw", "antiSpam", "simi", "updateAnime", "updateAnimeNews",
        "viewonce", "welcome", "autoread", "gconly", "nyimak", "pconly", "self", "swonly"
    ]

    const namop = idop.map(id => id.charAt(0).toUpperCase() + id.slice(1)).map(name => name.split(/(?=[A-Z])/).join(' '))
    const desop = idop.map(id => `Mengaktifkan atau menonaktifkan fitur *${id.toUpperCase()}*`)

    if (args[0] && !isNaN(args[0])) {
        const choice = args[0].trim()
        const numChoice = Number(choice)

        if (numChoice >= 1 && numChoice <= idop.length) {
            const optionId = idop[numChoice - 1]

            const isEnable = !global.db.data.chats[m.chat][optionId]
            global.db.data.chats[m.chat][optionId] = isEnable

            const statusText = isEnable ? "✅ diaktifkan" : "❌ dinonaktifkan"

            // Reverse the true/false values for specified options
            const reverseOptions = ["getmsg", "lastAnime", "latestNews"]
            if (reverseOptions.includes(optionId)) {
                global.db.data.chats[m.chat][optionId] = !global.db.data.chats[m.chat][optionId]
            }

            await conn.reply(m.chat, `✨ Fitur *${optionId.toUpperCase()}* telah *${statusText}*.`, m)
        } else {
            await conn.reply(m.chat, "❗ Pilihan tidak valid.", m)
        }
    } else {
        const teks = idop.map((id, i) => {
            const status = global.db.data.chats[m.chat][id] ? "✅ Sudah aktif" : "❌ Belum aktif"
            return `*${i + 1}.* ${namop[i]}\n${desop[i]}\nStatus: ${status}`
        }).join("\n\n")

        const {
            key
        } = await conn.reply(m.chat, `🔧 Daftar Opsi:\n\n${teks}\n\nBalas pesan ini dengan nomor fitur yang ingin diaktifkan atau dinonaktifkan.`, m)
        conn.optionsData[m.chat] = {
            idop,
            key,
            timeout: setTimeout(() => {
                conn.sendMessage(m.chat, {
                    delete: key
                })
                delete conn.optionsData[m.chat]
            }, 60 * 1000)
        }
    }
}

handler.before = async (m, {
    conn
}) => {
    conn.optionsData = conn.optionsData ? conn.optionsData : {}

    if (m.isBaileys || !(m.chat in conn.optionsData)) return

    const {
        timeout,
        idop,
        key
    } = conn.optionsData[m.chat]
    if (!m.quoted || m.quoted.id !== key.id || !m.text) return

    const choice = m.text.trim()
    const numChoice = Number(choice)

    if (!isNaN(numChoice) && numChoice >= 1 && numChoice <= idop.length) {
        const optionId = idop[numChoice - 1]

        const isEnable = !global.db.data.chats[m.chat][optionId]
        global.db.data.chats[m.chat][optionId] = isEnable

        const statusText = isEnable ? "✅ diaktifkan" : "❌ dinonaktifkan"

        // Reverse the true/false values for specified options
        const reverseOptions = ["getmsg", "lastAnime", "latestNews"]
        if (reverseOptions.includes(optionId)) {
            global.db.data.chats[m.chat][optionId] = !global.db.data.chats[m.chat][optionId]
        }

        conn.reply(m.chat, `✨ Fitur *${optionId.toUpperCase()}* telah *${statusText}*.`, m)
        conn.sendMessage(m.chat, {
                    delete: key
                })
        clearTimeout(timeout)
        delete conn.optionsData[m.chat]
    }
}

handler.help = ["options", "setting"]
handler.tags = ["main"]
handler.command = /^(options|setting|opt)$/i
handler.limit = true

export default handler