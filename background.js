// 签到页面地址
const CHECKIN_URL = 'https://glados.cloud/console/checkin';

// 闹钟名称
const ALARM_NAME = 'glados-daily-checkin';

// 到点就打开签到页（content 脚本会在页面上自动点击签到按钮）
function openCheckinPage() {
  chrome.tabs.create({ url: CHECKIN_URL });
}

// 监听闹钟：每天到设定时间就执行
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    openCheckinPage();
  }
});

// 安装扩展时，如果没有设置过时间，就设一个默认时间（早上 8 点）
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['hour', 'minute'], (result) => {
    if (result.hour == null || result.minute == null) {
      chrome.storage.local.set({ hour: 8, minute: 0 });
      setAlarm(8, 0);
    } else {
      setAlarm(result.hour, result.minute);
    }
  });
});

// 根据小时、分钟设置“每天一次”的闹钟
function setAlarm(hour, minute) {
  const now = new Date();
  let next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  chrome.alarms.create(ALARM_NAME, {
    when: next.getTime(),
    periodInMinutes: 24 * 60
  });
}

// 接收来自 popup 的消息：立即签到 / 修改每日时间
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'checkinNow') {
    openCheckinPage();
    sendResponse({ ok: true });
  } else if (message.action === 'setTime' && message.hour != null && message.minute != null) {
    setAlarm(message.hour, message.minute);
    sendResponse({ ok: true });
  }
  return true;
});
