process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import './config.js';

import {
    createRequire
} from "module";
import path, {
    join
} from 'path';
import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import {
    platform
} from 'process';
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
    return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString()
}
global.__dirname = function dirname(pathURL) {
    return path.dirname(global.__filename(pathURL, true))
}
global.__require = function require(dir = import.meta.url) {
    return createRequire(dir)
}

import * as ws from 'ws';
import {
    readdirSync,
    statSync,
    unlinkSync,
    existsSync,
    mkdirSync,
    readFileSync,
    rmSync,
    watch
} from 'fs';

import yargs from 'yargs';
import {
    promisify
} from 'util';
import {
    spawn
} from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import {
    tmpdir
} from 'os';
import {
    format
} from 'util';
import {
    Boom
} from "@hapi/boom";
import Pino from 'pino';
import {
    makeWaSocket,
    protoType,
    serialize
} from './lib/simple.js';
import {
    Low,
    JSONFile
} from 'lowdb';
import {
    mongoDB,
    mongoDBV2
} from './lib/mongoDB.js';

const {
    DisconnectReason,
    useMultiFileAuthState,
    MessageRetryMap,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    proto,
    jidNormalizedUser,
    PHONENUMBER_MCC,
    Browsers
} = await (await import('@adiwajshing/baileys')).default;

import readline from "readline"
import {
    parsePhoneNumber
} from "libphonenumber-js"
const store = makeInMemoryStore({
    logger: Pino().child({
        level: 'fatal',
        stream: 'store'
    })
})

const pairingCode = process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")
const useQr = process.argv.includes("--qr")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
import NodeCache from "node-cache"
const msgRetryCounterCache = new NodeCache()
const {
    CONNECTING
} = ws
const {
    chain
} = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({
    ...query,
    ...(apikeyqueryname ? {
        [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]
    } : {})
})) : '')
global.timestamp = {
    start: new Date
}

const __dirname = global.__dirname(import.meta.url)
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
const symbolRegex = /^[^\w\s\d]/;
const emojiRegex = /^(\p{Emoji}|[\uFE0F\u200D])/u;
global.prefix = new RegExp(`(${symbolRegex.source})|(${emojiRegex.source})`, 'u');
global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`))


global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) return new Promise((resolve) => setInterval(async function() {
        if (!global.db.READ) {
            clearInterval(this)
            resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
        }
    }, 1 * 1000))
    if (global.db.data !== null) return
    global.db.READ = true
    await global.db.read().catch(console.error)
    global.db.READ = null
    global.db.data = {
        users: {},
        chats: {},
        stats: {},
        msgs: {},
        sticker: {},
        settings: {},
        ...(global.db.data || {})
    }
    global.db.chain = chain(global.db.data)
}
loadDatabase()

global.authFile = `TaylorSession`;
const {
    state,
    saveState,
    saveCreds
} = await useMultiFileAuthState(global.authFile);
const msgRetryCounterMap = (MessageRetryMap) => {};
const {
    version
} = await fetchLatestBaileysVersion();

if (!pairingCode && !useMobile && !useQr) {
    const title = "INFO";
    const message = "Please use one of the options: --pairing-code, --mobile, --qr";
    const boxWidth = 40;
    const horizontalLine = chalk.redBright("─".repeat(boxWidth));

    const formatText = (text, bgColor, textColor) => chalk[bgColor](chalk[textColor](text.padStart(boxWidth / 2 + text.length / 2).padEnd(boxWidth)));

    console.log(`╭${horizontalLine}╮
