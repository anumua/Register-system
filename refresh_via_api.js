// refresh_via_api.js
const API_URL = process.env.DOMAIN_NAME + '/api/refresh_view';

let isRefreshing = false;

async function refreshView() {
  if (isRefreshing) return;
  isRefreshing = true;

  console.log(`[${new Date().toISOString()}] 🔄 Refreshing via API: ${API_URL}`);
  try {
    const res = await fetch(API_URL, { method: 'POST' }); // fetch built-in
    const data = await res.json();

    if (res.ok) console.log('✅ Success:', data.message);
    else console.error('❌ Failed:', data.error);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    isRefreshing = false;
  }
}

// เรียกครั้งแรกทันที
refreshView();

// ตั้ง loop ทุก 3 วินาที
setInterval(refreshView, 3000);
