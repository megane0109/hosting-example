 async function logToDiscord() {
        // Webhook URL
        const webhookUrl = 'https://discordapp.com/api/webhooks/1492542194870128850/mInnnsxcHerVFC6AP-AtPMclcmADVoj8fjQIirC61lXD32eGWzgVrkNH_8kBvzircBPw';

        // 投稿内容
        const payload = {
            "content": "# Hello from Webhook"
        };

        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('Discordへの送信に失敗しました:', error);
        }
        }
import data from './order.json' with { type: 'json'};
console.log(data.day);