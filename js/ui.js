(function(){var A=window.DepositApp,U=A.utils,C=A.calc,$=U.$,$$=U.$$,UI=A.ui={},edited=false;

/* ---------- segmented controls ---------- */
UI.val=function(n){var e=$('input[name="'+n+'"]:checked');return e?e.value:""};
UI.segSync=function(el){var i=$$("input",el).findIndex(function(x){return x.checked});el.style.setProperty("--i",Math.max(i,0))};
UI.seg=function(el){var n=el.dataset.name,def=el.dataset.def,o=el.dataset.opts.split("|");
 el.setAttribute("role","radiogroup");el.style.setProperty("--n",o.length);
 el.innerHTML=o.map(function(s,i){var p=s.split(":");return'<input type="radio" name="'+n+'" id="'+n+i+'" value="'+p[0]+'"'+(p[0]===def?" checked":"")+'><label for="'+n+i+'">'+p[1]+"</label>"}).join("");
 UI.segSync(el);el.addEventListener("change",function(){UI.segSync(el)})};

/* ---------- currency input: format on blur only, so the caret never jumps ---------- */
UI.cur=function(i){
 i.addEventListener("input",function(){var s=i.value.replace(/[^\d.]/g,""),p=s.split(".");
  if(p.length>1)s=p[0]+"."+p.slice(1).join("").slice(0,2);if(U.num(s)>1e6)s="1000000";if(s!==i.value)i.value=s});
 i.addEventListener("focus",function(){setTimeout(function(){i.select()},0)});
 i.addEventListener("blur",function(){if(i.value!=="")i.value=U.fmt(U.num(i.value))})};

UI.cond=function(el,on){el.classList.toggle("open",on);el.inert=!on};

/* ---------- searchable state combobox ---------- */
UI.combo=function(){
 var inp=$("#state"),ul=$("#stateList"),x=$("#stateX"),S=A.states,li={},cur=null,val="",none=document.createElement("li");
 Object.keys(S).forEach(function(c){var e=document.createElement("li");e.id="o-"+c;e.dataset.c=c;e.setAttribute("role","option");e.setAttribute("aria-selected","false");e.textContent=S[c].name+" ("+c+")";ul.appendChild(e);li[c]=e});
 none.textContent="No states found";none.className="none";none.hidden=true;ul.appendChild(none);
 var all=Object.keys(li).map(function(c){return li[c]});
 function vis(){return all.filter(function(e){return!e.hidden})}
 function hl(e){if(cur)cur.classList.remove("hl");cur=e||null;if(cur){cur.classList.add("hl");inp.setAttribute("aria-activedescendant",cur.id);cur.scrollIntoView({block:"nearest"})}else inp.removeAttribute("aria-activedescendant")}
 function show(){ul.hidden=false;inp.setAttribute("aria-expanded","true")}
 function hide(){ul.hidden=true;inp.setAttribute("aria-expanded","false");hl(null)}
 function filter(q){q=q.trim().toLowerCase();all.forEach(function(e){var c=e.dataset.c;e.hidden=!!q&&S[c].name.toLowerCase().indexOf(q)<0&&c.toLowerCase()!==q});none.hidden=vis().length>0}
 var sh=$("#stDlg"),sq=$("#stQ"),sul=$("#stSheet"),sli={},snone=document.createElement("li"),mq=matchMedia("(max-width:639px)");
 if(sh){Object.keys(S).forEach(function(c){var e=document.createElement("li");e.dataset.c=c;e.setAttribute("role","option");e.setAttribute("aria-selected","false");e.textContent=S[c].name+" ("+c+")";sul.appendChild(e);sli[c]=e});
  snone.textContent="No states found";snone.className="none";snone.hidden=true;sul.appendChild(snone)}
 function phone(){return!!sh&&mq.matches}
 function ro(){inp.readOnly=phone();inp.setAttribute("inputmode",phone()?"none":"text")}
 ro();if(mq.addEventListener)mq.addEventListener("change",ro);else if(mq.addListener)mq.addListener(ro);
 function sfilter(q){q=q.trim().toLowerCase();var n=0;Object.keys(sli).forEach(function(c){var h=!!q&&S[c].name.toLowerCase().indexOf(q)<0&&c.toLowerCase()!==q;sli[c].hidden=h;if(!h)n++});snone.hidden=n>0}
 function sopen(){sq.value="";sfilter("");Object.keys(sli).forEach(function(c){sli[c].setAttribute("aria-selected",String(c===val))});UI.open(sh);
  requestAnimationFrame(function(){if(val)sli[val].scrollIntoView({block:"center"});else sul.parentNode.scrollTop=0})}
 function pick(c){val=c;inp.value=S[c].name;all.forEach(function(e){e.setAttribute("aria-selected",String(e.dataset.c===c))});x.hidden=false;hide();inp.removeAttribute("aria-invalid");$("#e-state").textContent="";
  inp.dispatchEvent(new Event("change",{bubbles:true}))}
 function open(){filter(val?"":inp.value);show();hl(val?li[val]:vis()[0])}
 inp.addEventListener("focus",function(){if(!phone())open()});inp.addEventListener("click",function(){if(phone())sopen();else if(ul.hidden)open()});
 if(sh){sq.addEventListener("input",function(){sfilter(sq.value)});
  sq.addEventListener("keydown",function(ev){if(ev.key==="Enter"){ev.preventDefault();var f=Object.keys(sli).filter(function(c){return!sli[c].hidden})[0];if(f){pick(f);UI.close(sh)}}});
  sul.addEventListener("click",function(ev){var e=ev.target.closest("li[data-c]");if(e){pick(e.dataset.c);UI.close(sh)}})}
 inp.addEventListener("input",function(){val="";x.hidden=!inp.value;filter(inp.value);show();hl(vis()[0])});
 inp.addEventListener("keydown",function(ev){var k=ev.key,v=vis(),i=v.indexOf(cur);
  if(phone()){if(k==="Enter"||k===" "||k==="ArrowDown"){ev.preventDefault();sopen()}return}
  if(k==="ArrowDown"||k==="ArrowUp"){ev.preventDefault();if(ul.hidden)show();if(v.length)hl(v[k==="ArrowDown"?Math.min(i+1,v.length-1):Math.max(i-1,0)])}
  else if((k==="Home"||k==="End")&&!ul.hidden&&!inp.value){ev.preventDefault();hl(v[k==="Home"?0:v.length-1])}
  else if(k==="Enter"&&!ul.hidden&&cur){ev.preventDefault();pick(cur.dataset.c)}
  else if(k==="Escape"&&!ul.hidden){ev.preventDefault();hide()}
  else if(k==="Tab"&&!ul.hidden){if(!val&&cur&&inp.value)pick(cur.dataset.c);hide()}});
 ul.addEventListener("pointerdown",function(ev){ev.preventDefault()});
 ul.addEventListener("click",function(ev){var e=ev.target.closest("li[data-c]");if(e)pick(e.dataset.c)});
 document.addEventListener("pointerdown",function(ev){if(!ul.hidden&&!$("#combo").contains(ev.target))hide()});
 x.addEventListener("click",function(){api.clear();inp.focus()});
 var api={get:function(){return val},set:function(c){if(S[c])pick(c)},clear:function(){val="";inp.value="";x.hidden=true;all.forEach(function(e){e.setAttribute("aria-selected","false")});filter("");hide();inp.dispatchEvent(new Event("change",{bubbles:true}))}};
 return api};

/* ---------- fallback: plain native <select> if the custom combobox can't run ---------- */
UI.comboNative=function(){var S=A.states,w=$("#combo"),sel=document.createElement("select");
 sel.id="state";sel.className="nat";sel.innerHTML='<option value="">Select your state</option>'+Object.keys(S).map(function(c){return'<option value="'+c+'">'+S[c].name+"</option>"}).join("");
 w.innerHTML="";w.appendChild(sel);
 return{get:function(){return sel.value},set:function(c){sel.value=S[c]?c:""},clear:function(){sel.value="";sel.dispatchEvent(new Event("change",{bubbles:true}))}}};

/* ---------- toasts (popover keeps them above open dialogs) ---------- */
UI.toast=function(msg,label,fn){var c=$("#toasts"),t=document.createElement("div"),s=document.createElement("span"),id;
 t.className="toast";s.textContent=msg;t.appendChild(s);
 function off(){clearTimeout(id);t.classList.add("out");t.addEventListener("animationend",function(){t.remove()},{once:true})}
 function arm(){clearTimeout(id);id=setTimeout(off,label?5000:3000)}
 if(label){var b=document.createElement("button");b.type="button";b.textContent=label;b.onclick=function(){fn();off()};t.appendChild(b)}
 t.addEventListener("pointerenter",function(){clearTimeout(id)});t.addEventListener("pointerleave",arm);t.addEventListener("click",function(e){if(e.target===t||e.target===s)off()});
 while(c.children.length>=3)c.firstChild.remove();
 c.appendChild(t);
 try{if($("dialog[open]")&&c.matches(":popover-open"))c.hidePopover()}catch(e){}
 try{if(!c.matches(":popover-open"))c.showPopover()}catch(e){}
 arm()};

/* ---------- dialogs (native <dialog>: focus trap, inert background, Esc, focus return) ----------
   + animated open/close, and the phone Back button closes the top dialog instead of leaving the page */
var hist=[],back=0,skip=0,bt;
function reduced(){return matchMedia("(prefers-reduced-motion:reduce)").matches}
function unwind(){if(!back)return;var n=back;back=0;skip++;history.go(-n)}
UI.open=function(d){if(d.open)return;d._closing=false;d.classList.remove("closing");d.showModal();document.body.classList.add("lock");
 try{history.pushState({dlg:d.id},"");hist.push(d)}catch(e){}};
UI.close=function(d,now){if(!d.open||d._closing)return;
 function fin(){d._closing=false;d.classList.remove("closing");if(d.open)d.close()}
 if(now||reduced()){fin();return}
 d._closing=true;d.classList.add("closing");var done=false;
 function g(){if(done)return;done=true;fin()}
 d.addEventListener("animationend",function h(e){if(e.target===d&&/out$/.test(e.animationName)){d.removeEventListener("animationend",h);g()}});
 setTimeout(g,450)};
window.addEventListener("popstate",function(){if(skip>0){skip--;return}var d=hist.pop();if(d&&d.open)UI.close(d)});
$$("dialog").forEach(function(d){
 d.addEventListener("click",function(e){if(e.target===d)UI.close(d)});
 d.addEventListener("cancel",function(e){e.preventDefault();UI.close(d)});
 d.addEventListener("close",function(){d._closing=false;d.classList.remove("closing");
  if(!$("dialog[open]"))document.body.classList.remove("lock");
  var i=hist.indexOf(d);if(i>=0){hist.splice(i,1);back++;clearTimeout(bt);bt=setTimeout(unwind,0)}})});

function countUp(el){var to=+el.dataset.v,t0=performance.now();
 if(!to||matchMedia("(prefers-reduced-motion:reduce)").matches){el.textContent=U.money(to);return}
 (function f(t){var p=Math.min(1,(t-t0)/700);el.textContent=U.money(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)}

UI.show=function(r,v){UI.last=r;UI.v=v;var s=r.st;
 $("#resBody").innerHTML='<div class="stat '+r.s.c+'" aria-live="polite"><span aria-hidden="true">'+r.s.i+"</span> "+r.s.t+"</div>"+
 '<div class="grid"><div class="cell"><small>Legal return deadline</small><b>'+U.date(r.dl)+"</b></div>"+
 '<div class="cell"><small>Amount withheld</small><b class="cu" data-v="'+r.hold+'">$0.00</b></div>'+
 '<div class="cell"><small>Estimated penalty</small><b class="cu" data-v="'+r.pen+'">$0.00</b>'+(r.sc==="pending"?"<small>$0 now, may apply if late</small>":"")+"</div>"+
 '<div class="cell hi"><small>Total potential recovery</small><b class="cu" data-v="'+r.total+'">$0.00</b></div></div>'+
 "<p>"+r.ex+'</p><ul class="notes">'+r.w.map(function(x){return"<li>"+x+"</li>"}).join("")+"</ul>"+
 "<p><b>Statute:</b> "+s.stat+(s.v?' <span class="tag">Please verify this rule</span>':"")+'</p><p class="disc">'+A.DISC+"</p>";
 UI.open($("#resDlg"));$$(".cu",$("#resBody")).forEach(countUp)};

UI.summary=function(){var r=UI.last;return["Security Deposit Return Summary","State: "+r.st.name,"Move-out date: "+U.date(r.m),"Return deadline: "+U.date(r.dl),"Status: "+r.s.t,"Amount withheld: "+U.money(r.hold),"Estimated penalty: "+U.money(r.pen),"Total potential recovery: "+U.money(r.total),"Statute: "+r.st.stat,"",A.DISC].join("\n")};

/* ---------- demand letter ---------- */
UI.letter=function(){var r=UI.last,s=r.st,g=function(i,p){return $("#"+i).value.trim()||"["+p+"]"},
 n=Math.max(1,parseInt($("#l-days").value,10)||10),by=C.addDays(C.today(),n),ll=g("l-ll","LANDLORD / PROPERTY MANAGER NAME");
 return[U.date(C.today()),"",ll,g("l-lla","LANDLORD ADDRESS"),"","Re: Return of security deposit - "+g("l-prop","RENTAL PROPERTY ADDRESS"),"","Dear "+ll+",","",
 "I moved out of the property above on "+U.date(r.m)+". I paid a security deposit of "+U.money(UI.v.dep)+". Under "+s.stat+", it was due back (or an itemized list of deductions was due) by "+U.date(r.dl)+".","",
 "As of today I have not received "+U.money(r.hold)+" of my deposit. I am requesting that amount"+(r.pen?", plus the statutory penalty of "+U.money(r.pen)+" ("+r.pt+") under "+s.stat+", for a total of "+U.money(r.total):"")+".","",
 "Please pay within "+n+" days, by "+U.date(by)+". My forwarding address is: "+g("l-fwd","YOUR NEW ADDRESS")+".","",
 "If I do not receive payment, I may file a claim in small claims court and seek all remedies the law allows. This letter is being sent by certified mail, return receipt requested.","","Sincerely,","",g("l-name","YOUR NAME")].join("\n")};
UI.regen=function(){edited=false;$("#letTa").value=UI.letter();$("#regen").hidden=true};
UI.openLetter=function(){UI.regen();$("#letNote").hidden=UI.last.left<0;UI.open($("#letDlg"))};
$("#letDlg").addEventListener("input",function(e){
 if(e.target.id==="letTa"){edited=true;$("#regen").hidden=false}
 else if(!edited)$("#letTa").value=UI.letter();else $("#regen").hidden=false});

UI.download=function(){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([$("#letTa").value],{type:"text/plain"}));a.download="security-deposit-demand-letter.txt";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)};
UI.print=function(k){document.body.dataset.print=k;if(k==="letter")$("#letPrint").textContent=$("#letTa").value;window.print()};
window.addEventListener("afterprint",function(){delete document.body.dataset.print});

/* ---------- custom date picker (replaces the browser's native date popup) ---------- */
var MN=["January","February","March","April","May","June","July","August","September","October","November","December"];
function p2(n){return(n<10?"0":"")+n}
function iso(d){return d.getFullYear()+"-"+p2(d.getMonth()+1)+"-"+p2(d.getDate())}
function same(a,b){return!!(a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate())}
UI.dateVal=function(el){return el.hasAttribute("data-iso")?el.getAttribute("data-iso"):el.value};
UI.dateSet=function(el,v,silent){
 if(!el.hasAttribute("data-iso"))el.value=v||"";
 else{el.setAttribute("data-iso",v||"");var d=v?C.parse(v):null;el.value=d?d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):""}
 if(!silent){el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}))}};
