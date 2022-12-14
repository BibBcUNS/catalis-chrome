/* =============================================================================
 *  aux-windows.js
 *
 *  Manejo de ventanas auxiliares en el formulario de edici?n.
 *
 *  (c) 2003-2004  Fernando J. G?mez - CONICET - INMABB
 * =============================================================================
 */


 // TO-DO: ser?a mejor que las ventanas tuviesen el tama?o correcto al ser creadas, en
 // lugar de efectuar un ajuste posterior en sus dimensiones (en m?quinas lentas, causa
 // un efecto algo molesto).


// -----------------------------------------------------------------------------
function rawEdit(oldDatafields, aacr)
// Presenta la ventana para editar los campos en crudo, y actualiza el
// formulario de carga (a menos que el usuario haya cancelado).
// aacr --> los campos provienen de aacr2marc()
// ATENCION: si se usa esta funci?n cuando una plantilla reci?n se est?
// empezando a llenar, se pierde la plantilla (pues solo se muestran en el
// formulario los campos presentes en la ventana de raw-edit).
// -----------------------------------------------------------------------------
{
    var dWidth = (screen.width == 1024) ? "820px" : "660px";
    var dHeight = (screen.width == 1024) ? "550px" : "450px";
    var winProperties = "dialogWidth:" + dWidth + "; dialogHeight:" + dHeight + "; status:no; resizable:no; help:no";
    var dialogArgs = { datafields : oldDatafields, aacrParsedData : aacr };
    var newDatafields;

    // Presentamos la ventana
    //console.log("before dialog");
    //var newDatafields = showModalDialog(URL_RAW_EDIT, dialogArgs, winProperties);
    //console.log("after dialog");
    //console.log("newDatafields: ", newDatafields);

    // Esto seg?n https://github.com/niutech/showModalDialog
    (function() {
        //statements before showing a modal dialog
        console.log("before dialog");

        newDatafields = window.showModalDialog(URL_RAW_EDIT, dialogArgs, winProperties);

        //statements after closing a modal dialog
        console.log("after dialog");
        console.log("newDatafields: ", newDatafields);

        if ( "undefined" == typeof(newDatafields) || null == newDatafields ) {
            return false;
        }

        // Procesamos lo que devuelve la ventana
        newDatafields = newDatafields.replace(/\r/g, "");  //  \r del textarea
        if ( newDatafields != "" && newDatafields != oldDatafields ) {
            // Necesitamos el form de edici?n visible, para el caso en que esta
            // funci?n sea llamada al crear un registro desde la pantalla de
            // b?squeda.
            if ( "none" == document.getElementById("theMarcEditDiv").style.display ) {
                showEditDiv();
                selectedSubfieldBox = null;
                selectedField = null;
            }

            newDatafields = newDatafields.split(/\n/);
            renderDatafields(newDatafields);
        }

        //return true;  // as? sabemos, desde createRecord(), que la operaci?n no fue cancelada
    })();

}


// -----------------------------------------------------------------------------
function editCodedData(dataElement)
// Para editar c?digos del "fixed field" (leader & 008), campos 041, 044, etc.
// -----------------------------------------------------------------------------
{
    if ( dataElement.search(/relator|f041|f044/) != -1 ) {
        var srcObject = event.srcElement;
        var activeCode = srcObject.value;  // TO-DO: evt for mozilla
        var codeType = "single";
        var dialogLeft = event.clientX - 70;
        var dialogTop = event.clientY - 130;
        var URL = URL_EDIT_CODES;
    } else if ( "subfield7" == dataElement ) {
        var dialogLeft = event.clientX - 70;
        var dialogTop = event.clientY - 130;
        var URL = HTDOCS + "html/subfield-7.htm";
    } else {
        var form = document.getElementById("marcEditForm");
        var activeCode = form[dataElement].value;
        //var multiple = xmlData.xmlFixedField.selectNodes("/" + "/dataElement[@pos='" + dataElement + "']/@multiple");
        var multiple = xmlData.xmlFixedField.evaluate("/" + "/dataElement[@pos='" + dataElement + "']/@multiple", xmlData.xmlFixedField);
        var codeType = ( multiple.length > 0 ) ? multiple[0].value : "single";
        var dialogLeft = event.clientX;
        var dialogTop = event.clientY - 70; // con event.clientY - 38 hacemos que el puntero quede justo sobre la opci?n activa en el select
        var URL = URL_EDIT_CODES;
    }

    var dialogArgs = [window, dataElement, activeCode, codeType];
    var dialogHeight = ( "multiple" == codeType ) ? 230 : 145;
    var dialogWidth = 200;
    var winProperties = "font-size:10px; dialogLeft:" + dialogLeft + "px; dialogTop:" + dialogTop + "px; dialogWidth:" + dialogWidth + "px; dialogHeight:" + dialogHeight + "px; status:no; help:no";
    //alert(winProperties);

    var newCode = showModalDialog(URL, dialogArgs, winProperties);

    //alert(newCode);

    if ( "undefined" == typeof(newCode) || null == newCode ) {
        return;  // abortamos
    }

    if ( dataElement.search(/relator|f041|f044/) != -1 ) {
        srcObject.value = newCode.value;
        //displayPermanentTitle(srcObject,newCode.description.substr(6),40,0);
    } else {
        form[dataElement].value = newCode.value;
        if ( document.getElementById("TD_" + dataElement) ) {
            document.getElementById("TD_" + dataElement).title = newCode.description;
        }
    }

    event.srcElement.focus();  // no produce el efecto deseado (el elemento obtiene el foco, pero no se ve resaltado)
}


