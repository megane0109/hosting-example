const WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1492542194870128850/mInnnsxcHerVFC6AP-AtPMclcmADVoj8fjQIirC61lXD32eGWzgVrkNH_8kBvzircBPw';

document.addEventListener('DOMContentLoaded', () => {
    initForm();
    setupToggleEvents();
    document.getElementById('submitBtn').addEventListener('click', sendToDiscord);
});

function initForm() {
    // 翌日の日付設定
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('date').value = tomorrow.toISOString().split('T')[0];

    // 時刻初期値 11:00
    const hourSel = document.getElementById('hour');
    const minSel = document.getElementById('minute');
    for (let h = 9; h <= 18; h++) {
        const hh = String(h).padStart(2, '0');
        hourSel.add(new Option(`${hh}時`, hh, h===11, h===11));
    }
    [0, 15, 30, 45].forEach(m => {
        const mm = String(m).padStart(2, '0');
        minSel.add(new Option(`${mm}分`, mm, m===0, m===0));
    });

    // 各行の個数セレクトボックス (1-10, 初期値10)
    document.querySelectorAll('.item-count').forEach(sel => {
        for (let c = 1; c <= 10; c++) {
            sel.add(new Option(`${c}個`, c, c===10, c===10));
        }
    });
}

function setupToggleEvents() {
    document.querySelectorAll('.row-toggle').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const rowId = `row-${e.target.dataset.row}`;
            const rowElement = document.getElementById(rowId);
            const selects = rowElement.querySelectorAll('select');
            
            if (e.target.checked) {
                rowElement.classList.remove('disabled-row');
                selects.forEach(s => s.disabled = false);
            } else {
                rowElement.classList.add('disabled-row');
                selects.forEach(s => s.disabled = true);
            }
        });
    });
}

async function sendToDiscord() {
    const rawDate = document.getElementById('date').value;
    const hour = document.getElementById('hour').value;
    const min = document.getElementById('minute').value;
    
    if (!rawDate) return alert("日付を選択してください");

    // 有効な行のデータだけを収集
    const activeFields = [];
    document.querySelectorAll('.input-line').forEach(row => {
        const isEnabled = row.querySelector('.row-toggle').checked;
        if (isEnabled) {
            const content = row.querySelector('.item-content').value;
            const count = row.querySelector('.item-count').value;
            activeFields.push({ name: "内容・個数", value: `${content}：${count}個` });
        }
    });

    if (activeFields.length === 0) return alert("送信する行を少なくとも1つ有効にしてください");

    const dateParts = rawDate.split('-');
    const payload = {
        embeds: [{
            title: "🚚 納品報告",
            color: 5814783,
            fields: [
                { name: "納品日", value: `${dateParts[1]}/${dateParts[2]}`, inline: true },
                { name: "納品時刻", value: `${hour}:${min}`, inline: true },
                ...activeFields
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
    } catch (e) {
        showStatus("❌ 送信失敗", "#e74c3c");
    }
}

function showStatus(msg, color) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.innerText = msg;
    statusDiv.style.color = "white";
    statusDiv.style.backgroundColor = color;
    statusDiv.style.display = "block";
}