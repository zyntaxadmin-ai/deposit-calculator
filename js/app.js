(function(){var A=window.DepositApp,U=A.utils,UI=A.ui,C=A.calc,$=U.$,$$=U.$$;
document.documentElement.classList.add("js");
var f=$("#f"),manual=false,ORDER=["state","move","dep","retDate","retAmt","hold"],F=function(n){return U.num($("#"+n).value)};
$$(".seg").forEach(UI.seg);$$(".cur").forEach(UI.cur);
var DLG=!!(window.HTMLDialogElement&&HTMLDialogElement.prototype.showModal),combo;
try{if(!DLG)throw 0;combo=UI.combo()}catch(e){combo=UI.comboNative()}
if(DLG)UI.dates();UI.tips();
var D=function(id){return UI.dateVal($("#"+id))};

function auto(){var r=UI.val("ret"),d=F("dep");return r==="full"?0:r==="no"?d:Math.max(0,d-F("retAmt"))}
function ring(){var r=UI.val("ret"),need=[!!combo.get(),!!D("move"),F("dep")>0];
 if(r!=="no")need.push(!!D("retDate"),F("retAmt")>0);
 var n=need.filter(Boolean).length,t=need.length,p=Math.round(n/t*100),el=$("#ring");
 $("#ringP").style.strokeDashoffset=100-p;$("#ringP").style.opacity=p?1:0;$("#ringT").textContent=n===t?"\u2713":n+"/"+t;
 el.classList.toggle("done",n===t);el.setAttribute("aria-label","Form "+p+"% complete ("+n+" of "+t+" required fields)")}
function sync(){UI.cond($("#retBox"),UI.val("ret")!=="no");$("#holdReset").hidden=!manual;if(!manual)$("#hold").value=F("dep")?U.fmt(auto()):"";ring()}
function vals(){return{state:combo.get(),move:D("move"),dep:F("dep"),ret:UI.val("ret"),retDate:D("retDate"),retAmt:F("retAmt"),hold:$("#hold").value===""?auto():F("hold"),fwd:UI.val("fwd"),item:UI.val("item")}}

function err(e){ORDER.forEach(function(k){var el=$("#"+k);$("#e-"+k).textContent=e[k]||"";e[k]?el.setAttribute("aria-invalid","true"):el.removeAttribute("aria-invalid")});
 var ks=ORDER.filter(function(k){return e[k]}),s=$("#errSum");s.hidden=!ks.length;s.textContent=ks.length?"Please fix "+ks.length+" item"+(ks.length>1?"s":"")+" below.":"";
 if(ks.length){var el=$("#"+ks[0]);el.scrollIntoView({block:"center",behavior:"smooth"});el.focus({preventScroll:true})}return ks.length}

f.addEventListener("input",function(ev){var id=ev.target.id;
 if(id==="hold")manual=true;else if(id==="dep"&&UI.val("ret")==="full")$("#retAmt").value=U.fmt(F("dep"));
 if(id&&$("#e-"+id)){ev.target.removeAttribute("aria-invalid");$("#e-"+id).textContent=""}sync()});
f.addEventListener("change",function(ev){if(ev.target.name==="ret"&&UI.val("ret")==="full"&&F("dep"))$("#retAmt").value=U.fmt(F("dep"));
 if(ev.target.id==="move"){var m=C.parse(UI.dateVal(ev.target));$("#w-move").textContent=m&&m>C.today()?"This date is in the future, so the deadline hasn't started yet.":""}sync()});
f.addEventListener("submit",function(ev){ev.preventDefault();var v=vals();if(err(C.validate(v)))return;UI.show(C.compute(v),v)});

function snap(){return{state:combo.get(),move:D("move"),dep:$("#dep").value,ret:UI.val("ret"),retDate:D("retDate"),retAmt:$("#retAmt").value,hold:$("#hold").value,manual:manual,fwd:UI.val("fwd"),item:UI.val("item")}}
function blank(){f.reset();manual=false;$$(".seg").forEach(UI.segSync);combo.clear();UI.dateSet($("#move"),"",true);UI.dateSet($("#retDate"),"",true);err({});$("#w-move").textContent=""}
function restore(s){blank();
 [["ret",s.ret],["fwd",s.fwd],["item",s.item]].forEach(function(x){var r=$('input[name="'+x[0]+'"][value="'+x[1]+'"]');if(r)r.checked=true});$$(".seg").forEach(UI.segSync);
 $("#dep").value=s.dep;$("#retAmt").value=s.retAmt;
 UI.dateSet($("#move"),s.move);UI.dateSet($("#retDate"),s.retDate);
 if(s.state)combo.set(s.state);
 manual=s.manual;$("#hold").value=s.hold;sync()}
$("#resetBtn").addEventListener("click",function(){var s=snap(),dirty=!!(s.state||s.move||s.dep||s.retDate||s.retAmt||s.manual||s.ret!=="no"||s.fwd!=="yes"||s.item!=="no");
 blank();$$("dialog[open]").forEach(function(d){UI.close(d)});sync();$("#calculator").scrollIntoView({behavior:"smooth"});
 if(dirty)UI.toast("Form cleared","Undo",function(){restore(s);UI.toast("Answers restored")});else UI.toast("Form cleared")});

var ACT={
 close:function(b){UI.close(b.closest("dialog"))},
 copy:function(){U.copy(UI.summary()).then(function(){UI.toast("Summary copied")},function(){UI.toast("Couldn't copy. Select the text and copy it manually.")})},
 print:function(){UI.print("result")},letter:UI.openLetter,regen:UI.regen,
 edit:function(){UI.close($("#resDlg"));$("#calculator").scrollIntoView({behavior:"smooth"})},
 autoHold:function(){manual=false;sync()},
 copyL:function(){U.copy($("#letTa").value).then(function(){UI.toast("Letter copied")},function(){UI.toast("Couldn't copy. Select the text and copy it manually.")})},
 dlL:UI.download,printL:function(){UI.print("letter")}};
document.addEventListener("click",function(ev){var b=ev.target.closest("[data-act]");if(b&&ACT[b.dataset.act])ACT[b.dataset.act](b)});

/* keep the status live after midnight / tab restore */
document.addEventListener("visibilitychange",function(){if(!document.hidden&&$("#resDlg").open&&UI.v)UI.show(C.compute(UI.v),UI.v)});

/* FAQ accordion (one open at a time) */
document.addEventListener("click",function(ev){var q=ev.target.closest(".faq button");if(!q)return;var it=q.parentNode.parentNode,o=it.classList.contains("open");
 $$(".faq.open").forEach(function(x){x.classList.remove("open");$("button",x).setAttribute("aria-expanded","false")});
 if(!o){it.classList.add("open");q.setAttribute("aria-expanded","true")}});
document.addEventListener("keydown",function(ev){var q=ev.target.closest&&ev.target.closest(".faq button");if(!q||(ev.key!=="ArrowDown"&&ev.key!=="ArrowUp"))return;ev.preventDefault();
 var b=$$(".faq button"),i=b.indexOf(q);b[(i+(ev.key==="ArrowDown"?1:b.length-1))%b.length].focus()});

/* checklist progress */
$("#chk").addEventListener("change",function(){var n=$$("input:checked",this).length,t=$$("input",this).length;$("#barI").style.transform="scaleX("+n/t+")";$("#barT").textContent=n+" of "+t+" done"});

/* scroll reveal + active nav link (IntersectionObserver, no scroll listeners) */
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}})},{threshold:.1});
$$(".rv").forEach(function(el){io.observe(el)});
var links=$$(".nav nav a"),so=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting)links.forEach(function(a){a.classList.toggle("on",a.getAttribute("href")==="#"+x.target.id)})})},{rootMargin:"-45% 0px -50% 0px"});
["calculator","how","faq"].forEach(function(id){so.observe(document.getElementById(id))});

