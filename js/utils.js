(function(){var A=window.DepositApp=window.DepositApp||{},U=A.utils={};
U.$=function(s,r){return(r||document).querySelector(s)};
U.$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
U.fmt=function(n){return(+n||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})};
U.money=function(n){return"$"+U.fmt(n)};
U.num=function(s){var n=parseFloat(String(s||"").replace(/[^0-9.]/g,""));return isNaN(n)?0:n};
U.date=function(d){return d.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})};
U.copy=function(t){return new Promise(function(ok,no){
 function fb(){var a=document.createElement("textarea");a.value=t;a.setAttribute("readonly","");a.style.cssText="position:fixed;top:0;opacity:0";document.body.appendChild(a);a.select();var r=false;try{r=document.execCommand("copy")}catch(e){}a.remove();r?ok():no()}
 if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(ok,fb);else fb()})};
})();
