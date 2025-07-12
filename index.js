const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');
const videoLinks = JSON.parse(fs.readFileSync('./links.json', 'utf8'));

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({ auth: state });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation?.toLowerCase() || "";
    const from = msg.key.remoteJid;

    for (let keyword in videoLinks) {
      if (text.includes(keyword.toLowerCase())) {
        await sock.sendMessage(from, {
          text: `🎬 Video for *${keyword}*:\n${videoLinks[keyword]}`
        });
        break;
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);
}
startBot();
