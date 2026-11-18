/* STATE DATA - edit here.
   Row: [code, name, days, mult, fixed, statute, verify(1/0), flags, note]
   days  = return deadline (calendar days, or business days if flags has "b")
   mult  = extra damages as a multiple of the wrongfully withheld amount (0 = none)
   fixed = fixed statutory penalty in USD (0 = none)
   flags = f: forwarding address matters | l: late landlord may lose right to deduct | b: business days
   verify = 1 shows a "Please verify this rule" tag */
(function(){var A=window.DepositApp=window.DepositApp||{};
var ROWS=[
["AL","Alabama",60,2,0,"Ala. Code § 35-9A-201",0,"f","Give a forwarding address; the landlord then has 60 days."],
["AK","Alaska",14,2,0,"Alaska Stat. § 34.03.070",0,"","14 days if you gave proper notice; 30 days if not."],
["AZ","Arizona",14,2,0,"Ariz. Rev. Stat. § 33-1321",0,"b","Deadline counts business days (weekends excluded)."],
["AR","Arkansas",60,2,0,"Ark. Code § 18-16-305",1,"f","Written forwarding address needed."],
["CA","California",21,2,0,"Cal. Civ. Code § 1950.5",0,"l","Up to 2× the deposit for bad faith. Repair deductions over $125 need receipts."],
["CO","Colorado",30,3,0,"Colo. Rev. Stat. § 38-12-103",0,"l","A lease can set up to 60 days. 3× applies to willful withholding."],
["CT","Connecticut",21,2,0,"Conn. Gen. Stat. § 47a-21",1,"f","Due 21 days after move-out or 15 days after you give a forwarding address, whichever is later."],
["DE","Delaware",20,2,0,"25 Del. C. § 5514",0,"f","Written forwarding address needed."],
["DC","District of Columbia",45,3,0,"D.C. Mun. Regs. tit. 14, § 308",1,"l","Landlord must itemize deductions within 45 days."],
["FL","Florida",15,0,0,"Fla. Stat. § 83.49",0,"l","15 days if no claim; 30 days to send a notice of claim. A late landlord generally loses the right to claim; fees may be awarded."],
["GA","Georgia",30,3,0,"O.C.G.A. § 44-7-34",1,"f","Up to 3× for willful violations."],
["HI","Hawaii",14,0,0,"Haw. Rev. Stat. § 521-44",1,"","Written statement of deductions required."],
["ID","Idaho",21,3,0,"Idaho Code § 6-321",1,"","Up to 30 days if the lease says so."],
["IL","Illinois",45,2,0,"765 ILCS 710/1",1,"","Itemized list due in 30 days; refund in 45. 5+ unit buildings: 2× and interest."],
["IN","Indiana",45,0,0,"Ind. Code § 32-31-3-12",0,"fl","Missing 45 days can cost the landlord the right to keep deductions; fees may apply."],
["IA","Iowa",30,2,0,"Iowa Code § 562A.12",0,"f","30 days after you give a forwarding address; bad faith: up to 2×."],
["KS","Kansas",30,1.5,0,"Kan. Stat. § 58-2550",0,"","Up to 1.5× the amount wrongfully withheld."],
["KY","Kentucky",30,0,0,"Ky. Rev. Stat. § 383.580",1,"","30 days if no claim; up to 60 if deductions."],
["LA","Louisiana",30,0,200,"La. R.S. § 9:3251",1,"","About 1 month; $200 plus fees if no response to a written demand."],
["ME","Maine",30,2,0,"14 M.R.S. § 6033",0,"","30 days with a written lease; 21 days for tenancy at will."],
["MD","Maryland",45,3,0,"Md. Code, Real Prop. § 8-203",0,"fl","3× for bad faith; written forwarding address needed."],
["MA","Massachusetts",30,3,0,"M.G.L. c. 186, § 15B",0,"l","3× plus interest and fees; a landlord who misses it may forfeit deductions."],
["MI","Michigan",30,2,0,"Mich. Comp. Laws § 554.609",1,"fl","Give a forwarding address within 4 days of move-out. Missing the deadline can forfeit deductions."],
["MN","Minnesota",21,0,500,"Minn. Stat. § 504B.178",0,"f","Bad faith: $500 punitive damages. Interest is owed on deposits."],
["MS","Mississippi",45,0,0,"Miss. Code § 89-8-21",1,"f","Landlord must itemize deductions."],
["MO","Missouri",30,2,0,"Mo. Rev. Stat. § 535.300",0,"","2× applies to bad-faith withholding."],
["MT","Montana",30,0,0,"Mont. Code § 70-25-201",1,"","10 days if no deductions; 30 days with deductions."],
["NE","Nebraska",14,0,0,"Neb. Rev. Stat. § 76-1416",1,"","A late landlord may owe the deposit plus attorney's fees."],
["NV","Nevada",30,0,1000,"Nev. Rev. Stat. § 118A.242",1,"","Up to $1,000 penalty for bad faith."],
["NH","New Hampshire",30,2,0,"N.H. RSA 540-A:7",1,"","2× the deposit (or $100, whichever is greater)."],
["NJ","New Jersey",30,2,0,"N.J. Stat. § 46:8-21.1",0,"","30 days (5 days after fire, flood, or condemnation). 2× plus costs."],
["NM","New Mexico",30,0,0,"N.M. Stat. § 47-8-18",1,"l","A late landlord may lose the right to deduct; fees may apply."],
["NY","New York",14,2,0,"N.Y. Gen. Oblig. Law § 7-108",0,"l","A late landlord forfeits the right to keep any of the deposit; willful: up to 2×."],
["NC","North Carolina",30,0,0,"N.C. Gen. Stat. § 42-52",1,"","30 days; up to 60 if the claim amount isn't known yet."],
["ND","North Dakota",30,3,0,"N.D. Cent. Code § 47-16-07.1",0,"f","Up to 3× for bad faith."],
["OH","Ohio",30,1,0,"Ohio Rev. Code § 5321.16",0,"f","Forwarding address needed. Damages equal the withheld amount, plus fees."],
["OK","Oklahoma",45,2,0,"Okla. Stat. tit. 41, § 115",1,"f","A written demand may be required for damages."],
["OR","Oregon",31,2,0,"Or. Rev. Stat. § 90.300",0,"","31 days; 2× the amount wrongfully withheld."],
["PA","Pennsylvania",30,2,0,"68 P.S. § 250.512",0,"fl","Written forwarding address needed. Missing the deadline forfeits deductions."],
["RI","Rhode Island",20,2,0,"R.I. Gen. Laws § 34-18-35",0,"f","Written forwarding address needed."],
["SC","South Carolina",30,3,0,"S.C. Code § 27-40-410",0,"f","3× the amount wrongfully withheld, plus fees."],
["SD","South Dakota",14,0,0,"S.D. Codified Laws § 43-32-24",1,"","14 days to return, or 45 days to send an itemized list."],
["TN","Tennessee",30,0,0,"Tenn. Code § 66-28-301",1,"","Landlord must itemize deductions."],
["TX","Texas",30,3,100,"Tex. Prop. Code §§ 92.103, 92.109",0,"fl","Bad faith: $100 + 3× withheld + fees. Forwarding address needed."],
["UT","Utah",30,0,100,"Utah Code § 57-17-3",1,"","A fixed $100 penalty may apply if late."],
["VT","Vermont",14,2,0,"9 V.S.A. § 4461",0,"l","A late landlord forfeits the right to withhold; willful: 2×."],
["VA","Virginia",45,0,0,"Va. Code § 55.1-1226",1,"","Itemized list due within 45 days."],
["WA","Washington",21,2,0,"Wash. Rev. Code § 59.18.280",0,"fl","Written forwarding address needed. A late landlord may lose the right to withhold."],
["WV","West Virginia",60,2,0,"W. Va. Code § 37-6A-2",1,"","60 days, or 45 days after a new tenant moves in, whichever is first."],
["WI","Wisconsin",21,2,0,"Wis. Admin. Code ATCP § 134.06",0,"","Wrongful withholding can mean 2× plus fees (Wis. Stat. § 100.20)."],
["WY","Wyoming",30,0,0,"Wyo. Stat. § 1-21-1208",1,"f","30 days, or 60 days if damages are claimed."]];
A.states={};
ROWS.forEach(function(r){A.states[r[0]]={name:r[1],days:r[2],m:r[3],x:r[4],stat:r[5],v:!!r[6],f:r[7].indexOf("f")>-1,l:r[7].indexOf("l")>-1,b:r[7].indexOf("b")>-1,n:r[8]}});
A.DISC="This tool provides general information and estimates only, not legal advice. Laws change and have exceptions. Verify with your state's official statutes or a licensed attorney.";
})();