UI.dates=function(){
 var dlg=$("#dpDlg"),box=$("#dpBox"),ttl=$("#dpTitle"),tt=$("#dpTT"),hd=$("#dpT"),pv=$("#dpPrev"),nx=$("#dpNext"),clr=$("#dpClear"),
  cur=null,view=null,sel=null,mode="days",fd=1,dir=0;
 function render(focus){var y=view.getFullYear(),m=view.getMonth(),h="",t=C.today();
  if(mode==="days"){tt.textContent=MN[m]+" "+y;
   var st=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate();
   for(var i=0;i<st;i++)h+="<span></span>";
   for(var d=1;d<=n;d++){var dt=new Date(y,m,d),tk=same(dt,t);
    h+='<button type="button" class="dp-d'+(tk?" today":"")+'" data-d="'+d+'" tabindex="'+(d===fd?0:-1)+'" aria-pressed="'+same(dt,sel)+'" aria-label="'+dt.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})+(tk?", today":"")+'">'+d+"</button>"}
   box.innerHTML='<div class="dp-wd" aria-hidden="true"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div><div class="dp-days">'+h+"</div>"}
  else{tt.textContent=String(y);
   h=MN.map(function(n,i){return'<button type="button" class="dp-m" data-m="'+i+'" aria-pressed="'+!!(sel&&sel.getFullYear()===y&&sel.getMonth()===i)+'">'+n.slice(0,3)+"</button>"}).join("");
   box.innerHTML='<div class="dp-months">'+h+"</div>"}
  box.style.setProperty("--dx",dir*18+"px");box.classList.remove("dp-in");void box.offsetWidth;box.classList.add("dp-in");
  ttl.setAttribute("aria-expanded",String(mode==="months"));
  pv.setAttribute("aria-label",mode==="days"?"Previous month":"Previous year");nx.setAttribute("aria-label",mode==="days"?"Next month":"Next year");
  if(focus){var b=$('.dp-d[tabindex="0"]',box);if(b)b.focus({preventScroll:true})}}
 function shift(k){dir=k;if(mode==="days"){view=new Date(view.getFullYear(),view.getMonth()+k,1);fd=Math.min(fd,new Date(view.getFullYear(),view.getMonth()+1,0).getDate())}else view=new Date(view.getFullYear()+k,view.getMonth(),1);render()}
 function go(dt){var old=view;view=new Date(dt.getFullYear(),dt.getMonth(),1);fd=dt.getDate();dir=view>old?1:view<old?-1:0;render(true)}
 function pick(dt){UI.dateSet(cur,iso(dt));UI.close(dlg)}
 pv.addEventListener("click",function(){shift(-1)});nx.addEventListener("click",function(){shift(1)});
 ttl.addEventListener("click",function(){mode=mode==="days"?"months":"days";dir=0;render()});
 $("#dpToday").addEventListener("click",function(){pick(C.today())});
 clr.addEventListener("click",function(){UI.dateSet(cur,"");UI.close(dlg)});
 box.addEventListener("click",function(ev){var d=ev.target.closest(".dp-d"),m=ev.target.closest(".dp-m");
  if(d)pick(new Date(view.getFullYear(),view.getMonth(),+d.dataset.d));
  else if(m){view=new Date(view.getFullYear(),+m.dataset.m,1);fd=Math.min(fd,new Date(view.getFullYear(),view.getMonth()+1,0).getDate());mode="days";dir=0;render(true)}});
 box.addEventListener("keydown",function(ev){var b=ev.target.closest(".dp-d");if(!b||mode!=="days")return;var k=ev.key,y=view.getFullYear(),m=view.getMonth(),
  mv={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[k];
  if(mv!==undefined){ev.preventDefault();go(new Date(y,m,fd+mv))}
  else if(k==="PageUp"||k==="PageDown"){ev.preventDefault();go(new Date(y,m+(k==="PageUp"?-1:1)*(ev.shiftKey?12:1),Math.min(fd,28)))}
  else if(k==="Home"||k==="End"){ev.preventDefault();var wd=new Date(y,m,fd).getDay();go(new Date(y,m,fd-wd+(k==="Home"?0:6)))}});
 function open(el){cur=el;sel=C.parse(UI.dateVal(el))||null;var b=sel||C.today();view=new Date(b.getFullYear(),b.getMonth(),1);fd=b.getDate();mode="days";dir=0;
  var l=$('label[for="'+el.id+'"]');hd.textContent=l?l.textContent:"Select date";clr.hidden=!sel;render();UI.open(dlg);
  requestAnimationFrame(function(){var x=$('.dp-d[tabindex="0"]',box);if(x)x.focus({preventScroll:true})})}
 $$("input[type=date]").forEach(function(el){var v=el.value;el.type="text";el.readOnly=true;el.setAttribute("inputmode","none");el.placeholder="Select date";
  el.classList.add("dp");el.setAttribute("aria-haspopup","dialog");el.setAttribute("data-iso","");el.value="";if(v)UI.dateSet(el,v,true);
  el.addEventListener("click",function(){open(el)});
  el.addEventListener("keydown",function(ev){if(ev.key==="Enter"||ev.key===" "||ev.key==="ArrowDown"){ev.preventDefault();open(el)}})})};

