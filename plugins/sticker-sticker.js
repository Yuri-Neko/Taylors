import fetch from 'node-fetch'
import { addExif } from '../lib/sticker.js'
import {
    Sticker,
    StickerTypes
} from "wa-sticker-formatter"
import {
    sticker
} from "../lib/sticker.js"
import wibusoft from "wibusoft"
import got from "got"
import cheerio from "cheerio"

let handler = async (m, { conn, args, usedPrefix, command }) => {
	let stiker = false
	try {
		let [packnames, ...authors] = args.join(" ").split("|")
		authors = (authors || []).join("|")
		let q = m.quoted ? m.quoted : m
        let mime = q.mtype || ""
        	await m.reply(wait)
        if (/stickerMessage/g.test(mime)) {
			let img = await q.download?.()
			stiker = await addExif(img, packnames || packname, authors || m.name)
		} else if (/imageMessage/g.test(mime)) {
			let img = await q.download?.()
			stiker = await createSticker(img, false, packnames || packname, authors || m.name)
		} else if (/videoMessage/g.test(mime)) {
		if ((q.msg || q).seconds > 11) return m.reply("Maksimal video durasi 10 detik!")
			let img = await q.download?.()
			stiker = await mp4ToWebp(img, { pack: packnames || packname, authors: authors || m.name })
		} else if (/documentMessage/g.test(mime)) {
			let img = await q.download?.()
                    stiker = await wibusoft.tools.makeSticker(img, {
                        author: authors || m.name,
                        pack: packnames || packname,
                        keepScale: true
                    })
                } else if (/viewOnceMessageV2/g.test(mime)) {
			let img = await q.download?.()
			stiker = await sticker(img, false, packnames || packname, authors || m.name)
		} else if (/extendedTextMessage/g.test(mime)) {
        	if (!getEmojiFromQuotedText(q.text)) return m.reply("Pesan ini tidak mengandung emoji untuk dijadikan sticker!")
                let cari = await searchEmoji(getEmojiFromQuotedText(q.text))
                let emj = getUrlByName(cari, "whatsapp")
                stiker = await wibusoft.tools.makeSticker(emj, {
                    author: packnames || packname,
                    pack: authors || m.name,
                    keepScale: true
                })
		} else if (args[0] && isUrl(args[0])) {
			stiker = await createSticker(false, args[0], packnames || packname, authors || m.name, 30)
		} else return m.reply(`Reply an image/video/sticker with command ${usedPrefix + command}`) 
	} catch (e) {
		console.log(e)
		stiker = e
	} finally {
		m.reply(stiker)
	}
}
handler.help = ["stiker (caption|reply media)", "stiker <url>", "stikergif (caption|reply media)", "stikergif <url>"]
handler.tags = ["sticker"]
handler.command = /^s(ti(c?k(er(gif)?)?|c)|gif)?$/i
export default handler

function getEmojiFromQuotedText(text) {
    const emojiRegex = /\p{Emoji}/u;
    const matches = text.match(emojiRegex);

    if (matches && matches.length > 0) {
        return matches[0];
    }

    return null;
}

async function searchEmoji(hem) {
    const result = []
    const data = await got(encodeURI("https://emojipedia.org/" + hem), {
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

function getUrlByName(data, nama) {
    const matchedObject = data.find(item => item.nama === nama);

    if (matchedObject) {
        return matchedObject.url;
    }

    return null;
}

const isUrl = (text) => text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))

async function createSticker(img, url, packName, authorName, quality) {
	let stickerMetadata = {
		type: 'full',
		pack: packName,
		author: authorName,
		quality
	}
	return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}

async function mp4ToWebp(file, stickerMetadata) {
	if (stickerMetadata) {
		if (!stickerMetadata.pack) stickerMetadata.pack = '‎'
		if (!stickerMetadata.author) stickerMetadata.author = '‎'
		if (!stickerMetadata.crop) stickerMetadata.crop = false
	} else if (!stickerMetadata) {
		stickerMetadata = { pack: '‎', author: '‎', crop: false }
	}
	let getBase64 = file.toString('base64')
	const Format = {
		file: `data:video/mp4;base64,${getBase64}`,
		processOptions: {
			crop: stickerMetadata?.crop,
			startTime: '00:00:00.0',
			endTime: '00:00:7.0',
			loop: 0
		},
		stickerMetadata: {
			...stickerMetadata
		},
		sessionInfo: {
			WA_VERSION: '2.2106.5',
			PAGE_UA: 'WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
			WA_AUTOMATE_VERSION: '3.6.10 UPDATE AVAILABLE: 3.6.11',
			BROWSER_VERSION: 'HeadlessChrome/88.0.4324.190',
			OS: 'Windows Server 2016',
			START_TS: 1614310326309,
			NUM: '6247',
			LAUNCH_TIME_MS: 7934,
			PHONE_VERSION: '2.20.205.16'
		},
		config: {
			sessionId: 'session',
			headless: true,
			qrTimeout: 20,
			authTimeout: 0,
			cacheEnabled: false,
			useChrome: true,
			killProcessOnBrowserClose: true,
			throwErrorOnTosBlock: false,
			chromiumArgs: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--aggressive-cache-discard',
				'--disable-cache',
				'--disable-application-cache',
				'--disable-offline-load-stale-cache',
				'--disk-cache-size=0'
			],
			executablePath: 'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
			skipBrokenMethodsCheck: true,
			stickerServerEndpoint: true
		 }
	}
	let res = await fetch('https://sticker-api.openwa.dev/convertMp4BufferToWebpDataUrl', {
		method: 'post',
		headers: {
			Accept: 'application/json, text/plain, /',
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(Format)
	})
	return Buffer.from((await res.text()).split(';base64,')[1], 'base64')
}