// -----------------------------------------------------------------------------
function editField041()
// -----------------------------------------------------------------------------
{
    alert("Desde aqu? se podr? editar el campo:\n\n041 - LANGUAGE CODE.\n\n(No implementado todav?a)");
}


// -----------------------------------------------------------------------------
function editField044()
// -----------------------------------------------------------------------------
{
    alert("Desde aqu? se podr? editar el campo:\n\n044 - COUNTRY OF PUBLISHING/PRODUCING ENTITY CODE.\n\n(No implementado todav?a)");
}


// -----------------------------------------------------------------------------
function editField046()
// -----------------------------------------------------------------------------
{
    alert("Desde aqu? se podr? editar el campo:\n\n046 - SPECIAL CODED DATES.\n\n(No implementado todav?a)");
}


// -----------------------------------------------------------------------------
function editField047()
// -----------------------------------------------------------------------------
{
    alert("Desde aqu? se podr? editar el campo:\n\n047 - FORM OF MUSICAL COMPOSITION CODE.\n\n(No implementado todav?a)");
}


// -----------------------------------------------------------------------------
function editIndicators(field)
// TO-DO: Ubicar la ventana en una posici?n independiente del lugar exacto
// donde se hizo click (?)
// -----------------------------------------------------------------------------
{
    var tag = field.tag;
    var path = "marc21_bibliographic/datafield[@tag='" + tag + "']";
    var xmlDatafield = crossBrowserNodeSelector(xmlMARC21,path);
    var oldIndicators = getIndicators(field);

    var dialogArgs = new Object();
    dialogArgs.ind = oldIndicators     //.replace(/#/g," ");
    dialogArgs.tag = tag;
    dialogArgs.xmlDatafield = xmlDatafield;
    dialogArgs.window = window;
    // Campos con filing indicator
    if ( tag.search(/130|222|240|242|245|440|630|730|740|830/) != -1 && "a" == parentSubfield(firstSubfieldBox(field), "subfieldBox").code) {
        dialogArgs.title = firstSubfieldBox(field).value;
    }
    var path1 = path + "/indicator[@pos='1']/i";
    var options1 = xmlMARC21.selectNodes(path1).length;
    var path2 = path + "/indicator[@pos='2']/i";
    var options2 = xmlMARC21.selectNodes(path2).length;

    var dialogHeight;
    if ( 2 == options1 && 2 == options2 ) {
        dialogHeight = "200";
    } else if ( options1 > 0 && options2 > 0 ) {
        dialogHeight = "188";
    } else dialogHeight = "135";
    var dialogWidth = 350;
    var dialogLeft = event.clientX + 6;
    var dialogTop = event.clientY + 36;
    var winProperties = "font-size:10px; dialogLeft:" + dialogLeft + "px; dialogTop:" + dialogTop + "px; dialogWidth:" + dialogWidth + "px; dialogHeight:" + dialogHeight + "px; status:no; help:no";

    // newIndicators contiene los indicadores devueltos por el cuadro de di?logo
    var newIndicators = showModalDialog(URL_EDIT_INDICATORS, dialogArgs, winProperties);

    if ( "undefined" == typeof(newIndicators) || null == newIndicators ) {
        return;  // abortamos
    }

    newIndicators = newIndicators.replace(/ /g,"#");
    updateIndicators(field,newIndicators);
    // TO-DO: actualizar el .title para que se vean los nuevos valores


    // Campo 505: el cambio del primer indicador puede producir un cambio en la estructura
    // de subcampos (basic vs. enhanced)
    if ( "505" == tag ) {
        var fieldContent = getSubfields(field,"","empty");
        if ( oldIndicators.substr(1,1) == "#" && newIndicators.substr(1,1) == "0" && fieldContent.search(/\^[rt]/) == -1 ) {
            // basic => enhanced
            enhance505(field,true);
        } else if ( oldIndicators.substr(1,1) == "0" && newIndicators.substr(1,1) == "#"  && fieldContent.search(/\^[rt]/) != -1 ) {
            // enhanced => basic
            enhance505(field,false);
        }
    }


    // En ciertos casos (ej.: campo 246, ind2) podemos hacer que el cambio
    // en un indicador produzca el cambio de un subfieldLabel.
    // Si usamos etiquetas para el campo, entonces el cambio podr?a ser a nivel
    // de campo, y no de subcampo. Adem?s, la etiqueta ya debe adecuarse al
    // indicador cuando es creado el campo/subcampo.
    /*if ( "246" == tag ) {
        var ind2Value = newValues.substr(1,1);
        var newLabel = xmlDatafield.selectNodes("indicator[@pos='2']/i[@value=" + ind2Value + "]/@label-" + LANG)[0].value;
        firstSubfieldBox(field).parentNode.previousSibling.firstChild.firstChild.innerHTML = newLabel;
    }*/

    // En los casos en que se usan nonfiling indicators, podemos hacer esto:
    // [suspendido 2003/11/25, luego del cambio en editIndicators.htm]
    /*
    if ( tag.search(/240|245|440/) != -1 ) {
        var subfield = firstSubfieldBox(field).value;
        subfield = subfield.replace(/^{([^}]+)}/,"$1");  // quitamos marcas
        var ind = newValues.substr(1,1);
        if ( ind != 0 ) {
            subfield = "{" + subfield.substr(0,ind) + "}" + subfield.substr(ind);
        }
        firstSubfieldBox(field).value = subfield;
    }
    */

    // Foco al primer subcampo del campo
    firstSubfieldBox(field).focus();
}


