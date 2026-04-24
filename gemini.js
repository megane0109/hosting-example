// 指定されたWebhook URL
const WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1492542194870128850/mInnnsxcHerVFC6AP-AtPMclcmADVoj8fjQIirC61lXD32eGWzgVrkNH_8kBvzircBPw';

document.addEventListener('DOMContentLoaded', () => {
    initForm();
    document.getElementById('submitBtn').addEventListener('click', sendToDiscord);
});

function initForm() {
    const dateInput = document.getElementById('date');
    const hourSelect = document.getElementById('hour');
    const minuteSelect = document.getElementById('minute');
    const countSelect = document.getElementById('count');

    // 1. 初期値を翌日に設定
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;

    // 2. 時の選択肢 (9 - 18) / 初期値 11時
    for (let h = 9; h <= 18; h++) {
        const hh = String(h).padStart(2, '0');
        const opt = new Option(`${hh}時`, hh);
        if (hh === "11") opt.selected = true;
        hourSelect.add(opt);
    }

    // 3. 分の選択肢 (00, 15, 30, 45) / 初期値 00分
    [0, 15, 30, 45].forEach(m => {
        const min = String(m).padStart(2, '0');
        const opt = new Option(`${min}分`, min);
        if (min === "00") opt.selected = true;
        minuteSelect.add(opt);
    });

    // 4. 個数の選択肢 (1 - 10) / 初期値 10個
    for (let c = 1; c <= 10; c++) {
        const opt = new Option(`${c}個`, c);
        if (c === 10) opt.selected = true;
        countSelect.add(opt);
    }

    // 18時の時は00分固定にする制御
    hourSelect.addEventListener('change', () => {
        if (hourSelect.value === "18") {
            minuteSelect.value = "00";
            Array.from(minuteSelect.options).forEach(opt => {
                if (opt.value !== "00") opt.disabled = true;
            });
        } else {
            Array.from(minuteSelect.options).forEach(opt => opt.disabled = false);
        }
    });
}

async function sendToDiscord() {
    const rawDate = document.getElementById('date').value;
    const hour = document.getElementById('hour').value;
    const minute = document.getElementById('minute').value;
    const content = document.getElementById('content').value;
    const count = document.getElementById('count').value;

    if (!rawDate) {
        alert('日付を選択してください');
        return;
    }

    const dateParts = rawDate.split('-');
    const formattedDate = `${dateParts[1]}/${dateParts[2]}`;

    const payload = {
        embeds: [{
            title: "🚚 納品報告",
            color: 5814783,
            fields: [
                { name: "納品日", value: formattedDate, inline: true },
                { name: "納品時刻", value: `${hour}:${minute}`, inline: true },
                { name: "内容", value: content, inline: false },
                { name: "個数", value: `${count}個`, inline: true }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showStatus("✅ 送信完了！", "#2ecc71");
        } else {
            throw new Error();
        }
    } catch (error) {
        showStatus("❌ 送信失敗。Webhook URLを確認してください。", "#e74c3c");
    }
}

function showStatus(msg, color) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.innerText = msg;
    statusDiv.style.color = color;
    statusDiv.style.display = "block";
}