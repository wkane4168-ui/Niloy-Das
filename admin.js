const SUPABASE_URL="PASTE_YOUR_SUPABASE_URL";
const SUPABASE_KEY="PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY";
const ADMIN_EMAIL="YOUR_ADMIN_EMAIL";
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

async function login(){
  const {data,error}=await sb.auth.signInWithPassword({email:email.value,password:password.value});
  if(error){loginMsg.textContent=error.message;return}
  if(data.user.email.toLowerCase()!==ADMIN_EMAIL.toLowerCase()){
    await sb.auth.signOut();loginMsg.textContent="এই account admin নয়।";return;
  }
  showPanel(data.user);
}
async function showPanel(user){
  loginBox.style.display="none";panel.style.display="block";who.textContent=`Logged in: ${user.email}`;
  await refresh();
}
async function logout(){await sb.auth.signOut();location.reload()}

async function uploadFile(type){
  let input= type==="dhak"?dhakFile:type==="song"?songFile:photoFile;
  const file=input.files[0]; if(!file){alert("ফাইল নির্বাচন করো");return}
  if(type==="song"){
    const {count}=await sb.from("media").select("*",{count:"exact",head:true}).eq("type","song");
    if((count||0)>=5){alert("Playlist-এ সর্বোচ্চ ৫টি গান রাখা যাবে।");return}
  }
  const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");
  const path=`${type}/${Date.now()}-${safe}`;
  const up=await sb.storage.from("media").upload(path,file,{upsert:false});
  if(up.error){alert(up.error.message);return}
  const {data}=sb.storage.from("media").getPublicUrl(path);
  const title=type==="song"?songTitle.value:file.name;
  const ins=await sb.from("media").insert({type,title,url:data.publicUrl});
  if(ins.error){alert(ins.error.message);return}
  alert("Upload হয়েছে");input.value="";await refresh();
}
async function addGreeting(){
  const title=greetTitle.value.trim(),caption=greetCaption.value.trim();
  if(!title&&!caption){alert("শুভেচ্ছা লিখো");return}
  const {error}=await sb.from("media").insert({type:"greeting",title,caption});
  if(error){alert(error.message);return}
  greetTitle.value="";greetCaption.value="";await refresh();
}
async function refresh(){
  const {data}=await sb.from("media").select("*").order("created_at",{ascending:false});
  items.innerHTML=(data||[]).map(x=>`<div class="greeting"><b>${x.type}</b> — ${x.title||""} <button onclick="removeItem('${x.id}','${encodeURIComponent(x.url||"")}')">Delete</button></div>`).join("");
  const {data:votes}=await sb.from("clothes_votes").select("option");
  const counts=Array(6).fill(0);(votes||[]).forEach(v=>{if(v.option>=1&&v.option<=6)counts[v.option-1]++});
  const total=counts.reduce((a,b)=>a+b,0);
  stats.innerHTML=`<b>মোট ভোট: ${total}</b>`+counts.map((n,i)=>`<div>${i+1} সেট: ${n} ভোট — ${total?(n*100/total).toFixed(1):0}%</div>`).join("");
}
async function removeItem(id,url){
  if(!confirm("Delete করতে চাও?"))return;
  await sb.from("media").delete().eq("id",id);
  await refresh();
}
window.login=login;window.logout=logout;window.uploadFile=uploadFile;window.addGreeting=addGreeting;window.removeItem=removeItem;