|${formatText(title, 'bgRed', 'white')}|
├${horizontalLine}┤
|${formatText(message, 'bgWhite', 'red')}|
╰${horizontalLine}╯`);
}

const connectionOptions = {
    ...(!pairingCode && !useMobile && !useQr && {
        printQRInTerminal: false,
        mobile: false
    }),
    ...(pairingCode && {
        printQRInTerminal: !pairingCode
    }),
    ...(useMobile && {
        mobile: true
    }),
    ...(useQr && {
        printQRInTerminal: true
    }),
    patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
        if (requiresPatch) {
            message = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {}
                        },
                        ...message
                    }
                }
            };
        }
        return message;
    },
    msgRetryCounterMap,
    logger: Pino({
        level: 'fatal'
    }),
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, Pino().child({
            level: 'fatal',
            stream: 'store'
        })),
    },
    browser: Browsers.macOS('Desktop'),
    version,
    getMessage: async (key) => {
        let jid = jidNormalizedUser(key.remoteJid)
        let msg = await store.loadMessage(jid, key.id)
        return msg?.message || ""
    },
    msgRetryCounterCache,
    connectTimeoutMs: 60_000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    emitOwnEvents: true,
    fireInitQueries: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
    markOnlineOnConnect: true
};

global.conn = makeWaSocket(connectionOptions);
store.bind(conn.ev)
conn.isInit = false

if (pairingCode && !conn.authState.creds.registered) {
    if (useMobile) conn.logger.error('Cannot use pairing code with mobile api')
    console.log(chalk.cyan('╭──────────────────────────────────────···'));
    console.log(`📨 ${chalk.redBright('Please type your WhatsApp number')}:`);
    console.log(chalk.cyan('├──────────────────────────────────────···'));
    let phoneNumber = await question(`   ${chalk.cyan('- Number')}: `);
    console.log(chalk.cyan('╰──────────────────────────────────────···'));
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
    if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
        console.log(chalk.cyan('╭─────────────────────────────────────────────────···'));
        console.log(`💬 ${chalk.redBright("Start with your country's WhatsApp code, Example 62xxx")}:`);
        console.log(chalk.cyan('╰─────────────────────────────────────────────────···'));
        console.log(chalk.cyan('╭──────────────────────────────────────···'));
        console.log(`📨 ${chalk.redBright('Please type your WhatsApp number')}:`);
        console.log(chalk.cyan('├──────────────────────────────────────···'));
        phoneNumber = await question(`   ${chalk.cyan('- Number')}: `);
        console.log(chalk.cyan('╰──────────────────────────────────────···'));
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
    }
    let code = await conn.requestPairingCode(phoneNumber)
    code = code?.match(/.{1,4}/g)?.join("-") || code
    console.log(chalk.cyan('╭──────────────────────────────────────···'));
    console.log(` 💻 ${chalk.redBright('Your Pairing Code')}:`);
    console.log(chalk.cyan('├──────────────────────────────────────···'));
    console.log(`   ${chalk.cyan('- Code')}: ${code}`);
    console.log(chalk.cyan('╰──────────────────────────────────────···'));
    rl.close()
}

if (useMobile && !conn.authState.creds.registered) {
    const {
        registration
    } = conn.authState.creds || {
        registration: {}
    }
    if (!registration.phoneNumber) {
        console.log(chalk.cyan('╭──────────────────────────────────────···'));
        console.log(`📨 ${chalk.redBright('Please type your WhatsApp number')}:`);
        console.log(chalk.cyan('├──────────────────────────────────────···'));
        let phoneNumber = await question(`   ${chalk.cyan('- Number')}: `);
        console.log(chalk.cyan('╰──────────────────────────────────────···'));
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
        if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.cyan('╭─────────────────────────────────────────────────···'));
            console.log(`💬 ${chalk.redBright("Start with your country's WhatsApp code, Example 62xxx")}:`);
            console.log(chalk.cyan('╰─────────────────────────────────────────────────···'));
            console.log(chalk.cyan('╭──────────────────────────────────────···'));
            console.log(`📨 ${chalk.redBright('Please type your WhatsApp number')}:`);
            console.log(chalk.cyan('├──────────────────────────────────────···'));
            phoneNumber = await question(`   ${chalk.cyan('- Number')}: `);
            console.log(chalk.cyan('╰──────────────────────────────────────···'));
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
        }
        registration.phoneNumber = "+" + phoneNumber
    }

    const phoneNumber = parsePhoneNumber(registration.phoneNumber)
    if (!phoneNumber.isValid()) conn.logger.error('Invalid phone number: ' + registration.phoneNumber)
    registration.phoneNumber = phoneNumber.format("E.164")
    registration.phoneNumberCountryCode = phoneNumber.countryCallingCode
    registration.phoneNumberNationalNumber = phoneNumber.nationalNumber
    const mcc = PHONENUMBER_MCC[phoneNumber.countryCallingCode]
    registration.phoneNumberMobileCountryCode = mcc
    async function enterCode() {
        try {
            console.log(chalk.cyan('╭──────────────────────────────────────···'));
            console.log(`📨 ${chalk.redBright('Please Enter Your OTP Code')}:`);
            console.log(chalk.cyan('├──────────────────────────────────────···'));
            const code = await question(`   ${chalk.cyan('- Code')}: `);
            console.log(chalk.cyan('╰──────────────────────────────────────···'));
            const response = await conn.register(code.replace(/[^0-9]/g, '').trim().toLowerCase())
            console.log(chalk.cyan('╭─────────────────────────────────────────────────···'));
            console.log(`💬 ${chalk.redBright("Successfully registered your phone number.")}`);
            console.log(chalk.cyan('╰─────────────────────────────────────────────────···'));
            console.log(response)
            rl.close()
        } catch (error) {
            conn.logger.error('Failed to register your phone number. Please try again.\n', error)
            await askOTP()
        }
    }

    async function askOTP() {
        console.log(chalk.cyan('╭──────────────────────────────────────···'));
        console.log(`📨 ${chalk.redBright('What method do you want to use? "sms" or "voice"')}`);
        console.log(chalk.cyan('├──────────────────────────────────────···'));
        let code = await question(`   ${chalk.cyan('- Method')}: `);
        console.log(chalk.cyan('╰──────────────────────────────────────···'));
        code = code.replace(/["']/g, '').trim().toLowerCase()
        if (code !== 'sms' && code !== 'voice') return await askOTP()
        registration.method = code
        try {
            await conn.requestRegistrationCode(registration)
            await enterCode()
        } catch (error) {
            conn.logger.error('Failed to request registration code. Please try again.\n', error)
            await askOTP()
        }
    }
    await askOTP()
}

conn.logger.info(`W A I T I N G\n`);

if (!opts['test']) {
    if (global.db) {
        setInterval(async () => {
            if (global.db.data) await global.db.write();
            if (opts['autocleartmp'] && (global.support || {}).find)(tmp = [os.tmpdir(), 'tmp', 'jadibot'], tmp.forEach((filename) => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])));
        }, 30 * 1000);
    }
}

if (opts['server'])(await import('./server.js')).default(global.conn, PORT);

function clearTmp() {
    const tmp = [tmpdir(), join(__dirname, './tmp')];
    const filename = [];
    tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))));
    return filename.map((file) => {
        const stats = statSync(file);
        if (stats.isFile() && (Date.now() - stats.mtimeMs >= 5 * 60 * 1000)) return unlinkSync(file);
        return false;
    });
}

function purgeSession() {
    let prekey = [];
    const directorio = readdirSync('./TaylorSession');
    const filesFolderPreKeys = directorio.filter((file) => {
        return file.startsWith('pre-key-');
    });
    prekey = [...prekey, ...filesFolderPreKeys];
    filesFolderPreKeys.forEach((files) => {
        unlinkSync(`./TaylorSession/${files}`);
    });
}

function purgeSessionSB() {
    const folderPath = './jadibot';
    if (!existsSync(folderPath)) {
        mkdirSync(folderPath);
        console.log('Folder jadibot berhasil dibuat.');
    } else {
        console.log('Folder jadibot sudah ada.');
    }
    const listaDirectorios = readdirSync('./jadibot/');
    let SBprekey = [];
    listaDirectorios.forEach((filesInDir) => {
        const directorio = readdirSync(`./jadibot/${filesInDir}`);
        const DSBPreKeys = directorio.filter((fileInDir) => {
            return fileInDir.startsWith('pre-key-');
        });
        SBprekey = [...SBprekey, ...DSBPreKeys];
        DSBPreKeys.forEach((fileInDir) => {
            unlinkSync(`./jadibot/${filesInDir}/${fileInDir}`);
        });
    });
}

function purgeOldFiles() {
    const folderPath = './jadibot';
    if (!existsSync(folderPath)) {
        mkdirSync(folderPath);
        console.log('Folder jadibot berhasil dibuat.');
    } else {
        console.log('Folder jadibot sudah ada.');
    }
    const directories = ['./TaylorSession/', './jadibot/'];
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    directories.forEach((dir) => {
        readdirSync(dir, (err, files) => {
            if (err) throw err;
            files.forEach((file) => {
                const filePath = path.join(dir, file);
                stat(filePath, (err, stats) => {
                    if (err) throw err;
                    if (stats.isFile() && stats.mtimeMs < oneHourAgo && file !== 'creds.json') {
                        unlinkSync(filePath, (err) => {
                            if (err) throw err;
                            console.log(`Berkas ${file} berhasil dihapus`);
                        });
                    } else {
                        console.log(`Berkas ${file} tidak dihapus`);
                    }
                });
            });
        });
    });
}

async function connectionUpdate(update) {
    const {
        connection,
        lastDisconnect,
        isNewLogin,
        qr
    } = update;
    global.stopped = connection;
    if (isNewLogin) conn.isInit = true;
    const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
    if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
        console.log(await global.reloadHandler(true).catch(console.error));
    }
    if (global.db.data == null) loadDatabase();
    if (!pairingCode && !useMobile && useQr && qr != 0 && qr != undefined) {
        conn.logger.info(chalk.yellow('🚩ㅤPindai kode QR ini, kode QR akan kedaluwarsa dalam 60 detik.'));
    }
    if (connection === "open") {
        const {
            jid,
            name
        } = conn.user;
        const currentTime = new Date();
        const pingStart = new Date();
        const infoMsg = `
   ℹ️ *Bot Info:*
   
   🕒 Waktu sekarang: ${currentTime}
   👤 Nama: ${name || 'Taylors'}
   🏷️ Tag: @${jid.split('@')[0]}
   ⏱️ Kecepatan ping: ${pingStart - new Date()}ms
   📅 Tanggal: ${currentTime.toDateString()}
   🕰️ Jam: ${currentTime.toLocaleTimeString()}
   📅 Hari: ${currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
   📝 Deskripsi: *Bot ${name || 'Taylors'} sudah aktif*.
        `;
        conn.sendMessage(nomorown + "@s.whatsapp.net", {
            text: infoMsg,
            mentions: [nomorown + "@s.whatsapp.net", jid]
        }, {
            quoted: null
        })
        chalk.yellow('R E A D Y');
    }
    if (connection == 'close') {
        console.log(chalk.yellow(`🚩ㅤKoneksi ditutup, harap hapus folder ${global.authFile} dan pindai ulang kode QR`));
    }
}

process.on('uncaughtException', console.error);

let isInit = true;
let handler = await import('./handler.js');
global.reloadHandler = async function(restatConn) {
    try {
        const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
        if (Object.keys(Handler || {}).length) handler = Handler;
    } catch (error) {
        console.error;
    }
    if (restatConn) {
        const oldChats = global.conn.chats;
        try {
            global.conn.ws.close();
        } catch {}
        conn.ev.removeAllListeners();
        global.conn = makeWaSocket(connectionOptions, {
            chats: oldChats
        });
        isInit = true;
    }
    if (!isInit) {
        conn.ev.off('messages.upsert', conn.handler);
        conn.ev.off('messages.update', conn.pollUpdate);
        conn.ev.off('group-participants.update', conn.participantsUpdate);
        conn.ev.off('groups.update', conn.groupsUpdate);
        conn.ev.off('message.delete', conn.onDelete);
        conn.ev.off("presence.update", conn.presenceUpdate);
        conn.ev.off('connection.update', conn.connectionUpdate);
        conn.ev.off('creds.update', conn.credsUpdate);
    }

    const emoji = {
        welcome: '👋',
        bye: '👋',
        promote: '👤👑',
        demote: '👤🙅‍♂️',
        desc: '📝',
        subject: '📌',
        icon: '🖼️',
        revoke: '🔗',
        announceOn: '🔒',
        announceOff: '🔓',
        restrictOn: '🚫',
        restrictOff: '✅',
    };

    conn.welcome = `${emoji.welcome} Hallo @user\n\n   *W E L C O M E*\n⫹⫺ Di grup @subject\n\n⫹⫺ Baca *DESKRIPSI*\n@desc`;
    conn.bye = `   *G O O D B Y E*\n${emoji.bye} Sampai jumpa @user`;
    conn.spromote = `*${emoji.promote} @user* sekarang menjadi admin!`;
    conn.sdemote = `*${emoji.demote} @user* tidak lagi menjadi admin!`;
    conn.sDesc = `${emoji.desc} Deskripsi telah diubah menjadi:\n@desc`;
    conn.sSubject = `${emoji.subject} Judul grup telah diubah menjadi:\n@subject`;
    conn.sIcon = `${emoji.icon} Icon grup telah diubah!`;
    conn.sRevoke = `${emoji.revoke} Link grup telah diubah ke:\n@revoke`;
    conn.sAnnounceOn = `${emoji.announceOn} Grup telah ditutup!\nSekarang hanya admin yang dapat mengirim pesan.`;
    conn.sAnnounceOff = `${emoji.announceOff} Grup telah dibuka!\nSekarang semua peserta dapat mengirim pesan.`;
    conn.sRestrictOn = `${emoji.restrictOn} Edit Info Grup diubah ke hanya admin!`;
    conn.sRestrictOff = `${emoji.restrictOff} Edit Info Grup diubah ke semua peserta!`;

    conn.handler = handler.handler.bind(global.conn);
    conn.pollUpdate = handler.pollUpdate.bind(global.conn);
    conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
    conn.groupsUpdate = handler.groupsUpdate.bind(global.conn);
    conn.onDelete = handler.deleteUpdate.bind(global.conn);
    conn.presenceUpdate = handler.presenceUpdate.bind(global.conn);
    conn.connectionUpdate = connectionUpdate.bind(global.conn);
    conn.credsUpdate = saveCreds.bind(global.conn, true);

    const currentDateTime = new Date();
    const messageDateTime = new Date(conn.ev);
    if (currentDateTime >= messageDateTime) {
        const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0]);
    } else {
        const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0]);
    }

    conn.ev.on('messages.upsert', conn.handler);
    conn.ev.on("messages.update", conn.pollUpdate);
    conn.ev.on('group-participants.update', conn.participantsUpdate);
    conn.ev.on('groups.update', conn.groupsUpdate);
    conn.ev.on('message.delete', conn.onDelete);
    conn.ev.on("presence.update", conn.presenceUpdate);
    conn.ev.on('connection.update', conn.connectionUpdate);
    conn.ev.on('creds.update', conn.credsUpdate);
    isInit = false;
    return true;
};

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};
async function filesInit() {
    for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
        try {
            const file = global.__filename(join(pluginFolder, filename));
            const module = await import(file);
            global.plugins[filename] = module.default || module;
        } catch (e) {
            conn.logger.error(e);
            delete global.plugins[filename];
        }
    }
}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error);

global.reload = async (_ev, filename) => {
    if (pluginFilter(filename)) {
        const dir = global.__filename(join(pluginFolder, filename), true);
        if (filename in global.plugins) {
            if (existsSync(dir)) conn.logger.info(` updated plugin - '${filename}'`);
            else {
                conn.logger.warn(`deleted plugin - '${filename}'`);
                return delete global.plugins[filename];
            }
        } else conn.logger.info(`new plugin - '${filename}'`);
        const err = syntaxerror(readFileSync(dir), filename, {
            sourceType: 'module',
            allowAwaitOutsideFunction: true,
        });
        if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`);
        else {
            try {
                const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
                global.plugins[filename] = module.default || module;
            } catch (e) {
                conn.logger.error(`error require plugin '${filename}\n${format(e)}'`);
            } finally {
                global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
            }
        }
    }
};
Object.freeze(global.reload);
watch(pluginFolder, global.reload);
await global.reloadHandler();
async function _quickTest() {
    const test = await Promise.all([
        spawn('ffmpeg'),
        spawn('ffprobe'),
        spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
        spawn('convert'),
        spawn('magick'),
        spawn('gm'),
        spawn('find', ['--version']),
    ].map((p) => {
        return Promise.race([
            new Promise((resolve) => {
                p.on('close', (code) => {
                    resolve(code !== 127);
                });
            }),
            new Promise((resolve) => {
                p.on('error', (_) => resolve(false));
            })
        ]);
    }));
    const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
    const s = global.support = {
        ffmpeg,
        ffprobe,
        ffmpegWebp,
        convert,
        magick,
        gm,
        find
    };
    Object.freeze(global.support);
}
setInterval(async () => {
    if (stopped === 'close' || !conn || !conn.user) return;
    await clearTmp();
    console.log(chalk.cyanBright(
        `\n╭───────────────────────────────────···\n│\n` +
        `│  Penyegaran Tempat Penyimpanan Berhasil ✅\n│\n` +
        `╰──────────────────────────────────────···\n`
    ));
}, 60 * 60 * 1000);

