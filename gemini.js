// --- 初期設定 ---
const WEBHOOK_URL = 'YOUR_WEBHOOK_URL_HERE';

document.addEventListener('DOMContentLoaded', () => {
    initForm();
    document.getElementById('submitBtn').addEventListener('click', sendToDiscord);
});

function initForm() {
    const dateSelect = document.getElementById('date');
    const timeSelect = document.getElementById('time');

    for (let i = 0; i < 14; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        dateSelect.add(new Option(`${mm}/${dd}`, `${mm}/${dd}`));
    }

    for (let h = 9; h <= 18; h++) {
        for (let m = 0; m < 60; m += 15) {
            if (h === 18 && m > 0) break;
            const hh = String(h).padStart(2, '0');
            const mm = String(m).padStart(2, '0');
            timeSelect.add(new Option(`${hh}:${mm}`, `${hh}:${mm}`));
        }
    }
}

async function sendToDiscord() {
    const data = {
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        content: document.getElementById('content').value,
        count: document.getElementById('count').value
    };

    if (!data.content) {
        alert('内容を入力してください');
        return;
    }

    const payload = {
        embeds: [{
            title: "🚚 納品報告",
            color: 5814783,
            fields: [
                { name: "納品日", value: data.date, inline: true },
                { name: "納品時刻", value: data.time, inline: true },
                { name: "内容", value: data.content },
                { name: "個数", value: `${data.count}個`, inline: true }
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
        showStatus("❌ 送信失敗。設定を確認してください。", "#e74c3c");
    }
}

function showStatus(msg, color) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.innerText = msg;
    statusDiv.style.color = color;
    statusDiv.style.display = "block";
}