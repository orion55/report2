select COUNT(*) "Total"
  from ESIDMESSAGE t, esid273doc a, payorder p, inesidmessage i
 where t.doctype = 273
   and t.opernum = a.esidopernum
   AND p.opernum = a.payopernum
   AND i.edtype = 'ED274'
   and i.eddate >= to_date('01-04-2017', 'dd-mm-yyyy')
   and i.eddate <= to_date('30-04-2017', 'dd-mm-yyyy')
   AND a.edno = MOD(i.ed243_edno / 1000, 1) * 1000
   AND i.ed243_eddate = a.eddate;