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
["AR","Arkansas",60,2,0,"Ark. Code §§ 18-16-305, 18-16-306",0,"","60 days after the tenancy ends. A landlord who wrongfully withholds may owe up to 2× the amount withheld, plus court costs and attorney fees."],
["CA","California",21,2,0,"Cal. Civ. Code § 1950.5",0,"l","Up to 2× the deposit for bad faith. Repair deductions over $125 need receipts."],
["CO","Colorado",30,3,0,"Colo. Rev. Stat. § 38-12-103",0,"l","A lease can set up to 60 days. 3× applies to willful withholding."],
["CT","Connecticut",21,2,0,"Conn. Gen. Stat. § 47a-21(d)(2)",0,"f","Due 21 days after the tenancy ends or 15 days after you give a written forwarding address, whichever is later. Up to 2× the deposit if wrongfully withheld."],
["DE","Delaware",20,2,0,"25 Del. C. § 5514",0,"f","Written forwarding address needed."],
["DC","District of Columbia",45,3,0,"D.C. Mun. Regs. tit. 14, § 309; D.C. Code § 42-3502.17",1,"l","Return the deposit or send written notice of deductions within 45 days; any balance and itemized statement are due within 30 days after that notice. Up to 3× for bad faith."],
["FL","Florida",15,0,0,"Fla. Stat. § 83.49",0,"l","15 days if no claim; 30 days to send a notice of claim. A late landlord generally loses the right to claim; fees may be awarded."],
["GA","Georgia",30,3,0,"O.C.G.A. §§ 44-7-34, 44-7-35",0,"l","30 days after the landlord regains possession. Wrongful withholding can cost up to 3× the amount withheld plus attorney fees; missing the required lists forfeits the right to deduct."],
["HI","Hawaii",14,3,0,"Haw. Rev. Stat. § 521-44",0,"l","14 days after the rental agreement ends. A landlord who misses the notice cannot keep any of the deposit; willful wrongful retention can mean up to 3× the deposit plus costs."],
["ID","Idaho",21,0,0,"Idaho Code § 6-321",1,"","21 days, or up to 30 if the rental agreement sets a time. A signed itemized statement must come with any partial refund. Penalties for malicious or intentional violations are discretionary."],
["IL","Illinois",45,2,0,"765 ILCS 710/1",0,"","Buildings with 5+ units: itemized list within 30 days and refund within 45. A court may award 2× the deposit due plus fees for refusal or bad faith. Interest rules are separate (765 ILCS 715)."],
["IN","Indiana",45,0,0,"Ind. Code § 32-31-3-12",0,"fl","Missing 45 days can cost the landlord the right to keep deductions; fees may apply."],
["IA","Iowa",30,2,0,"Iowa Code § 562A.12",0,"f","30 days after you give a forwarding address; bad faith: up to 2×."],
["KS","Kansas",30,1.5,0,"Kan. Stat. § 58-2550",0,"","Up to 1.5× the amount wrongfully withheld."],
["KY","Kentucky",30,0,0,"Ky. Rev. Stat. § 383.580",1,"l","The statute sets no fixed return deadline, so 30 days here is only a placeholder. A landlord who skips the written damage listing may forfeit the right to keep any deposit. Applies only in localities that adopted the state landlord-tenant act."],
["LA","Louisiana",30,2,0,"La. R.S. §§ 9:3251, 9:3252",1,"f","Within one month after the lease ends. Willful failure can cost the deposit plus the greater of $300 or 2× the amount wrongfully withheld."],
["ME","Maine",30,2,0,"14 M.R.S. § 6033",0,"","30 days with a written lease; 21 days for tenancy at will."],
["MD","Maryland",45,3,0,"Md. Code, Real Prop. § 8-203",0,"fl","3× for bad faith; written forwarding address needed."],
["MA","Massachusetts",30,3,0,"M.G.L. c. 186, § 15B",0,"l","3× plus interest and fees; a landlord who misses it may forfeit deductions."],
["MI","Michigan",30,2,0,"Mich. Comp. Laws §§ 554.603, 554.609, 554.613",0,"fl","Give a written forwarding address within 4 days of move-out. The landlord must mail an itemized damage notice within 30 days or loses the right to claim damages; up to 2× the deposit retained."],
["MN","Minnesota",21,0,500,"Minn. Stat. § 504B.178",0,"f","Bad faith: $500 punitive damages. Interest is owed on deposits."],
["MS","Mississippi",45,0,0,"Miss. Code § 89-8-21",1,"f","The landlord must itemize deductions in writing within 45 days. Bad-faith retention can mean actual damages plus up to $200."],
["MO","Missouri",30,2,0,"Mo. Rev. Stat. § 535.300",0,"","2× applies to bad-faith withholding."],
["MT","Montana",30,0,0,"Mont. Code §§ 70-25-201, 70-25-202, 70-25-204",0,"l","30 days with deductions; 10 days if there are no deductions. A landlord who skips the written list forfeits the right to withhold for damages or cleaning. Fees may be awarded."],
["NE","Nebraska",14,2,0,"Neb. Rev. Stat. § 76-1416",0,"","14 days to return the balance with a written itemization. A late landlord may owe the deposit, costs and attorney fees; willful bad faith can add liquidated damages."],
["NV","Nevada",30,2,0,"Nev. Rev. Stat. § 118A.242",0,"","30 days after the tenancy ends. A landlord who fails to comply may owe the entire deposit plus up to a further amount equal to the deposit, set by the court."],
["NH","New Hampshire",30,2,0,"N.H. RSA 540-A:7, 540-A:8",0,"","30 days, with a written itemized list and evidence of repair for deductions. A court may award 2× the deposit plus interest."],
["NJ","New Jersey",30,2,0,"N.J. Stat. § 46:8-21.1",0,"","30 days (5 days after fire, flood, or condemnation). 2× plus costs."],
["NM","New Mexico",30,0,0,"N.M. Stat. § 47-8-18",1,"l","30 days after the later of move-out or the end of the agreement. A late landlord loses the right to withhold and owes costs and attorney fees."],
["NY","New York",14,2,0,"N.Y. Gen. Oblig. Law § 7-108",0,"l","A late landlord forfeits the right to keep any of the deposit; willful: up to 2×."],
["NC","North Carolina",30,0,0,"N.C. Gen. Stat. §§ 42-52, 42-55",0,"l","30 days; if the claim amount isn't known yet, an interim accounting at 30 days and a final one within 60. Willful violations can forfeit the right to keep any deposit."],
["ND","North Dakota",30,3,0,"N.D. Cent. Code § 47-16-07.1",0,"f","Up to 3× for bad faith."],
["OH","Ohio",30,1,0,"Ohio Rev. Code § 5321.16",0,"f","Forwarding address needed. Damages equal the withheld amount, plus fees."],
["OK","Oklahoma",45,0,0,"Okla. Stat. tit. 41, § 115",0,"f","The 45 days start only after you make a written demand (and give your forwarding address). If you don't demand within 6 months, the deposit can revert to the landlord."],
["OR","Oregon",31,2,0,"Or. Rev. Stat. § 90.300",0,"","31 days; 2× the amount wrongfully withheld."],
["PA","Pennsylvania",30,2,0,"68 P.S. § 250.512",0,"fl","Written forwarding address needed. Missing the deadline forfeits deductions."],
["RI","Rhode Island",20,2,0,"R.I. Gen. Laws § 34-18-35",0,"f","Written forwarding address needed."],
["SC","South Carolina",30,3,0,"S.C. Code § 27-40-410",0,"f","3× the amount wrongfully withheld, plus fees."],
["SD","South Dakota",14,0,0,"S.D. Codified Laws § 43-32-24",0,"f","14 days after the tenancy ends and you give a mailing address: return the deposit or send written reasons for withholding. Itemization within 45 days on request. Missing the deadline forfeits the right to withhold."],
["TN","Tennessee",30,0,0,"Tenn. Code § 66-28-301",1,"l","The statute sets no fixed return deadline, so 30 days here is only a placeholder. The landlord must list damage found at inspection and forfeits the right to keep the deposit without that list. Applies only in counties over 75,000 population."],
["TX","Texas",30,3,100,"Tex. Prop. Code §§ 92.103, 92.109",0,"fl","Bad faith: $100 + 3× withheld + fees. Forwarding address needed."],
["UT","Utah",30,0,0,"Utah Code § 57-17-3",0,"","30 days after you move out and return possession, with a written itemized notice of deductions. A written notice from you starts a 5-business-day window; fees may apply for bad faith."],
["VT","Vermont",14,2,0,"9 V.S.A. § 4461",0,"l","A late landlord forfeits the right to withhold; willful: 2×."],
["VA","Virginia",45,0,0,"Va. Code § 55.1-1226",0,"","45 days after the tenancy ends and you vacate, with an itemized written notice. A willful violation can mean the deposit plus actual damages and attorney fees."],
["WA","Washington",30,2,0,"Wash. Rev. Code § 59.18.280",0,"l","30 days to mail a written statement and any refund. A late landlord owes the full deposit and loses the right to claim deductions; up to 2× if refusal was intentional."],
["WV","West Virginia",60,0,0,"W. Va. Code §§ 37-6A-1, 37-6A-2",1,"","The shorter of 60 days after the tenancy ends or 45 days after a new tenant moves in, with a written itemization. Check the statute for remedies."],
["WI","Wisconsin",21,2,0,"Wis. Admin. Code ATCP § 134.06",0,"","Wrongful withholding can mean 2× plus fees (Wis. Stat. § 100.20)."],
["WY","Wyoming",30,0,0,"Wyo. Stat. § 1-21-1208",0,"f","The later of 30 days after the agreement ends or 15 days after you give a new mailing address; extended by 30 days if there is damage. An unreasonable failure to comply can cost the full deposit plus court costs."]];
A.states={};
ROWS.forEach(function(r){A.states[r[0]]={name:r[1],days:r[2],m:r[3],x:r[4],stat:r[5],v:!!r[6],f:r[7].indexOf("f")>-1,l:r[7].indexOf("l")>-1,b:r[7].indexOf("b")>-1,n:r[8]}});
A.DISC="This tool provides general information and estimates only, not legal advice. Laws change and have exceptions. Verify with your state's official statutes or a licensed attorney.";
})();
