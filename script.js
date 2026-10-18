function toggleMenu(){document.getElementById('navLinks').classList.toggle('show')}
function toggleFaq(btn){btn.parentElement.classList.toggle('open')}
function submitForm(e){e.preventDefault();
const n=document.getElementById('name').value.trim();
const p=document.getElementById('phone').value.trim();
const l=document.getElementById('level').value;
const m=document.getElementById('mode').value;
document.getElementById('msg').textContent='Thanks '+n+'! '+l+' ('+m+') demo request noted. We will call '+p+' soon.';
return false}
function whatsapp(){
const n=(document.getElementById('name')||{}).value||'';
window.open('https://wa.me/91XXXXXXXXXX?text='+encodeURIComponent('Hi! I want free chess demo. Name: '+n),'_blank')}
document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>{document.getElementById('navLinks').classList.remove('show')}));