// -----------------------------------------------------------------------------
function editEjemplares()
// Usa la variable global ejemplares, que viene inicializada desde el servidor
// (cuando se pide el registro para editar).
// -----------------------------------------------------------------------------
{
    var winProperties = "font-size:10px; dialogWidth:680px; dialogHeight:480px; status:no; help:no";

    // El array ejemplares es pasado por referencia
    // TO-DO: pasar el userID para usarlo en los ejemplares modificados
    //var newEjemplares = showModalDialog(URL_EDIT_EJEMPLARES, ejemplares, winProperties);
    var newEjemplares = showModalDialog(URL_EDIT_EJEMPLARES, {ejemplares: ejemplares, database: g_activeDatabase.name}, winProperties);

    // Verificamos que la ventana realmente haya devuelto el array con los ejemplares
    if ( "undefined" == typeof(newEjemplares) || null == newEjemplares ) {
        return;  // abortamos
    }

    ejemplares = newEjemplares;  // actualiza la variable global

    var bgColor = ( ejemplares.length > 0 ) ? HOLDINGS_BGCOLOR : "";
    document.getElementById("ejemplaresBtn").style.backgroundColor = bgColor;
    //document.getElementById("cantEjemplares").innerHTML = ejemplares.length;
}


// -----------------------------------------------------------------------------
function editPostItNote()
// -----------------------------------------------------------------------------
{
    var winProperties = "font-size: 10px; dialogWidth: 604px; dialogHeight: 470px; status: no; help: no";

    var newPostItNote = showModalDialog(URL_EDIT_POSTITNOTE, postItNote, winProperties);

    if ( "undefined" == typeof(newPostItNote) || null == newPostItNote ) {
        return;  // abortamos
    }

    postItNote = newPostItNote;  // actualiza la variable global
    //alert(postItNote);

    var bgColor = ( postItNote != "" ) ? POSTITNOTE_BGCOLOR : "";
    document.getElementById("postItNoteBtn").style.backgroundColor = bgColor;
    document.getElementById("postItNoteBtn").title = ( postItNote != "" ) ? postItNote.substr(2).replace(/\^\w/g,"\n\n") : "";
}

// -----------------------------------------------------------------------------
// GF postItNote en JQuery
// -----------------------------------------------------------------------------