setInterval(async () => {
    if (stopped === 'close' || !conn || !conn.user) return;
    await purgeSession();
    console.log(chalk.cyanBright(
        `\n╭───────────────────────────────────···\n│\n` +
        `│  Sesi-Sesi Tersimpan Sudah Dihapus ✅\n│\n` +
        `╰───────────────────────────────────···\n`
    ));
}, 60 * 60 * 1000);

setInterval(async () => {
    if (stopped === 'close' || !conn || !conn.user) return;
    await purgeSessionSB();
    console.log(chalk.cyanBright(
        `\n╭───────────────────────────────────···\n│\n` +
        `│  Sesi-Sesi Sub-Bot Telah Dihapus ✅\n│\n` +
        `╰───────────────────────────────────···\n`
    ));
}, 60 * 60 * 1000);

setInterval(async () => {
    if (stopped === 'close' || !conn || !conn.user) return;
    await purgeOldFiles();
    console.log(chalk.cyanBright(
        `\n╭───────────────────────────────────···\n│\n` +
        `│  Berkas Lama Telah Dihapus ✅\n│\n` +
        `╰───────────────────────────────────···\n`
    ));
}, 60 * 60 * 1000);

function clockString(ms) {
    const d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
    const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
    const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [d, ' Hari ', h, ' Jam ', m, ' Menit ', s, ' Detik '].map((v) => v.toString().padStart(2, '0')).join('');
}
_quickTest().catch(console.error);