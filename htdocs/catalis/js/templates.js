/* =============================================================================
 *  templates.js
 *
 *  Plantillas usadas para crear registros nuevos.
 *
 *  ATENCION: ver templates.pft
 *
 *  Modificaciones a este archivo:
 *    a. si se agregan o quitan plantillas: ver selectTemplate.htm
 *    b. si se modifican plantillas: tener cuidado, pues los cambios
 *       pueden afectar a m�s usuarios de lo deseado.
 *
 *  (c) 2003-2004  Fernando J. G�mez - CONICET - INMABB
 * =============================================================================
 */

/* Campo 008: lo mostramos separado en bloques: 00-17, 18-34, 35-39 */


/* Datos comunes a todas las plantillas */
//'a001~[pendiente]~', /* Control number */
//'a905~n~', /* Record status. Code n: New */
//'a909~#~', /* Character coding scheme. Code #: MARC-8 */
//'a917~5~', /* Encoding level. Code 5: Partial (preliminary) level */
//'a918~a~', /* Descriptive cataloging form. Code a: AACR2 */
//'a919~#~', /* Linked record requirement. Code #: Related record not required */



var templates = new Object();

//------------------------------------------------------------------------------
function loadTemplates() {
//------------------------------------------------------------------------------

  // --------- LIBRO ---------
  // 2010-08-25: campo 440 reemplazado por 490+830 (FG)
  templates["libro"] = {
    html_help : "",
    leader : 'nam##5a#',
    f001   : "[pendiente]",
    f008   : '######s########xx#' + '###########000#0#' + 'und#d',
    datafields :
      '020 ##^a\n' +
      '100 1#^a^d\n' +
      '245 10^a^b^c\n' +
      '250 ##^a\n' +
      '260 ##^a^b^c\n' +
      '300 ##^a^b^c\n' +
      '490 1#^a^v\n' +
      '500 ##^a\n' +
      '504 ##^a\n' +
      '700 1#^a^d\n' +
      '830 #0^a^v\n'
  };




  // --------- DOCUMENTO INTERNO - ECONOMIA ---------
  templates["doc-eco"] = {
    html_help : "",
    leader : 'nam##5a#',
    f001   : "[pendiente]",
    f008   : '######s########xx#' + '###########000#0#' + 'und#d',
    datafields :
      '020 ##^a\n' +
      '022 ##^a\n' +
      '110 1#^a^b\n' +
      '245 10^a^b^c\n' +
      '260 ##^a^b^c\n' +
      '300 ##^av. ^b^c\n' +
      '505 ##^a\n' +
      '504 ##^a\n' +
      '650 ##^a\n' +
      '651 ##^a\n' +
      '653 ##^a\n' +
      '856 ##^a\n' +
      '530 ##^a^d\n'
  };

  // --------- ANALITICA DE LIBRO ---------
  templates["anal-libro"] = {
    html_help : "Parte (art�culo, cap�tulo) de una publicaci�n monogr�fica impresa.<br>LDR/06 = a, LDR/07 = a.",
    leader : 'naa##5a#',
    f001   : "[pendiente]",
    f008   : '######s########xx#' + '###########000#0#' +'und#d',
    datafields :
      '100 1#^a^d\n' +
      '245 10^a^b^c\n' +
      '300 ##^a^b^c\n' +
      '700 1#^a^d\n' +
      '773 0#^7||am^a^t^b^d^z^w\n'
  };

  // --------- CD-ROM ---------
  // ATENCION: �notas en qu� orden?
  templates["cd-rom"] = {
    html_help : "",
    leader : 'nmm##5a#',
    f001   : "[pendiente]",
    f008   : "######s########xx#" + "########m########" + "und#d",
    datafields :
      '245 10^a^h[recurso electr�nico]^b^c\n' +
      '250 ##^a\n' +
      '260 ##^a^b^c\n' +
      '300 ##^a^b^c^e\n' +
      '538 ##^a\n' +
      '500 ##^a\n' +
      '710 2#^a^b\n'
  };

  // --------- VIDEOGRABACION ---------
  templates["video"] = {
    html_help : "",
    leader : 'ngm##5a#',
    f001   : "[pendiente]",
    f008   : '######s########xx#' + '---############vl' + 'und#d',
    datafields :
      '028 02^a^b\n' +
      '245 10^a^h[videograbaci�n]^b^c\n' +
      '260 ##^a^b^c\n' +
      '300 ##^a^b^c^e\n' +
      '538 ##^a\n' +
      '500 ##^a\n' +
      '511 1#^a\n' +
      '508 ##^a\n' +
      '710 2#^a^b\n'
  };

  // --------- TEXTO DE LA WEB ---------
  templates["web-text"] = {
    html_help : "Material textual accesible a trav�s de la Web: archivos HTML, PDF, PS, DOC, PPT, TXT, etc. Para catalogar un sitio web completo, use <i>Sitio web</i>.",
    leader : 'nam##5a#',
    f001   : "[pendiente]",
    f008   : '######s########xx#' + '#####s#####000#0#' + 'und#d',
    datafields :
      '100 1#^a^d\n' +
      '245 10^a^h[recurso electr�nico]^b^c\n' +
      '260 ##^a^b^c\n' +
      '538 ##^aModo de acceso: World Wide Web.\n' +
      '500 ##^aT�tulo tomado de **** (vist* el * de *** de 200*).\n' +
      '653 ##^a\n' +
      '653 ##^a\n' +
      '700 1#^a^d\n' +
      '710 2#^a\n' +
      '856 40^u^y\n'
  };

  // --------- CD DE AUDIO ---------
  templates["cd-audio"] = {
    html_help : "Grabaciones musicales en compact disc.",
    leader : 'njm##5a#',
    f001   : "[pendiente]",
    f008   : '######s########xx#' + '|||##############' + 'und#d',
    datafields :
      '028 02^a^b\n' +
      '100 1#^a^d\n' +
      '110 2#^a^b\n' +
      '245 10^a^h[grabaci�n sonora]^b^c\n' +
      '260 ##^a^b^c\n' +
      '300 ##^a^b^c\n'
  };

  // --------- PUBLICACION SERIADA ---------
  //  '515 ##^a\n' +
  templates["serial"] = {
    html_help : "Publicaci�n seriada impresa.",
    leader : 'nas##5a#',
    f001   : "[pendiente]",
    f008   : '######c####9999xx#' + 'uu|p#######0####|' + 'und#d',
    datafields :
      '022 ##^a\n' +
      '041 0#^a^b\n' +
      '245 10^a^b^c\n' +
      '210 1#^a\n' +
      '222 #0^a\n' +
      '362 0#^a\n' +
      '260 ##^a^b^c\n' +
      '300 ##^a^b^c\n' +
      '321 ##^a^b\n' +
      '310 ##^a\n' +
      '500 ##^a\n' +
      '546 ##^a\n' +
      '555 ##^a^u\n' +
      '710 2#^a^b\n' +
      '780 00^a^t^c^x\n' +
      '785 00^a^t^c^x\n' +
      '856 40^3^u^y\n'
  };

  // --------- ANALITICA DE PUBLICACION SERIADA ---------
  templates["anal-serial"] = {
    html_help : "Art�culo de una publicaci�n seriada impresa.",
    leader : 'nab##5a#',
    f001   : "[pendiente]",
    f008   : '######s########xx#' + '###########000#0#' + 'und#d',
    datafields :
      '100 1#^a^d\n' +
      '245 10^a^b^c\n' +
      '300 ##^a^b^c\n' +
      '520 ##^a\n' +
      '504 ##^a\n' +
      '700 1#^a^d\n' +
      '773 0#^7||as^a^t^d^x^g^w\n'
  };

  // --------- ANALITICA DE PUBLICACION SERIADA (WEB) ---------
  templates["anal-serial-web"] = {
    html_help : "Art�culo de una publicaci�n seriada accesible v�a Web.",
    leader : 'naa##5a#',
    f001   : "[pendiente]",
    f008   : '######s########xx#' + '#####s#####000#0#' + 'und#d',
    datafields :
      '100 1#^a^d\n' +
      '245 10^a^h[recurso electr�nico]^b^c\n' +
      '538 ##^aModo de acceso: World Wide Web.\n' +
      '500 ##^aT�tulo tomado de **** (vist* el * de *** de 200*).\n' +
      '520 ##^a\n' +
      '504 ##^a\n' +
      '700 1#^a^d\n' +
      '773 0#^7||as^a^t^d^x^g^w\n' +
      '856 40^u^y\n'
  };

  // --------- MAPA ---------
  templates["map"] = {
    html_help : "<b>Material cartogr�fico</b>, independientemente del soporte f�sico.",
    leader : 'nem##5a#',
    f001   : "[pendiente]",
    f008   : '######s########xx#' + '#######a#####1###' + 'und#d',
    datafields :
      '110 2#^a^b\n' +
      '245 10^a^h[material cartogr�fico]^b^c\n' +
      '250 ##^a\n' +
      '255 ##^aEscala ^bproy. ^c()\n' +
      '260 ##^a^b^c\n' +
      '300 ##^a^b^c\n' +
      '490 1#^a^v\n' +
      '500 ##^a\n' +
      '830 #0^a^v\n' +
      '651 #7^a^x^2\n'
  };

  // --------- CARTA TOPOGRAFICA 1:100000 ---------
  templates["carta-100000"] = {
    html_help : "<b>Carta topogr�fica, escala 1:100000</b>.",
    leader : 'nem##5a#',
    f001   : "[pendiente]",
    f008   : '######s########ar#' + '#######a#####1###' + 'spa#d',
    datafields :
      '110 2#^aInstituto Geogr�fico Militar.\n' +
      '245 10^a^h[material cartogr�fico]^b^c\n' +
      '250 ##^a\n' +
      '255 ##^aEscala 1:100000 ;^bproy. conforme Gauss-Kr�ger^c(O --O / S --S)\n' +
      '260 ##^a^bInstituto Geogr�fico Militar^c\n' +
      '300 ##^a^b^c\n' +
      '490 1#^a^v\n' +
      '500 ##^a\n' +
      '830 #0^a^v\n' +
      '651 #7^a^x^2\n'
  };

  // --------- CARTA TOPOGRAFICA 1:250000 ---------
  templates["carta-250000"] = {
    html_help : "<b>Carta topogr�fica, escala 1:250000</b>.",
    leader : 'nem##5a#',
    f001   : "[pendiente]",
    f008   : '######s########ar#' + '#######a#####1###' + 'spa#d',
    datafields :
      '110 2#^aInstituto Geogr�fico Militar.\n' +
      '245 10^a^h[material cartogr�fico]^b^c\n' +
      '250 ##^a\n' +
      '255 ##^aEscala 1:250000 ;^bproy. conforme Gauss-Kr�ger^c(O --O / S --S)\n' +
      '260 ##^a^bInstituto Geogr�fico Militar^c\n' +
      '300 ##^a^b^c\n' +
      '490 1#^a^v\n' +
      '500 ##^a\n' +
      '830 #0^a^v\n' +
      '651 #7^a^x^2\n'
  };

  // --------- CARTA TOPOGRAFICA 1:500000 ---------
  templates["carta-500000"] = {
    html_help : "<b>Carta topogr�fica, escala 1:500000</b>.",
    leader : 'nem##5a#',
    f001   : "[pendiente]",
    f008   : '######s########ar#' + '#######a#####1###' + 'spa#d',
    datafields :
      '110 2#^aInstituto Geogr�fico Militar.\n' +
      '245 10^a^h[material cartogr�fico]^b^c\n' +
      '250 ##^a\n' +
      '255 ##^aEscala 1:500000 ;^bproy. conforme Gauss-Kr�ger^c(O --O / S --S)\n' +
      '260 ##^a^bInstituto Geogr�fico Militar^c\n' +
      '300 ##^a^b^c\n' +
      '490 1#^a^v\n' +
      '500 ##^a\n' +
      '830 #0^a^v\n' +
      '651 #7^a^x^2\n'
  };

  // --------- TESIS UNS ---------
  templates["tesis"] = {
    html_help : "<b>Tesis</b> de grado o posgrado de la Universidad Nacional del Sur. Para tesis de otra instituci�n, realice las adaptaciones apropiadas.",
    leader : 'ntm##5a#',
    f001   : "[pendiente]",
    f008   : '######s########xx#' + '######bm###000#0#' + 'spa#d',
    datafields :
      '100 1#^a^d^4dis\n' +
      '245 10^a^b^c\n' +
      '260 ##^c\n' +
      '300 ##^a^b^c\n' +
      '502 ##^aTesis ()--Universidad Nacional del Sur. Departamento de ..., 20**.\n' +
      '500 ##^aDirector de tesis: \n' +
      '504 ##^aIncluye referencias bibliogr�ficas.\n' +
      '700 1#^a^d^4ths\n' +
      '710 2#^aUniversidad Nacional del Sur.^4dgg\n'
  };

  // --------- TESIS ECONOMIA UNS ---------
  templates["tesis-eco"] = {
    html_help : "<b>Tesis</b> de grado o posgrado del Depto. de Econom�a, UNS.",
    leader : 'ntm##5a#',
    f001   : "[pendiente]",
    f008   : '######s########xx#' + '######bm###000#0#' + 'spa#d',
    datafields :
      '100 1#^a^d^4dis\n' +
      '245 10^a^b^c\n' +
      '260 ##^c\n' +
      '300 ##^ah.^b^ccm.\n' +
      '502 ##^aTesis ()--Universidad Nacional del Sur. Departamento de Econom�a, 20**.\n' +
      '500 ##^aDirector de tesis: \n' +
      '504 ##^aIncluye referencias bibliogr�ficas (p. ).\n' +
      '653 ##^aTesis-\n' +
      '700 1#^a^d^4ths\n' +
      '710 2#^aUniversidad Nacional del Sur.^bDepartamento de Econom�a.^4dgg\n'
  };

  // --------- PARTITURA ---------
  templates["partitura"] = {
    html_help : "Para catalogaci�n de <b>m�sica impresa</b>.",
    leader : 'ncm##5a#',
    f001   : "[pendiente]",
    f008   : '######s########xx#' + 'uuu##############' + 'und#d',
    datafields :
      '028 02^a^b\n' +
      '100 1#^a^d\n' +
      '110 2#^a^b\n' +
      '245 10^a^b^c\n' +
      '254 ##^a\n' +
      '260 ##^a^b^c\n' +
      '300 ##^a^b^c\n'
  };

  // --------- SITIO WEB ---------
  templates["website"] = {
    html_help : "Para la catalogaci�n de un <b>sitio web</b> en su totalidad.",
    leader : 'nai##5a#',
    f001   : "[pendiente]",
    f008   : '######c####9999xx#' + 'k|#wss#####0####2' + 'und#d',
    datafields :
      '110 2#^a^b\n' +
      '245 10^a^h[recurso electr�nico]^b^c\n' +
      '260 ##^a^b^c\n' +
      '538 ##^aModo de acceso: World Wide Web.\n' +
      '500 ##^aT�tulo tomado de **** (vist* el * de *** de 20**).\n' +
      '520 ##^a\n' +
      '856 40^u^y\n'
  };

  // --------- ITI (INMABB) ---------
  templates["iti"] = {
    html_help : "",
    leader : 'nam##5a#',
    f001   : "[pendiente]",
    f008   : '######s########ag#' + '###########000#0#' + 'spa#d',
    datafields :
      '100 1#^a^d\n' +
      '245 10^a^b^c\n' +
      '260 ##^aBah�a Blanca :^bInstituto de Matem�tica,^c\n' +
      '300 ##^a^b^c cm.\n' +
      '490 #0^aInforme t�cnico interno ;^vno.\n' +
      '504 ##^aIncluye referencias bibliogr�ficas (p. ).\n' +
      '700 1#^a^d\n' +
      '830 #0^aInforme t�cnico interno (Instituto de Matem�tica, Universidad Nacional del Sur) ;^vno.\n'
  };

  // --------- VIDEOGRABACION DIRECCI�N DE MEDIOS AUDIOVISUALES UNS---------
  templates["videodmauns"] = {
    html_help : "",
    leader : 'ngm##5a#',
    f001   : "[pendiente]",
    f008   : '######s########xx#' + '---############vl' + 'spa#d',
    datafields :
      '245 00^a^h[videograbaci�n]^b^cDirecci�n de Medios Audiovisuales, Universidad Nacional del Sur.\n' +
      '260 ##^a^b^c\n' +
      '300 ##^a^b^c^e\n' +
      '518 ##^a\n' +
      '511 1#^a\n' +
      '508 ##^a\n' +
      '520 ##^aUniversidad Nacional del Sur.^bDirecci�n de Medios Audiovisuales.\n' +
      '710 2#^a^b\n'
  };
}


//------------------------------------------------------------------------------
function loadLocalTemplateData() {
//------------------------------------------------------------------------------
  // Campos que dependen de la base de datos
  for (var t in templates) {
    //templates[t].f001 = "[pendiente]";  // com�n a todos
    var subjectFields = "";
    //alert(g_activeDatabase.name);
    switch ( g_activeDatabase.name ) {
      case "bibima" :
        subjectFields += "084 ##^a*CODIGO*^2msc2000\n";
        break;
      case "eunm" :
      case "ead" :
        subjectFields += "650 #7^a^2unbist\n650 #7^a^2unbist\n";
        break;
      case "bab" :
      case "cedop" :
        subjectFields += "653 ##^a^a\n653 ##^a^a\n";
        break;
    }
    templates[t].datafields += subjectFields;
  }
}