$(function(){

    $("#postItNoteBtnJQ").click(function(){

        var $dialog = $('<div id="dialogGF"></div>')
                       .html('<iframe id="iframeGF" style="border: 3px;" src="' + URL_EDIT_POSTITNOTE + '" width="100%" height="100%"></iframe>')
                       .dialog({
                           autoOpen: false,
                           modal: true,
                           height: 530,
                           width: 640,
                           title: "Anotaciones sobre la catalogaci?n",
                           buttons: {
                                Aceptar: function () {             
                                    document.getElementById('iframeGF').contentWindow.handleOK();
                                    //postItNote = $('#hiddenNotes').text();  
                                    $(this).dialog("close");
                                },
                                Cancelar: function() {
                                    $(this).dialog("close");
                                }
                            },
                        //si no lo destruyo, los divs role=dialog se acumulan
                        //adem?s de ensuciar el html los selector siempre caen a los id del primer div                        
                       close: function(){
                            $(this).remove(); 
                        }                            
                       });
        
        $dialog.dialog("open");
        
        // TO-DO: esto se debe actualizar al mostrar el registro tb, el primer control. revisar
        // FIX-ME: actualizaci?n tras usar el bot?n
        var bgColor = ( postItNote != "" ) ? POSTITNOTE_BGCOLOR : "";
        $("#postItNoteBtnJQ").css("background-color", bgColor);
        $("#postItNoteBtnJQ").attr("title", (postItNote != "") ? postItNote.substr(2).replace(/\^\w/g,"\n\n") : "");
    });
});

// -----------------------------------------------------------------------------
function editImagenes()
// -----------------------------------------------------------------------------
{
  var recordId = document.getElementById("marcEditForm").f001.value;
  if (recordId.substring(0,1) == "[") {
    alert("Para agregar una imagen primero debe guardar el registro.");
    return;
  }

  // var fieldContainers = getDatafields();
  // var marcDatafields = [];
  // for (var i=0; i < fieldContainers.length; i++) {
  //     var subfields = getSubfields(fieldContainers[i]).replace(/ \.(?=\^|$)/g,".");
  //     if ( subfields.search(REGEX_EMPTY_SUBFIELD) == -1 ) {    // Ignoramos campos sin datos
  //         var tag = fieldContainers[i].tag;
  //         var ind = getIndicators(fieldContainers[i]);
  //         marcDatafields.push(tag + " " + ind + subfields);
  //     }
  // }

  // var fields_byTag = [];
  // for (var i=0; i < marcDatafields.length; i++) {
  //   var tag = marcDatafields[i].substr(0,3);
  //   if ( !fields_byTag[tag] ) {
  //     fields_byTag[tag] = new Array();
  //   }
  //   fields_byTag[tag][fields_byTag[tag].length] = marcDatafields[i].substr(4);
  // }

  // var isbn_pattern = new RegExp(/^(\d{13}|\d{12}X|\d{10}|\d{9}X)/); // the order of testing is important
  // var isbns = [];
  // if (fields_byTag["020"]) {
  //   for (var i=0; i < fields_byTag["020"].length; i++) {
  //     isbns.push(isbn_pattern.exec(fields_byTag["020"][i].substr(4))[0]);
  //   }
  // }

  var winProperties = "font-size: 10px; dialogWidth: 680px; dialogHeight: 520px; status: no; help: no";
  var params = {
    // isbns: isbns,
    recordId: recordId,
    window: window
  }
  var returnValue = showModalDialog(URL_EDIT_IMAGENES, params, winProperties);

  // Situaciones posibles:
  //   1. el di?logo se cerr? sin realizar ninguna acci?n
  //   2. se subi? una imagen nueva
  //   3. se borr? una imagen existente
  var status = returnValue.status;
  if (status == null) {
    return;
  }
  if (status == "imagen-subida") {
    var newFileType = returnValue.fileType;
    f985 = "##^a" + newFileType;
  } else if (status == "imagen-borrada") {
    f985 = "";
  }
}


