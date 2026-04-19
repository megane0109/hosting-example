 async function logToDiscord() {

        const text = pushDraw();



        // Webhook URL
        const webhookUrl = 'https://discordapp.com/api/webhooks/1495562296775282698/8d3qTvtH7grC1ww_wXCAogwvy4d9I14XAGs9ko8JC7Z9thgHGE06-ZsmCDCIlH_5GmtW';

        // 投稿内容
        const payload = {
            "content": text
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

async function bringData() {
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




function pushDraw() {
  const delivery_day = document.getElementById("calendar").value;
  const delivery_day_as_number = document.getElementById("calendar").valueAsNumber;
  const number_parse_day = new Date(delivery_day_as_number);
  const day_number = number_parse_day.getDay();
  var days_list = ["㈰", "㈪", "㈫", "㈬", "㈭", "㈮", "㈯"];
  
  const month = delivery_day.split('-')[1];
  const date = delivery_day.split('-')[2];
  const day = days_list[day_number];
  const hour = document.getElementById("select_hour").value.toString().padStart(2, '0');
  const minute = document.getElementById("select_minute").value.toString().padStart(2, '0');
  const order = document.getElementById("select_order").value;
  const box = document.getElementById("box").value;

  var markdown = document.getElementById("textarea");

  const main_string = `# ${month}月${date}日${day}__${hour}:${minute}__納品\n## ・\`${order}\`     \`x${box}箱\``;

  markdown.value = main_string;

  return main_string;

}