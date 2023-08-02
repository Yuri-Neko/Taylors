// Impor modul untuk mengatur waktu
import { performance } from 'perf_hooks';

export async function before(m) {
  this.spam = this.spam || {};
  const chat = global.db.data.chats[m.chat];
  const senderId = m.sender;

  // Inisialisasi data spam sender jika belum ada
  this.spam[senderId] = this.spam[senderId] || {
    count: 0,
    lastMsgTime: 0,
    isSpam: false,
    cooldownEndTime: 0
  };

  const now = performance.now();
  const timeDifference = now - this.spam[senderId].lastMsgTime;

  if (chat.antiSpam && !m.isBaileys) {
    if (this.spam[senderId].isSpam && now < this.spam[senderId].cooldownEndTime) {
      const remainingCooldown = Math.ceil((this.spam[senderId].cooldownEndTime - now) / 1000);
      m.reply(`⏳ Mohon tunggu *${remainingCooldown} detik* sebelum mengirim pesan lagi.`);
      return;
    }

    this.spam[senderId].count++;
    this.spam[senderId].lastMsgTime = now;

    if (this.spam[senderId].count >= 5 && timeDifference < 5000) {
      chat.isBanned = true;
      this.spam[senderId].isSpam = true;
      this.spam[senderId].cooldownEndTime = now + 5000;
      const remainingCooldown = Math.ceil((this.spam[senderId].cooldownEndTime - now) / 1000);

      setTimeout(() => {
        chat.isBanned = false;
        this.spam[senderId].isSpam = false;
        m.reply(`⏳ Cooldown selesai. Anda bisa mengirim pesan lagi.`);
      }, 5000);

      this.spam[senderId].count = 0;
      m.reply(`🚫 *Anda telah melakukan spam dalam chat.* Mohon tunggu *${remainingCooldown} detik* sebelum mengirim pesan lagi.`);
    }
  }
}
