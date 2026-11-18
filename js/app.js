(function(){var A=window.DepositApp,U=A.utils,UI=A.ui,C=A.calc,$=U.$,$$=U.$$;
document.documentElement.classList.add("js");
var f=$("#f"),manual=false,ORDER=["state","move","dep","retDate","retAmt","hold"],F=function(n){return U.num($("#"+n).value)};
$$(".seg").forEach(UI.seg);$$(".cur").forEach(UI.cur);
var combo=UI.combo();

function auto(){var r=UI.val("ret"),d=F("dep");return r==="full"?0:r==="no"?d:Math.max(0,d-F("retAmt"))}
function sync(){UI.cond($("#retBox"),UI.val("ret")!=="no");$("#holdReset").hidden=!manual;if(!manual)$("#hold").value=F("dep")?U.fmt(auto()):""}
function vals(){return{state:combo.get(),move:$("#move").value,dep:F("dep"),ret:UI.val("ret"),retDate:$("#retDate").value,retAmt:F("retAmt"),hold:$("#hold").value===""?auto():F("hold"),fwd:UI.val("fwd"),item:UI.val("item")}}

function err(e){ORDER.forEach(function(k){var el=$("#"+k);$("#e-"+k).textContent=e[k]||"";e[k]?el.setAttribute("aria-invalid","true"):el.removeAttribute("aria-invalid")});
 var ks=ORDER.filter(function(k){return e[k]}),s=$("#errSum");s.hidden=!ks.length;s.textContent=ks.length?"Please fix "+ks.length+" item"+(ks.length>1?"s":"")+" below.":"";
 if(ks.length){var el=$("#"+ks[0]);el.scrollIntoView({block:"center",behavior:"smooth"});el.focus({preventScroll:true})}return ks.length}

f.addEventListener("input",function(ev){var id=ev.target.id;
 if(id==="hold")manual=true;else if(id==="dep"&&UI.val("ret")==="full")$("#retAmt").value=U.fmt(F("dep"));
 if(id&&$("#e-"+id)){ev.target.removeAttribute("aria-invalid");$("#e-"+id).textContent=""}sync()});
f.addEventListener("change",function(ev){if(ev.target.name==="ret"&&UI.val("ret")==="full"&&F("dep"))$("#retAmt").value=U.fmt(F("dep"));
 if(ev.target.id==="move"){var m=C.parse(ev.target.value);$("#w-move").textContent=m&&m>C.today()?"This date is in the future, so the deadline hasn't started yet.":""}sync()});
f.addEventListener("submit",function(ev){ev.preventDefault();var v=vals();if(err(C.validate(v)))return;UI.show(C.compute(v),v)});

$("#resetBtn").addEventListener("click",function(){f.reset();manual=false;$$(".seg").forEach(UI.segSync);combo.clear();err({});$("#w-move").textContent="";
 $$("dialog[open]").forEach(function(d){d.close()});sync();$("#calculator").scrollIntoView({behavior:"smooth"});UI.toast("Form cleared")});

var ACT={
 close:function(b){b.closest("dialog").close()},
 copy:function(){U.copy(UI.summary()).then(function(){UI.toast("Summary copied")},function(){UI.toast("Couldn't copy. Select the text and copy it manually.")})},
 print:function(){UI.print("result")},letter:UI.openLetter,regen:UI.regen,
 edit:function(){$("#resDlg").close();$("#calculator").scrollIntoView({behavior:"smooth"})},
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

sync();
})();
