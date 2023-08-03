import { performance } from 'perf_hooks';

export async function before(m) {
  this.spamData = this.spamData || {};
  const chatData = global.db.data.chats[m.chat];
  const senderId = m.sender;
  const userData = global.db.data.users[senderId];

  this.spamData[senderId] = this.spamData[senderId] || { count: 0, lastMsgTime: 0, isSpam: false, cooldownEndTime: 0 };
  const now = performance.now();
  const timeDifference = now - this.spamData[senderId].lastMsgTime;

  if (chatData.antiSpam && !m.isBaileys) {
    if (this.spamData[senderId].isSpam && now < this.spamData[senderId].cooldownEndTime) {
      const remainingCooldown = Math.ceil((this.spamData[senderId].cooldownEndTime - now) / 1000);
      if (m.isCommand) {
        const waitCooldownMessage = `⏳ *Cooldown*\nTunggu setelah ${remainingCooldown} detik`; // Message displayed when the user is asked to wait during the cooldown period.
        await this.reply(m.chat, waitCooldownMessage, m, { mentions: [senderId] });
      }
      return;
    }

    this.spamData[senderId].count++;
    this.spamData[senderId].lastMsgTime = now;

    if (this.spamData[senderId].count >= 5 && timeDifference < 5000) {
      userData.banned = true;
      this.spamData[senderId].isSpam = true;
      this.spamData[senderId].cooldownEndTime = now + 5000;
      const remainingCooldown = Math.ceil((this.spamData[senderId].cooldownEndTime - now) / 1000);

      setTimeout(() => {
        userData.banned = false;
        this.spamData[senderId].isSpam = false;
        m.reply(`✅ *Cooldown selesai*\nAnda bisa mengirim pesan lagi.`);
      }, 5000);

      this.spamData[senderId].count = 0;
      const spamWarningMessage = `❌ *Mohon jangan spam*\nTunggu setelah ${remainingCooldown} detik`; // Message displayed when the user has been spamming and is asked to wait.
      await this.reply(m.chat, spamWarningMessage, m, { mentions: [senderId] });
    }
  }
}
