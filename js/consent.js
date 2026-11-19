/* Cookie consent. Google Analytics / AdSense are NOT loaded until the visitor accepts.
   To switch them on later, put your IDs below (leave "" to keep them off):
     GA_ID  = GA4 measurement ID, like "G-XXXXXXXXXX"
     ADS_ID = AdSense publisher ID, like "ca-pub-1234567890123456" */
(function(){
var GA_ID="",ADS_ID="ca-pub-9893214086578384",KEY="dd-consent";
function get(){try{return localStorage.getItem(KEY)}catch(e){return null}}
function set(v){try{localStorage.setItem(KEY,v)}catch(e){}}
var loaded=false;
function load(){if(loaded)return;loaded=true;
 if(GA_ID){var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(GA_ID);document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config",GA_ID,{anonymize_ip:true})}
 if(ADS_ID){var a=document.createElement("script");a.async=true;a.crossOrigin="anonymous";a.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+encodeURIComponent(ADS_ID);document.head.appendChild(a)}}
var box=null;
function hide(){if(!box)return;var b=box;box=null;b.classList.add("out");setTimeout(function(){b.remove()},300)}
function show(){if(box)return;
 box=document.createElement("div");box.className="cb";box.setAttribute("role","region");box.setAttribute("aria-label","Cookie consent");
 box.innerHTML='<p><strong>Cookies</strong><br>We use cookies for analytics and to show ads (Google Analytics and Google AdSense). They stay off unless you accept. <a href="/privacy">Privacy Policy</a> &middot; <a href="/cookies">Cookie Policy</a></p><div class="cb-a"><button type="button" class="btn sec" data-c="denied">Reject</button><button type="button" class="btn" data-c="granted">Accept</button></div>';
 box.addEventListener("click",function(e){var b=e.target.closest("[data-c]");if(!b)return;var prev=get(),v=b.dataset.c;set(v);hide();
  if(v==="granted")load();else if(prev==="granted")location.reload()});
 document.body.appendChild(box)}
document.addEventListener("click",function(e){var a=e.target.closest("[data-cookie-settings]");if(a){e.preventDefault();show()}});
var c=get();if(c==="granted")load();else if(c===null)show();
})();
