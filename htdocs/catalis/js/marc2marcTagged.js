// =============================================================================
function marc2marcTagged(leader, f001, f003, f005, f006, f007, f008, marcDatafields, ejemplares, postItNote)
//
// (c) 2003-2004  Fernando J. Gómez - CONICET - INMABB
//
// 'marcDatafields' y 'ejemplares' son arrays
//
// TO-DO: agregar 003, 006, 007.
//
// ATENCION: Las columnas de los indicadores se ensanchan cuando
// la columna de los subcampos no llegan a tener "líneas completas".
//
// El atributo class="subfield" es utilizado para poder reconocer los subampos
// y así presentar uno por línea.
//
// ATENCION: el uso de '&nbsp;' en las celdas con el número de campo es para
// obligar a que haya un espacio cuando se copia el listado al portapapeles.
// =============================================================================
{
	var HTMLstring = "<table id='marcTaggedTable' width='100%' cellspacing='0' cellpadding='2' border='0'>";
	
	// leader: el parámetro sólo contiene posiciones 05,06,07,09,17,18,19
	
	var fullLeader = "";
	fullLeader += "·····";           /* Record length */
	fullLeader += leader.charAt(0);  /* Record status */
	fullLeader += leader.charAt(1);  /* Type of record */
	fullLeader += leader.charAt(2);  /* Bibliographic level */
	fullLeader += leader.charAt(3);  /* Type of control */
	fullLeader += leader.charAt(4);  /* Character coding scheme */
	fullLeader += "22";              /* Indicator count, Subfield code count */
	fullLeader += "·····";           /* Base address of data */
	fullLeader += leader.charAt(5);  /* Encoding level */
	fullLeader += leader.charAt(6);  /* Descriptive cataloging form */
	fullLeader += leader.charAt(7);  /* Linked record requirement */
	fullLeader += "4500";            /* Entry map */
	
	if ( fullLeader.length == 24 ) {
		HTMLstring += "<tr>";
		HTMLstring += "<td class='marctag'>LDR&nbsp;</td>";
		HTMLstring += "<td colspan='3'>" + fullLeader + "</td>";
		HTMLstring += "</tr>";
	} else {
		alert("Error en marc2marcTagged(): el leader tiene " + fullLeader.length + " posiciones, en lugar de 24. Necesita efectuar una corrección en el registro, y posiblemente en toda la base de datos.");
	}
	HTMLstring += "<tr><td class='marctag'>001&nbsp;</td>";
	HTMLstring += "<td colspan='3'>" + f001 + "</td></tr>";
	
	if ( f003 != "" ) {
		HTMLstring += "<tr><td class='marctag'>003&nbsp;</td>";
		HTMLstring += "<td colspan='3'>" + f003 + "</td></tr>";
	}
	
	HTMLstring += "<tr><td class='marctag'>005&nbsp;</td>";
	HTMLstring += "<td colspan='3'>" + f005 + "</td></tr>";
	
	if ( f006 != "" ) {
		f006 = f006.split(/~/);
		for (var i=0; i < f006.length; i++) {
			HTMLstring += "<tr><td class='marctag'>006&nbsp;</td>";
			HTMLstring += "<td colspan='3'>" + f006[i] + "</td></tr>";
		}
	}
	
	if ( f007 != "" ) {
		f007 = f007.split(/~/);
		for (var i=0; i < f007.length; i++) {
			HTMLstring += "<tr><td class='marctag'>007&nbsp;</td>";
			HTMLstring += "<td colspan='3'>" + f007[i] + "</td></tr>";
		}
	}
	
	HTMLstring += "<tr><td class='marctag'>008&nbsp;</td>";
	HTMLstring += "<td colspan='3'>" + f008 + "</td></tr>";

	// Campos de datos
	var lineas = marcDatafields;
	for (var i=0; i < lineas.length; i++) {
		HTMLstring += "<tr>";
		// tag
		HTMLstring += "<td class='marctag'>" + lineas[i].substr(0,3) + "&nbsp;</td>";
		// indicador 1
		HTMLstring += "<td class='indicator'>" + lineas[i].substr(4,1) + "</td>";
		// indicador 2
		HTMLstring += "<td class='indicator'>" + lineas[i].substr(5,1) + "</td>";
		// subcampos
		// ATENCION: usamos replace(/\/(?=\S)/g,"/<wbr>") para sugerir posibles line breaks luego de una barra, algo que necesitamos para las URLs largas. Sin embargo, <wbr> es no estándar.
		HTMLstring += "<td class='fieldContent'><span class='subfield'>" + lineas[i].substr(6).replace(/\/(?=\S)/g,"/<wbr>").replace(/\^(\w)/g," </span><span class='subfield'><b>$</b><b>$1</b> ") + "</span></td>";
		HTMLstring += "</tr>";
	}
	
	// Ejemplares
	// TO-DO: actualizar la lista de subcampos!!
	if ( ejemplares ) {
		for ( var i=0; i < ejemplares.length; i++ ) {
			HTMLstring += "<tr>";
			HTMLstring += "<td class='marctag'>859&nbsp;</td>";
			HTMLstring += "<td align='center' style='width: 12px; padding-right: 0px;'>#</td>";
			HTMLstring += "<td align='center' style='width: 12px; padding-left: 0px;'>#</td>";
			HTMLstring += "<td class='fieldContent'>";
			HTMLstring += "<b>$a</b> " + ejemplares[i]["inventario"];
			HTMLstring += ( ejemplares[i]["STprefijo"] )    ? " <b>$k</b> " + ejemplares[i]["STprefijo"]  : "";
			HTMLstring += ( ejemplares[i]["STclase"] )      ? " <b>$h</b> " + ejemplares[i]["STclase"]  : "";
			HTMLstring += ( ejemplares[i]["STlibristica"] ) ? " <b>$i</b> " + ejemplares[i]["STlibristica"]  : "";
			HTMLstring += ( ejemplares[i]["STvolumen"] )    ? " <b>$v</b> " + ejemplares[i]["STvolumen"]  : "";
			HTMLstring += ( ejemplares[i]["numeroEj"] )     ? " <b>$t</b> " + ejemplares[i]["numeroEj"]  : "";
			HTMLstring += ( ejemplares[i]["notaInterna"] )  ? " <b>$x</b> " + ejemplares[i]["notaInterna"] : "";
			HTMLstring += ( ejemplares[i]["notaPublica"] )  ? " <b>$z</b> " + ejemplares[i]["notaPublica"] : "";
			HTMLstring += "</td>";
			HTMLstring += "</tr>";
		}
	}

	// PostIt notes
	if ( postItNote ) {
		HTMLstring += "<tr>";
		HTMLstring += "<td class='marctag'>980&nbsp;</td>";		
		HTMLstring += "<td class='indicator'>#</td>";
		HTMLstring += "<td class='indicator'>#</td>";
		HTMLstring += "<td class='fieldContent'><span class='subfield'>" + postItNote.replace(/\^(\w)/g," </span><span class='subfield'><b>$</b><b>$1</b> ") + "</span></td>";
		HTMLstring += "</tr>";
	}
	HTMLstring += "</table>";
	
	return(HTMLstring);
}
