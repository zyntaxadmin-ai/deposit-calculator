(function(){var A=window.DepositApp=window.DepositApp||{},U=A.utils,C=A.calc={};
function d(n){return n+" day"+(n===1?"":"s")}
/* Dates are parsed from yyyy-mm-dd as local calendar dates (no timezone shifts). */
C.parse=function(s){var p=(s||"").split("-");if(p.length!==3)return null;var x=new Date(+p[0],p[1]-1,+p[2]);return isNaN(x)?null:x};
C.today=function(){var n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate())};
C.diff=function(a,b){return Math.round((b-a)/864e5)};
C.addDays=function(x,n,bus){var r=new Date(x.getFullYear(),x.getMonth(),x.getDate());
 if(!bus){r.setDate(r.getDate()+n);return r}
 while(n>0){r.setDate(r.getDate()+1);var w=r.getDay();if(w>0&&w<6)n--}return r};

C.validate=function(v){var e={},m=C.parse(v.move);
 if(!v.state)e.state="Please choose your state.";
 if(!m)e.move="Enter your move-out date.";
 if(!(v.dep>0))e.dep="Enter your deposit amount (more than $0).";
 if(v.ret!=="no"){var r=C.parse(v.retDate);
  if(!r)e.retDate="Enter the date the deposit was returned.";
  else if(m&&r<m)e.retDate="This must be on or after your move-out date.";
  if(!(v.retAmt>0))e.retAmt="Enter the amount returned.";
  else if(v.retAmt>v.dep)e.retAmt="That's more than your deposit.";
  else if(v.ret==="part"&&v.retAmt>=v.dep)e.retAmt="For a partial return, enter less than the full deposit."}
 if(v.hold>v.dep)e.hold="The withheld amount can't be more than the deposit.";
 return e};

C.compute=function(v){
 var st=A.states[v.state],m=C.parse(v.move),t=C.today(),dl=C.addDays(m,st.days,st.b),left=C.diff(t,dl),
  rd=v.ret==="no"?null:C.parse(v.retDate),late=rd?C.diff(dl,rd):0,
  hold=v.ret==="full"?0:v.hold,due=rd?late>0:left<0,
  pen=hold>0&&due?hold*st.m+st.x:0,
  pt=[st.m?"up to "+st.m+"× the withheld amount":"",st.x?"$"+st.x+" fixed penalty":""].filter(Boolean).join(" plus ")||"no fixed statutory penalty (you can still ask for the deposit back, and possibly court costs)",
  sc,s,tail;
 if(v.ret==="full"){sc=late>0?"latefull":"ontime";s=late>0?{t:"Returned "+d(late)+" late",c:"bad",i:"!"}:{t:"Returned on time",c:"ok",i:"✓"}}
 else if(rd){sc=late>0?"partlate":"part";s=late>0?{t:"Part returned "+d(late)+" late",c:"bad",i:"!"}:{t:"Part returned on time",c:"ok",i:"✓"}}
 else if(left>0){sc="pending";s={t:d(left)+" remaining",c:left<=7?"warn":"ok",i:"⏳"}}
 else if(left===0){sc="pending";s={t:"Deadline is today",c:"warn",i:"⏳"}}
 else{sc="overdue";s={t:"Overdue by "+d(-left),c:"bad",i:"!"}}
 tail={
  ontime:"Your deposit was returned in full on time, so no claim is likely.",
  latefull:"Your deposit came back in full but "+d(late)+" late. Penalties usually apply to money still withheld, so the estimate is $0, though some courts award interest or damages for late returns.",
  part:"Part of your deposit was returned on time. The landlord may keep money for valid deductions, so the penalty shows $0 unless the deductions were improper (withheld: "+U.money(hold)+").",
  partlate:"Part of your deposit was returned late. The penalty is based only on the withheld part ("+U.money(hold)+"): "+pt+". Estimated penalty: "+U.money(pen)+".",
  pending:"The deadline is "+(left?d(left)+" away":"today")+". If the landlord still holds "+U.money(hold)+" after that, a penalty ("+pt+") could apply, up to "+U.money(hold*st.m+st.x)+".",
  overdue:"The deadline passed "+d(-left)+" ago and "+U.money(hold)+" is still unpaid. Penalty rule: "+pt+". Estimated penalty: "+U.money(pen)+". Total = withheld + penalty."}[sc];
 var w=[];
 if(m>t)w.push("Your move-out date is in the future, so the deadline hasn't started yet.");
 if(v.fwd!=="yes")w.push("<b>Forwarding address:</b> in many states the deadline or penalty depends on you giving the landlord a forwarding address in writing."+(st.f?" "+st.name+" is one of them.":"")+" Send it now if you haven't.");
 if(v.item==="no"&&v.ret!=="full")w.push("<b>No itemized list:</b> in many states this weakens the landlord's right to keep deductions."+(st.l?" In "+st.name+", a landlord who misses the rules may lose that right.":""));
 if(st.n)w.push(st.n);
 w.push("If the deadline lands on a weekend or holiday, some states extend it.");
 return{st:st,m:m,dl:dl,left:left,sc:sc,s:s,hold:hold,pen:pen,pt:pt,total:hold+pen,w:w,
  ex:st.name+" gives landlords "+st.days+(st.b?" business":"")+" days after move-out, so your deadline is "+U.date(dl)+". "+tail+" This is an upper-end estimate; courts decide actual awards."}};
})();
