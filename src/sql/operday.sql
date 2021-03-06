select t.operdate,
       t.closedate,
       t.closeday,
       t.closetime,
       t.usercodeopen,
       t.usercodeclose,
       t.unloadseqdel,
       t.unloadseqback,
       t.btrv_address,
       t.rowver
  from operdays t
 where t.operdate >= to_date('12.01.2016', 'mm.dd.yyyy')
   and t.operdate <= to_date('01.31.2017', 'mm.dd.yyyy')
 order by t.operdate;
