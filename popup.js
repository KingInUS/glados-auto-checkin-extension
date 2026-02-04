// 打开弹窗时，从存储里读出上次保存的时间
chrome.storage.local.get(['hour', 'minute'], (result) => {
  document.getElementById('hour').value = result.hour != null ? result.hour : 8;
  document.getElementById('minute').value = result.minute != null ? result.minute : 0;
});

// 保存时间
document.getElementById('save').addEventListener('click', () => {
  const hour = parseInt(document.getElementById('hour').value, 10) || 0;
  const minute = parseInt(document.getElementById('minute').value, 10) || 0;
  chrome.storage.local.set({ hour, minute });
  chrome.runtime.sendMessage({ action: 'setTime', hour, minute }, () => {
    alert('已保存！每天 ' + hour + ':' + (minute < 10 ? '0' : '') + minute + ' 将自动打开签到页。');
  });
});

// 立即签到：打开签到页，content 脚本会自动点击
document.getElementById('now').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'checkinNow' });
  window.close();
});
