const API = typeof browser !== 'undefined' ? browser : chrome;
const $=(q)=>document.querySelector(q);
$('#btn-activate').onclick=async()=>{
  // здесь может быть реальная верификация ключа; в демо просто выставляем VIP
  await API.runtime.sendMessage({ type:'set-license', plan:'vip' });
  $('#msg').hidden=false;
};
$('#btn-sim').onclick=async()=>{
  await API.runtime.sendMessage({ type:'set-license', plan:'vip' });
  $('#msg').hidden=false;
};
