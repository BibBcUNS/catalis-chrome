#!/bin/bash 
# ---------------------------------------------------------------------
# fullinv - Generación del archivo invertido para las bases
# bibliográficas de Catalis.
# ---------------------------------------------------------------------
#
# Uso: [path/to/]fullinv <database>
#
# Ejemplo:
#    cd /var/www/bases/catalis_pack/catalis/demo
#    /var/www/cgi-bin/catalis_pack/fullinv biblio
#
# IMPORTANTE:
#   1. Este archivo debe tener permiso de ejecución.
#   2. El directorio de los utilitarios cisis debe estar en el PATH.
#   3. Configurar la ruta al archivo fullinv.cip
#   4. Configurar las rutas *dentro* del archivo fullinv.cip
# ---------------------------------------------------------------------

PATH=/opt/cisis:$PATH
CIPAR=/var/www/catalis/cgi-bin/catalis_pack_en_produccion/fullinv.cip
#mx cipar=$CIPAR db=$1 gizmo=DICTGIZ fst=@BIBLIO.FST actab=AC-ANSI.TAB uctab=UC-ANSI.TAB stw=@BIBLIO.STW fullinv=$1 tell=500
mx cipar=$CIPAR db=$1                fst=@BIBLIO.FST actab=AC-ANSI.TAB uctab=UC-ANSI.TAB stw=@BIBLIO.STW fullinv=$1 tell=500


# FG, 2011-03-12
# Permitir que Apache escriba los archivos (luego del cambio al servidor CentOS)
# Comentado en feb 2014, luego del cambio al servidor en dic 2013.
#chgrp apache $1.*
#chmod g+w $1.*
