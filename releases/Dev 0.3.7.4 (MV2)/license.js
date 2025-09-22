const $=(q)=>document.querySelector(q);
$('#btn-activate').onclick=async()=>{
  // здесь могла бы быть проверка ECDSA; в демо просто устанавливаем VIP
  await browser.runtime.sendMessage({ type:'set-license', plan:'vip' });
  $('#msg').hidden=false;
};
$('#btn-sim').onclick=async()=>{
  await browser.runtime.sendMessage({ type:'set-license', plan:'vip' });
  $('#msg').hidden=false;
};
