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
 function pick(c){val=c;inp.value=S[c].name;all.forEach(function(e){e.setAttribute("aria-selected",String(e.dataset.c===c))});x.hidden=false;hide();inp.removeAttribute("aria-invalid");$("#e-state").textContent=""}
 function open(){filter(val?"":inp.value);show();hl(val?li[val]:vis()[0])}
 inp.addEventListener("focus",open);inp.addEventListener("click",function(){if(ul.hidden)open()});
 inp.addEventListener("input",function(){val="";x.hidden=!inp.value;filter(inp.value);show();hl(vis()[0])});
 inp.addEventListener("keydown",function(ev){var k=ev.key,v=vis(),i=v.indexOf(cur);
  if(k==="ArrowDown"||k==="ArrowUp"){ev.preventDefault();if(ul.hidden)show();if(v.length)hl(v[k==="ArrowDown"?Math.min(i+1,v.length-1):Math.max(i-1,0)])}
  else if((k==="Home"||k==="End")&&!ul.hidden&&!inp.value){ev.preventDefault();hl(v[k==="Home"?0:v.length-1])}
  else if(k==="Enter"&&!ul.hidden&&cur){ev.preventDefault();pick(cur.dataset.c)}
  else if(k==="Escape"&&!ul.hidden){ev.preventDefault();hide()}
  else if(k==="Tab"&&!ul.hidden){if(!val&&cur&&inp.value)pick(cur.dataset.c);hide()}});
 ul.addEventListener("pointerdown",function(ev){ev.preventDefault()});
 ul.addEventListener("click",function(ev){var e=ev.target.closest("li[data-c]");if(e)pick(e.dataset.c)});
 document.addEventListener("pointerdown",function(ev){if(!ul.hidden&&!$("#combo").contains(ev.target))hide()});
 x.addEventListener("click",function(){api.clear();inp.focus()});
 var api={get:function(){return val},clear:function(){val="";inp.value="";x.hidden=true;all.forEach(function(e){e.setAttribute("aria-selected","false")});filter("");hide()}};
 return api};

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

/* ---------- dialogs (native <dialog>: focus trap, inert background, Esc, focus return) ---------- */
function openDlg(d){if(!d.open){d.showModal();document.body.classList.add("lock")}}
$$("dialog").forEach(function(d){
 d.addEventListener("click",function(e){if(e.target===d)d.close()});
 d.addEventListener("close",function(){if(!$("dialog[open]"))document.body.classList.remove("lock")})});

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
 openDlg($("#resDlg"));$$(".cu",$("#resBody")).forEach(countUp)};

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
UI.openLetter=function(){UI.regen();$("#letNote").hidden=UI.last.left<0;openDlg($("#letDlg"))};
$("#letDlg").addEventListener("input",function(e){
 if(e.target.id==="letTa"){edited=true;$("#regen").hidden=false}
 else if(!edited)$("#letTa").value=UI.letter();else $("#regen").hidden=false});

UI.download=function(){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([$("#letTa").value],{type:"text/plain"}));a.download="security-deposit-demand-letter.txt";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)};
UI.print=function(k){document.body.dataset.print=k;if(k==="letter")$("#letPrint").textContent=$("#letTa").value;window.print()};
window.addEventListener("afterprint",function(){delete document.body.dataset.print});
})();
