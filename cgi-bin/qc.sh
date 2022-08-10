#!/bin/bash

#
# Controles de calidad para bases bibliograficas de Catalis
#
# Ver http://catalis.uns.edu.ar/doku/doku.php/controles_de_calidad
#

LINE='-----------------------------------------------'

echo
echo $LINE
echo 'Multiples campos 1xx'
echo $LINE
echo
mx biblio "pft=if size(v100.1,v110.1,v111.1,v130.1) > 1 then \
          'mfn:',mfn,x3,'reg:',v1/,|100: |v100/, |110: |v110/, |111: |v111/, |130: |v130/# fi" now lw=500

echo
echo $LINE
echo 'Fechas en campos x00'
echo $LINE
echo
mx biblio "pft=if v100^d:'(' then 'mfn:'mfn,x3,'reg:'v1,/,|100: |v100/# fi" lw=500 now
mx biblio "pft=( if v600^d:'(' then 'mfn:'mfn,x3,'reg:'v1[1],/,|600: |v600/# fi )" lw=500 now
mx biblio "pft=( if v700^d:'(' then 'mfn:'mfn,x3,'reg:'v1[1],/,|700: |v700/# fi )" lw=500 now
mx biblio "pft=( if v800^d:'(' then 'mfn:'mfn,x3,'reg:'v1[1],/,|800: |v800/# fi )" lw=500 now

echo
echo $LINE
echo 'Campos x10 que deben ser x11'
echo 'XXX Esto no es serio XXX'
echo $LINE
echo
mx biblio "pft=if v110:'^d' then 'mfn:'mfn,x3,'reg:'v1,/,|110: |v110/# fi" now lw=500
mx biblio "pft=( if v610:'^d' then 'mfn:'mfn,x3,'reg:'v1[1],/,|610: |v610/# fi )" now lw=500
mx biblio "pft=( if v710:'^d' then 'mfn:'mfn,x3,'reg:'v1[1],/,|710: |v710/# fi )" now lw=500
mx biblio "pft=( if v810:'^d' then 'mfn:'mfn,x3,'reg:'v1[1],/,|810: |v810/# fi )" now lw=500

echo
echo $LINE
echo 'Orden de subcampos'
echo $LINE
echo
mx biblio "pft=if v100:'^d' and v100:'^q' and instr(v100,'^d') < instr(v100,'^q') then \
          'mfn:'mfn,x3,'reg:'v1,/,|100: |v100/# fi" now
mx biblio "pft=( if v600:'^d' and v600:'^q' and instr(v600,'^d') < instr(v600,'^q') then \
          'mfn:'mfn,x3,'reg:'v1[1],/,|600: |v600/# fi )" now lw=500
mx biblio "pft=( if v700:'^d' and v700:'^q' and instr(v700,'^d') < instr(v700,'^q') then \
          'mfn:'mfn,x3,'reg:'v1[1],/,|700: |v700/# fi )" now lw=500
mx biblio "pft=( if v800:'^d' and v800:'^q' and instr(v800,'^d') < instr(v800,'^q') then \
          'mfn:'mfn,x3,'reg:'v1[1],/,|800: |v800/# fi )" now lw=500
