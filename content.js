// 在签到页面加载后，自动查找并点击「签到」按钮

function findAndClickCheckinButton() {
  // 常见按钮文本：签到、Check in、Check-in 等
  const candidates = document.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"]');
  for (const el of candidates) {
    const text = (el.textContent || el.value || '').trim();
    if (/签到|Check\s*in|Check-in|check\s*in/i.test(text)) {
      el.click();
      console.log('[GLaDOS 自动签到] 已点击签到按钮');
      return true;
    }
  }
  return false;
}

// 页面加载后可能按钮还没渲染，多试几次
let tries = 0;
const maxTries = 10;
const interval = 500;

function tryClick() {
  if (findAndClickCheckinButton()) return;
  tries++;
  if (tries < maxTries) {
    setTimeout(tryClick, interval);
  }
}

// 先等 1 秒再开始找按钮（给页面渲染时间）
setTimeout(tryClick, 1000);
