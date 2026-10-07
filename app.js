/* 1) Supabase dashboard থেকে এই দুইটি value বসাও */
const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL";
const SUPABASE_KEY = "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY";

const configured = !SUPABASE_URL.startsWith("PASTE_") && !SUPABASE_KEY.startsWith("PASTE_");
const sb = configured ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const PUJA_DATE = new Date("2026-10-16T00:00:00+06:00");

function countdown(){
  const el=document.getElementById("countdown");
  const diff=PUJA_DATE-new Date();
  if(diff<=0){el.textContent="শুভ পুজো! 🌺";return;}
  const d=Math.floor(diff/86400000), h=Math.floor(diff%86400000/3600000),
        m=Math.floor(diff%3600000/60000), s=Math.floor(diff%60000/1000);
  el.innerHTML=`<span>${d} দিন</span><span>${h} ঘণ্টা</span><span>${m} মিনিট</span><span>${s} সেকেন্ড</span>`;
}
setInterval(countdown,1000); countdown();

const $=id=>document.getElementById(id);
let voted=false;

function renderPoll(rows){
  const totals=Array(6).fill(0);
  (rows||[]).forEach(r=>{if(r.option>=1&&r.option<=6) totals[r.option-1]++});
  const total=totals.reduce((a,b)=>a+b,0);
  $("pollOptions").innerHTML=Array.from({length:6},(_,i)=>
    `<button class="${voted?"selected":""}" onclick="vote(${i+1})">${i+1} সেট</button>`).join("");
  $("pollResults").innerHTML=totals.map((n,i)=>{
    const pct=total?Math.round(n*1000/total)/10:0;
    return `<div class="result"><div class="result-head"><span>${i+1} সেট</span><b>${pct}% (${n})</b></div><div class="bar"><div class="fill" style="width:${pct}%"></div></div></div>`;
  }).join("");
}

async function loadPoll(){
  if(!sb){renderPoll([]);return;}
  const {data,error}=await sb.from("clothes_votes").select("option");
  if(error){console.error(error);renderPoll([]);return}
  renderPoll(data);
}
async function vote(option){
  if(voted){alert("তুমি ইতিমধ্যে ভোট দিয়েছো।");return}
  if(!sb){alert("Supabase setup করা হয়নি।");return}
  const key="puja_vote_2026";
  if(localStorage.getItem(key)){voted=true;alert("তুমি ইতিমধ্যে ভোট দিয়েছো।");return}
  const {error}=await sb.from("clothes_votes").insert({option});
  if(error){alert("ভোট দেওয়া যায়নি।");console.error(error);return}
  localStorage.setItem(key,"1");voted=true;loadPoll();
}
window.vote=vote;

async function loadMedia(){
  if(!sb)return;
  const {data,error}=await sb.from("media").select("*").order("created_at",{ascending:false});
  if(error){console.error(error);return}
  const photos=data.filter(x=>x.type==="photo");
  const greetings=data.filter(x=>x.type==="greeting");
  const songs=data.filter(x=>x.type==="song").slice(0,5);
  const dhak=data.find(x=>x.type==="dhak");

  $("photos").innerHTML=photos.map(x=>`<img src="${x.url}" alt="পূজা ফটো" loading="lazy">`).join("");
  $("photosEmpty").style.display=photos.length?"none":"block";

  $("greetings").innerHTML=greetings.map(x=>`<div class="greeting"><b>${escapeHtml(x.title||"শুভ শারদীয়া")}</b>${x.caption?`<p>${escapeHtml(x.caption)}</p>`:""}</div>`).join("");
  $("greetingsEmpty").style.display=greetings.length?"none":"block";

  $("playlist").innerHTML=songs.map((x,i)=>`<div class="song"><b>${i+1}. ${escapeHtml(x.title||"পুজোর গান")}</b><audio controls src="${x.url}"></audio></div>`).join("");
  $("playlistEmpty").style.display=songs.length?"none":"block";

  if(dhak){$("dhakPlayer").src=dhak.url;$("dhakEmpty").style.display="none"}else{$("dhakEmpty").style.display="block"}
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

async function startPresence(){
  if(!sb)return;
  const channel=sb.channel("puja-online",{config:{presence:{key:crypto.randomUUID()}}});
  const update=()=>{$("onlineCount").textContent=`${Object.values(channel.presenceState()).flat().length} জন`};
  channel.on("presence",{event:"sync"},update);
  await channel.subscribe(async status=>{
    if(status==="SUBSCRIBED"){await channel.track({online_at:new Date().toISOString()});update();}
  });
}
if(sb){loadPoll();loadMedia();startPresence();}
else {renderPoll([]);$("onlineCount").textContent="Setup বাকি";}