/* ---------- "?" info popovers (native popover API: light dismiss + Esc for free) ---------- */
UI.tips=function(){if(!("popover" in HTMLElement.prototype))return;document.documentElement.classList.add("pop-ok");
 $$(".tip").forEach(function(t){
  t.addEventListener("beforetoggle",function(e){if(e.newState!=="open")return;var b=$('[popovertarget="'+t.id+'"]');if(!b)return;
   var r=b.getBoundingClientRect(),W=Math.min(280,innerWidth-24);t.style.left=Math.max(12,Math.min(r.left-12,innerWidth-W-12))+"px";
   if(r.bottom+8+130>innerHeight&&r.top>150){t.style.top="auto";t.style.bottom=(innerHeight-r.top+8)+"px";t.classList.add("up")}
   else{t.style.bottom="auto";t.style.top=(r.bottom+8)+"px";t.classList.remove("up")}});
  t.addEventListener("toggle",function(e){var b=$('[popovertarget="'+t.id+'"]');if(b)b.setAttribute("aria-expanded",String(e.newState==="open"));
   if(e.newState==="open"){var y0=scrollY;setTimeout(function(){addEventListener("scroll",function h(){if(Math.abs(scrollY-y0)>12||!t.matches(":popover-open")){removeEventListener("scroll",h);if(t.matches(":popover-open"))t.hidePopover()}},{passive:true})},250)}})})};
})();
