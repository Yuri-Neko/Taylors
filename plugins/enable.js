// ESM
import { Emojis } from 'dhn-api'
import fetch from 'node-fetch'
import got from "got"
import cheerio from "cheerio"

let handler = async (m, { conn, args, text, usedPrefix, command, isPrems }) => {
  let name = await conn.getName(m.sender)
  m.reply('🗿')

  if (args.length < 2) {
    return m.reply('Gunakan: emoji [nama tema] [emoji]')
  }

  const themeName = args[0].toLowerCase()
  const emojiName = args.slice(1).join(' ')

  try {
    let cari = await Emojis(themeName)
    const emojiData = Object.values(cari).find(e => e.nama.toLowerCase() === emojiName.toLowerCase())

    if (!emojiData) {
      let list = getListFromTheme(cari)
      return m.reply(`Emoji tidak ditemukan dalam tema "${themeName}". Harap periksa nama tema dan emoji kembali.\n\nBerikut adalah daftar emoji dalam tema "${themeName}":\n${list}`)
    }

    m.reply(`Ini adalah emoji yang Anda minta:\nNama: ${emojiData.nama}\nURL: ${emojiData.url}`)
  } catch (e) {
    try {
      let cari = await semoji(themeName)
      const emojiData = Object.values(cari).find(e => e.nama.toLowerCase() === emojiName.toLowerCase())

      if (!emojiData) {
        let list = getListFromTheme(cari)
        return m.reply(`Emoji tidak ditemukan dalam tema "${themeName}". Harap periksa nama tema dan emoji kembali.\n\nBerikut adalah daftar emoji dalam tema "${themeName}":\n${list}`)
      }

      m.reply(`Ini adalah emoji yang Anda minta:\nNama: ${emojiData.nama}\nURL: ${emojiData.url}`)
    } catch (err) {
      m.reply('Terjadi kesalahan saat mengambil data emoji. Silakan coba lagi nanti.')
    }
  }
}

handler.help = ['emoji [nama tema] [emoji]']
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
  $("body > div.container > div.content > article > section.vendor-list > ul").each(function(asu, chuwi) {
    $(chuwi).find("li").each(function(sa, na) {
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

function getListFromTheme(themeData) {
  let list = ''
  Object.values(themeData).forEach((e, i) => {
    list += `${i + 1}. ${e.nama}\n`
  })
  return list
}
