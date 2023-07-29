import cheerio from "cheerio";
import fetch from "node-fetch";

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {

    let lister = [
        "search",
        "random"
    ]

    let [feature, inputs, inputs_, inputs__, inputs___] = text.split("|")
    if (!lister.includes(feature)) return m.reply("*Example:*\n" + usedPrefix + command + " search|vpn\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"))

    if (lister.includes(feature)) {

        if (feature == "search") {
            if (!inputs) return m.reply("Input query link\nExample: " + usedPrefix + command + " search|vpn")
            await m.reply(wait)
            try {
                
                if (isNumber(inputs_)) {
                let array = await Telesticker(inputs)
                if (inputs_ > array.length) {
  let maxi = `Input terlalu banyak, usahakan dibawah ${array.length}`
  await m.reply(maxi)
} else {
                let randomItem = array[inputs_]
                await conn.sendFile(m.chat, randomItem.url, "", "", m, null, adReplyS)
                }
                } else {
                let array = await Telesticker(inputs)
                let teks = array.map((item, index) => {
                    return `🔍 [ RESULT ${index + 1} ]

🔗 *url:* ${item.url}
`
                }).filter(v => v).join("\n\n________________________\n\n")
                await m.reply(teks)
                }
            } catch (e) {
                await m.reply(eror)
            }
        }

        if (feature == "random") {
        await m.reply(wait)
            try {
                let array = await Telesticker(inputs)
                let randomItem = array[Math.floor(Math.random() * array.length)]
                await conn.sendFile(m.chat, randomItem.url, "", "", m, null, adReplyS)
            } catch (e) {
                await m.reply(eror)
            }
        }
    }
}
handler.help = ['stikertele <query>']
handler.tags = ['sticker']
handler.command = /^(stic?kertele(gram)?)$/i
handler.limit = 1

export default handler


/* New Line */
function isNumber(x) {
    return !isNaN(x)
}

async function Telesticker(query) {
  const response = await fetch(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(query)}`);
  const data = await response.json();
  
  return Promise.all(data.result.stickers.map(async sticker => {
    const response2 = await fetch(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${sticker.thumb.file_id}`);
    const data2 = await response2.json();
    
    return {
      status: 200,
      author: "Wudysoft",
      url: `https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/${data2.result.file_path}`
    };
  }));
}
