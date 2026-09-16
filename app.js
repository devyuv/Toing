const STORAGE_KEY="toing_restaurants_v1", FAV_KEY="toing_favorites_v1";
let restaurants=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null")||DEFAULT_RESTAURANTS;
let favorites=new Set(JSON.parse(localStorage.getItem(FAV_KEY)||"[]"));
let activeCat="All", favoritesOnly=false;
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(restaurants));}
function saveFav(){localStorage.setItem(FAV_KEY,JSON.stringify([...favorites]));}
function tel(phone){return phone ? `tel:${String(phone).replace(/[^\d+]/g,"")}` : "#";}
function render(){
  const q=($("#search")?.value||"").trim().toLowerCase();
  const list=restaurants.filter(r=>{
    const text=JSON.stringify(r).toLowerCase();
    return (!q||text.includes(q))&&(!favoritesOnly||favorites.has(r.id))&&(activeCat==="All"||r.category===activeCat);
  });
  $("#count").textContent=`${list.length} ${list.length===1?"place":"places"}`;
  $("#empty").classList.toggle("hidden",list.length>0);
  $("#restaurants").innerHTML=list.map(card).join("");
}
function card(r){
  const fav=favorites.has(r.id);
  return `<article class="card">
    <img class="food-photo" src="${esc(r.image||"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80")}" alt="${esc(r.name)}" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80'">
    <div class="card-body">
      <div class="card-title"><div><h3>${esc(r.name)}</h3><div class="meta">${esc(r.area||r.address||"Jharsuguda")} · ${esc(r.rating||"—")}</div></div>
      <button class="heart" onclick="toggleFav('${esc(r.id)}')" aria-label="Favorite">${fav?"♥":"♡"}</button></div>
      <div class="tags">${(r.tags||[r.category]).slice(0,4).map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div>
      <div class="meta">🕒 ${esc(r.hours||"Hours not provided")}</div>
      <div class="actions"><button class="btn menu-btn" onclick="openMenu('${esc(r.id)}')">View Menu</button>
      <a class="btn call-btn" href="${tel(r.phone)}" onclick="return requirePhone('${esc(r.id)}')">Order 📞</a></div>
    </div></article>`;
}
function requirePhone(id){const r=restaurants.find(x=>x.id===id);if(!r?.phone){alert("This restaurant does not have a verified/public phone number yet.");return false}return true}
function toggleFav(id){favorites.has(id)?favorites.delete(id):favorites.add(id);saveFav();render();}
function openMenu(id){
  const r=restaurants.find(x=>x.id===id);if(!r)return;
  $("#modalBody").innerHTML=`<img class="menu-img" src="${esc(r.image)}" alt=""><h2>${esc(r.name)}</h2><p class="meta">${esc(r.address||"Jharsuguda")} · ${esc(r.category)}</p>
  <div>${(r.menu||[]).map(m=>`<div class="menu-row"><div><strong>${esc(m.name)}</strong><div class="meta">${esc(m.desc||"")}</div></div><span class="price">₹${esc(m.price)}</span></div>`).join("")}</div>
  <a class="btn call-btn modal-call" href="${tel(r.phone)}" onclick="return requirePhone('${esc(r.id)}')">Call & Order 📞</a>`;
  $("#modal").classList.remove("hidden");$("#modal").setAttribute("aria-hidden","false");
}
$("#closeModal").onclick=()=>{$("#modal").classList.add("hidden");$("#modal").setAttribute("aria-hidden","true")};
$("#modal").onclick=e=>{if(e.target.id==="modal")$("#closeModal").click()};
$("#search").oninput=render;
document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeCat=b.dataset.cat;favoritesOnly=false;document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));document.querySelector('[data-view="home"]').classList.add("active");render()});
document.querySelector('[data-view="favorites"]').onclick=()=>{favoritesOnly=true;document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));document.querySelector('[data-view="favorites"]').classList.add("active");render()};
document.querySelector('[data-view="home"]').onclick=()=>{favoritesOnly=false;document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));document.querySelector('[data-view="home"]').classList.add("active");render()};
let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installBtn").classList.remove("hidden")});
$("#installBtn").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("#installBtn").classList.add("hidden")}};
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
render();
