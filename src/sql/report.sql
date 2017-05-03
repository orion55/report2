SELECT * FROM (SELECT A.*, ROWNUM AS MY_RNUM FROM(
select t.docdate          AS "Дата ED274",
       t.opernum          AS "Код ED273",
       p.docdate          AS "Дата документа",
       p.docnum           AS "Номер документа",
       p.paysum           AS "Сумма документа",
       i.ed244_answercode,
       i.ed244_purpose
  from ESIDMESSAGE t, esid273doc a, payorder p, inesidmessage i
 where t.doctype = 273
   and t.opernum = a.esidopernum
   AND p.opernum = a.payopernum
   AND i.edtype = 'ED274'
   and i.eddate >= to_date('01-04-2017', 'dd-mm-yyyy')
   and i.eddate <= to_date('30-04-2017', 'dd-mm-yyyy')
   AND a.edno = MOD(i.ed243_edno / 1000, 1) * 1000
   AND i.ed243_eddate = a.eddate) A 
   WHERE ROWNUM <= 100 + 900) WHERE MY_RNUM > 900;