// -----------------------------------------------------------------------------
function promptNewField()
// Presenta la ventana que solicita los tags de los campos a crear.
// TO-DO: ?filtramos aqu? mismo los campos "ilegales"?
// -----------------------------------------------------------------------------
{
    var winProperties = "font-size:10px; dialogWidth:630px; dialogHeight:450px; status:no; help:no";

    // disabledTags: Lista de campos no repetibles que ya est?n presentes en el registro
    // disabledTags --> global para poder ser le?da desde selectField.htm
    disabledTags = new Array();
    for (var i=0; i < g_nonRepTags.length; i++) {
        disabledTags[g_nonRepTags[i]] = isTagPresent(g_nonRepTags[i]);
    }

    // Mostramos la ventana
    var tags = showModalDialog(URL_SELECT_FIELD, window, winProperties);

    if ( "undefined" == typeof(tags) || null == tags || tags.length == 0 ) {
        return;  // abortamos
    }

    // Procesamos los datos devueltos por la ventana en el array tags
    createFieldList(tags);
}


// -----------------------------------------------------------------------------
function promptNewSubfield(field)
// Presenta la ventana que solicita los codes de los subcampos a crear.
// -----------------------------------------------------------------------------
{
    if ( field == null ) {
        alert("No hay ning?n campo seleccionado.");
        return;
    }

    var tag = field.tag;
    var path = "marc21_bibliographic/datafield[@tag='" + tag + "']";
    var xmlDatafield = crossBrowserNodeSelector(xmlMARC21,path);

    // Par?metros para la ventana de di?logo
    // ATENCION: tambi?n podemos pasar el objeto window como par?metro
    var dialogArgs = new Array();
    dialogArgs[0] = xmlDatafield;
    dialogArgs[1] = LANG;

    var disabledCodes = new Array();
    var nonRepSubfields, resultLength, code;
    var path = "subfield[@repet='NR']/@code";
    if (ie) {
        nonRepSubfields = xmlDatafield.selectNodes(path);
        resultLength = nonRepSubfields.length;
    } else if (moz) {
        nonRepSubfields = xmlMARC21.evaluate(path,xmlDatafield,null,7,null);
        resultLength = nonRepSubfields.snapshotLength;
    }
    for (var i=0; i < resultLength; i++) {
        if (ie) {
            code = nonRepSubfields[i].value;
        } else if (moz) {
            code = nonRepSubfields.snapshotItem(i).nodeValue;
        }
        disabledCodes[code] = isSubfieldPresent(field,code);
    }
    dialogArgs[2] = disabledCodes;

    // Mostramos la ventana
    var dWidth = 500;
    var dHeight = 480;
    if ( !codes ) {
        if (ie) {
            var winProperties = "font-size:10px; dialogWidth:" + dWidth + "px; dialogHeight:" + dHeight + "px; status:no; help:no";
            var codes = showModalDialog(URL_SELECT_SUBFIELD, dialogArgs, winProperties);
        } else if (moz) {
            openSimDialog(URL_SELECT_SUBFIELD, dWidth, dHeight, null, dialogArgs);
            return;
        }
    }

    if ( "undefined" == typeof(codes) || null == codes || codes.length == 0 ) {
        return;  // abortamos
    }

    // Procesamos los datos devueltos por la ventana en el array codes
    createSubfieldList(field,codes);
}


// -----------------------------------------------------------------------------
function showSpecialChars()
// -----------------------------------------------------------------------------
{
    var winProperties = "font-size:10px; dialogWidth:350px; dialogHeight:100px; status:no; help:no; resizable:yes";
    var specialChar = showModalDialog(HTDOCS + "html/specialChars.htm", null, winProperties);
}


// -----------------------------------------------------------------------------
function promptSaveChanges()
// Abre una ventana que informa que el registro ha sido modificado.
// -----------------------------------------------------------------------------
{
    var winProperties = [
        "font-size: 10px",
        "dialogWidth: 620px",
        "dialogHeight: 140px",
        "dialogTop: 80px",
        "status: no",
        "help: no"
    ];

    // Mostramos la ventana
    var answer = showModalDialog(URL_SAVE_CHANGES, window, winProperties.join(";"));

    if ( "undefined" == typeof(answer) || null == answer ) {
        answer = "cancel";
    }

    return answer;
}


// -----------------------------------------------------------------------------
function catalis_confirm(question,w,h,pos)
// Cuadro de di?logo "confirm" modificado
// -----------------------------------------------------------------------------
{
    var winProperties = "dialogWidth:" + w + "px; dialogHeight:" + h + "px; status:no; help:no";
    if ( "left" == pos ) winProperties += "; dialogLeft:10px";

    // Mostramos la ventana
    var answer = showModalDialog(URL_CONFIRM_DIALOG, question, winProperties);

    if ( "undefined" == typeof(answer) || null == answer ) {
        answer = false;
    }

    return answer;
}
