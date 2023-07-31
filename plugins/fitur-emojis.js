// ESM
import { Emojis } from 'dhn-api'
import got from "got"
import cheerio from "cheerio"

let handler = async (m, { conn, args, usedPrefix }) => {
    let name = await conn.getName(m.sender)
    await conn.sendMessage(m.chat, { react: { text: '🗿', key: m.key } })

    if (!args[0] || args[0].length > 2 || !isEmoji(args[0])) {
        return m.reply(`Mohon maaf, Anda hanya perlu memasukkan satu emoji saja.\nContoh penggunaan: *${usedPrefix}emoji 😊*`)
    }

    try {
        let cari = await Emojis(args[0])
        let listMessages = []

        if (args[1]) {
            let index = parseInt(args[1])
            if (isNaN(index) || index < 0 || index >= Object.values(cari.vendor_pack).length) {
                let vendorList = Object.values(cari.vendor_pack).map((v, i) => {
                    let url = v.vendor_url
                    let pairs = url.substring(url.indexOf('/') + 1).split('/');
                    let vendor = pairs[2].toUpperCase()
                    return `(${i + 1}) ${vendor} - ${v.vendor_version}`
                }).join('\n')
                return m.reply(`Urutan tidak valid. Berikut adalah daftar urutan yang tersedia:\n${vendorList}`)
            }
            let v = Object.values(cari.vendor_pack)[index]
            let url = v.vendor_url
            let pairs = url.substring(url.indexOf('/') + 1).split('/');
            let vendor = pairs[2].toUpperCase()
            listMessages.push(`🎴 *Emoji:* ${cari.unicode_desc}
🏷️ *Vendor:* ${vendor}
🔖 *Versi Vendor:* ${v.vendor_version}
📄 *Cara Pakai:* ${usedPrefix}fetchsticker ${v.vendor_thumb.replace('/60/', '/240/')} wsf`)
            m.reply(listMessages.join('\n'))
        } else {
            Object.values(cari.vendor_pack).map((v, index) => {
                let url = v.vendor_url
                let pairs = url.substring(url.indexOf('/') + 1).split('/');
                let vendor = pairs[2].toUpperCase()
                listMessages.push(`🎴 *Emoji:* ${cari.unicode_desc}
🏷️ *Vendor:* ${vendor}
🔖 *Versi Vendor:* ${v.vendor_version}
📄 *Cara Pakai:* ${usedPrefix}fetchsticker ${v.vendor_thumb.replace('/60/', '/240/')} wsf`)
            })
            m.reply(listMessages.join('\n\n'))
        }
    } catch (e) {
        let cari = await semoji(args[0])
        let listMessages = []

        if (args[1]) {
            let index = parseInt(args[1])
            if (isNaN(index) || index < 0 || index >= cari.length) {
                let emojiList = cari.map((v, i) => `(${i + 1}) ${v.nama}`).join('\n')
                return m.reply(`Urutan tidak valid. Berikut adalah daftar emoji yang tersedia:\n${emojiList}`)
            }
            let v = cari[index]
            listMessages.push(`🎴 *Emoji:* ${v.nama}
📄 *Cara Pakai:* ${usedPrefix}fetchsticker ${v.url} wsf`)
            m.reply(listMessages.join('\n'))
        } else {
            if (!Array.isArray(cari) || cari.length === 0) {
                return m.reply('Mohon maaf, emoji tidak ditemukan atau tidak valid.')
            }

            cari.forEach((v, index) => {
                listMessages.push(`🎴 *Emoji:* ${v.nama}
📄 *Cara Pakai:* ${usedPrefix}fetchsticker ${v.url} wsf`)
            })

            if (listMessages.length === 0) {
                return m.reply('Mohon maaf, tidak ada emoji yang ditemukan untuk input tersebut.')
            }

            m.reply(listMessages.join('\n\n'))
        }
    }
}

handler.help = ['emoji']
handler.tags = ['sticker']
handler.command = /^(emo(jis|(ji)?)|se?moji)$/i
export default handler

async function semoji(hem) {
    const result = []
    const data = await got(encodeURI('https://emojipedia.org/' + hem), {
        method: "GET",
        headers: {
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
        }
    })
    const $ = cheerio.load(data.body)
    $("body > div.container > div.content > article > section.vendor-list > ul").each(function (asu, chuwi) {
        $(chuwi).find("li").each(function (sa, na) {
            const res = {
                nama: $(na).find("div > div.vendor-info > h2 > a").text().trim().toLowerCase(),
                url: $(na).find("div > div.vendor-image > img").attr("src")
            }
            result.push(res)
        })
    })
    const data2 = []
    result.map(Data => {
        if (Data.nama == undefined) return;
        if (Data.url == undefined) return;
        data2.push(Data)
    })
    return data2
}

function isEmoji(str) {
    return /[\uD800-\uDFFF]./.test(str)
}
