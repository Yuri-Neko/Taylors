import { createSticker } from 'wa-sticker-formatter';
import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    text = text ? text : m.quoted?.text || m.quoted?.caption || m.quoted?.description || '';
    if (!text) throw `Example : ${m.usedPrefix + m.command} Lagi Ruwet`;

    const apiEndpoint = 'https://api.lolhuman.xyz/api';
    const attpRes = await fetch(`${apiEndpoint}/${m.command}?apikey=${global.lolkey}&text=${encodeURIComponent(text.substring(0, 151))}`);
    const attpRes2 = await fetch(`https://xteam.xyz/attp?file&text=${encodeURIComponent(text.substring(0, 151))}`);
    const text2GifRes = await fetch(global.API('https://salism3api.pythonanywhere.com', '/text2gif/', { text: text }));
    const text2ImgRes = await fetch(global.API('https://salism3api.pythonanywhere.com', '/text2img/', { text: text }));
    const ttp7Res = await text2ImgRes.json();
    const ttp8Res = await fetch(global.API('https://salism3api.pythonanywhere.com', '/text2img/', { text: text, outlineColor: '255,0,0,255', textColor: '0,0,0,255' }));
    const ttp8ResJson = await ttp8Res.json();

    if (m.command == 'attp') {
        let stiker = await createSticker(await attpRes.buffer(), { pack: packname, author: author });
        await conn.sendFile(m.chat, stiker, 'atet.webp', '', m);
    } else if (m.command == 'attp2') {
        let stick = (await text2GifRes.json()).image;
        let stiker = await createSticker(stick, { pack: packname, author: author });
        await conn.sendFile(m.chat, stiker, 'atet.webp', '', m);
    } else if (m.command == 'ttp7') {
        let stick = ttp7Res.image;
        let stiker = await createSticker(stick, { pack: packname, author: author });
        await conn.sendFile(m.chat, stiker, 'atet.webp', '', m);
    } else if (m.command == 'ttp8') {
        let stick = ttp8ResJson.image;
        let stiker = await createSticker(stick, { pack: packname, author: author });
        await conn.sendFile(m.chat, stiker, 'atet.webp', '', m);
    } else if (m.command == 'attp3') {
        let stiker = await createSticker(await attpRes2.buffer(), { pack: packname, author: author });
        await conn.sendFile(m.chat, stiker, 'atet.webp', '', m);
    } else {
        let stiker = await createSticker(await attpRes.buffer(), { pack: packname, author: author });
        await conn.sendFile(m.chat, stiker, 'atet.webp', '', m);
    }
};

handler.help = ['ttp', 'ttp2 -> ttp8', 'attp', 'attp2', 'attp3'];
handler.tags = ['creator'];
handler.command = /^((ttp(2|3|4|5|6|7|8)?)|(attp(2|3|4)?))$/i;
handler.limit = true;

export default handler;
