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

async function getData() {
  const url = "https://megane0109.github.io/hosting-example/order.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`レスポンスステータス: ${response.status}`);
    }

    const result = await response.json();
    console.log(result.box_1);
    
    var greet = document.getElementById('boxes')
    greet.innerHTML = result.box_1




  } catch (error) {
    console.error(error.message);
  }
}

function alertman() {
  alert("Hello World");
}