/* guide pages link here with ?state=XX to preselect the state */
try{var qs=new URLSearchParams(location.search).get("state");if(qs&&/^[A-Za-z]{2}$/.test(qs))combo.set(qs.toUpperCase())}catch(e){}

/* hamburger menu (phones) */
var hd=$("#nav"),bg=$("#burger");
function menu(on){hd.classList.toggle("open",on);bg.setAttribute("aria-expanded",String(on));bg.setAttribute("aria-label",on?"Close menu":"Open menu")}
bg.addEventListener("click",function(){menu(!hd.classList.contains("open"))});
$$("#mainNav a").forEach(function(a){a.addEventListener("click",function(){menu(false)})});
document.addEventListener("pointerdown",function(ev){if(hd.classList.contains("open")&&!hd.contains(ev.target))menu(false)});
document.addEventListener("keydown",function(ev){if(ev.key==="Escape"&&hd.classList.contains("open")){menu(false);bg.focus()}});
matchMedia("(min-width:561px)").addEventListener("change",function(m){if(m.matches)menu(false)});

/* scroll-to-top button: shown once the hero has scrolled out of view */
var tt=$("#toTop");
new IntersectionObserver(function(en){tt.classList.toggle("show",!en[0].isIntersecting)}).observe($(".hero"));
tt.addEventListener("click",function(){scrollTo({top:0,behavior:"smooth"})});

sync();
})();
