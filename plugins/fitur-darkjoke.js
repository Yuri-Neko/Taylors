import fetch from 'node-fetch'
import bo from 'dhn-api'
let handler = async (m, { conn, usedPrefix, text, args, command }) => {
let spas = "                "
let lister = [
        "module"
        ]
        let [feature] = text.split(/[^\w\s]/g)
    if (!lister.includes(feature)) return m.reply("*Example:*\n.darkjoke module\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join('\n'))
    if (lister.includes(feature)) {
        if (feature == "module") {
        await conn.sendFile(m.chat, await bo.Darkjokes(), '', `${spas}*[ DARKJOKE ]*\nRequest by:\n${m.name}`, m)
        }
        }
}
handler.help = ['darkjoke']
handler.tags = ['fun']
handler.command = /^(darkjoke)$/i

export default handler
