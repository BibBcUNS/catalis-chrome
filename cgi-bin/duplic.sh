#!/bin/bash

PATH=/home/catalis/cisis/1660:$PATH

mx biblio \
   uctab=ansi \
   "fst=1 0 \
      /* campo 1xx */  if s(v100,v110,v111) > '' then v100^a.10,v110^a.10,v111^a.10, else '----------', fi, \
      /* fecha */      c11,'/',v008*7.4,'/', \
      /* titulo */     replace(replace(v245^a,' /',''),' :','')" \
   fullinv=clavesdup \
   now -all
    
mx dict=clavesdup "pft=if val(v1^t)>1 then \
   /* contador */ putenv('COUNT=', f(val(getenv('COUNT'))+1, 1, 0)), getenv('COUNT'), c5, \
   /* clave */    v1^*/, \
   /* ref(['biblio']l(['clavesdup']v1^*), v245^a)/,  */ \
   fi" now
