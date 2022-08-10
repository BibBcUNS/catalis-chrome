// =============================================================================
//  catalis.js
//
//  (c) 2003-2004  Fernando J. Gómez - CONICET - INMABB
// =============================================================================



// Las dos funciones que siguen son alternativas para realizar la misma tarea:
// traer un documento XML desde el servidor hasta el browser. Analizar pros y
// contras de cada una.

// -----------------------------------------------------------------------------
// function importXML(sourceURL)
// // From: http://www.sitepoint.com/print/xml-javascript-mozilla
// // -----------------------------------------------------------------------------
// {
//     var xmlDoc;
//     
//     if (moz) {
//         xmlDoc = document.implementation.createDocument("", "", null);
//     } else if (ie) {
//         msxmlProgID = "Msxml2.DOMDocument.3.0";  // versión de MSXML usada
//         xmlDoc = new ActiveXObject(msxmlProgID);
//         xmlDoc.async = false;
//         //try { xmlDoc.responseType = 'msxml-document'; } catch(e){}
//     }
//     xmlDoc.load(sourceURL);
//     return xmlDoc;
// }


// copiada de https://www.w3schools.com/xml/tryit.asp?filename=try_dom_xmlhttprequest_xml
function importXML(name, sourceURL) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            xmlData[name] = this.responseXML;
        }
    };
    // XXX Con async=true no sirve (parece que el intento de usar el xml ocurre antes de que haya llegado del servidor)
    // Pero está este mensaje en Chrome:
    // [Deprecation] Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects
    // to the end user's experience.
    xmlhttp.open("GET", sourceURL, false);
    xmlhttp.send();
}


// // -----------------------------------------------------------------------------
// function getXMLFile(sourceURL)
// // By Robert Clary
// // From: http://lists.w3.org/Archives/Public/www-dom-ts/2002Feb/0173.html
// //
// // ATENCION; en IE6 no refresca un documento (modificado en el servidor) que aun sigue en el cache local
// // -----------------------------------------------------------------------------
// {
//     var xmlhttp = null;
//     var xmldoc = null;
//
//     if (ie)
//         xmlhttp = new ActiveXObject('MSXML2.XMLHTTP');
//     else if (moz)
//         xmlhttp = new XMLHttpRequest();
//
//     if (xmlhttp) {
//         xmlhttp.open('GET', sourceURL, false);
//         xmlhttp.send(null);
//         xmldoc = xmlhttp.responseXML;
//     }
//
//     return xmldoc;
// }


// -----------------------------------------------------------------------------
function loadXML()
// -----------------------------------------------------------------------------
{
    // URLs de documentos XML
    URL_COUNTRY_CODES = HTDOCS + "xml/country.xml";
    URL_FIXED_FIELD = HTDOCS + "xml/fixedField.xml";
    URL_LANGUAGE_CODES = HTDOCS + "xml/language.xml";
    URL_RELATOR_CODES = HTDOCS + "xml/relator.xml";
    URL_MARC21 = HTDOCS + "xml/marc21.xml";
    
    // Cargamos los documentos
    xmlData = {};
    importXML("xmlMARC21", URL_MARC21);
    importXML("xmlCountryCodes", URL_COUNTRY_CODES);
    importXML("xmlLanguageCodes", URL_LANGUAGE_CODES);
    importXML("xmlFixedField", URL_FIXED_FIELD);
    importXML("xmlRelatorCodes", URL_RELATOR_CODES);
}


// -----------------------------------------------------------------------------
function defineSomeVars() {
// Definimos algunas variables al inicio de la aplicación.
// -----------------------------------------------------------------------------

    // Lista de campos MARC definidos
    var tags = "";
    var tagList, resultLength;
    if (ie) {
        tagList = xmlData.xmlMARC21.selectNodes("marc21_bibliographic/datafield/@tag");
        resultLength = tagList.length;
    } else if (moz) {
        tagList = xmlData.xmlMARC21.evaluate("marc21_bibliographic/datafield/@tag",xmlData.xmlMARC21,null,7,null);
        resultLength = tagList.snapshotLength;
    }
    for (var i=0; i < resultLength; i++) {
        if (ie)
            tags += "|" + tagList[i].value;
        else if (moz)
            tags += "|" + tagList.snapshotItem(i).nodeValue;
    }
    MARC_TAGS_ALL = new RegExp(tags.substr(1));
    
    
    // Lista de campos MARC no repetibles, como una expresión regular y como un array
    var tags = "";
    g_nonRepTags = [];  // global
    if (ie) {
        tagList = xmlData.xmlMARC21.selectNodes("marc21_bibliographic/datafield[@repet='NR']/@tag");
        resultLength = tagList.length;
    } else if (moz) {
        tagList = xmlData.xmlMARC21.evaluate("marc21_bibliographic/datafield[@repet='NR']/@tag",xmlData.xmlMARC21,null,7,null);
        resultLength = tagList.snapshotLength;
    }
    for (var i=0; i < resultLength; i++) {
        if (ie) {
            tags += "|" + tagList[i].value;
            g_nonRepTags.push(tagList[i].value);
        } else if (moz) {
            tags += "|" + tagList.snapshotItem(i).nodeValue;
            g_nonRepTags.push(tagList.snapshotItem(i).nodeValue);
        }
    }
    MARC_TAGS_NR = new RegExp(tags.substr(1));
}


// -----------------------------------------------------------------------------
function setDimensions()
// Asigna dimensiones a algunos elementos de la UI, independientemente de la
// resolución de pantalla.
// -----------------------------------------------------------------------------
{
  var _innerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  var _innerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var freeHeight = _innerHeight - 61; // quito la altura ocupada por las barras superiores
  var freeWidth = _innerWidth;

  // Variable global con dimensiones
  g_Dimensions = {
    searchResultsIframe: {height: 0.572 * freeHeight},
    recordVisualization: {height: 0.422 * freeHeight},
    indexTerms: {height: freeHeight - 210},
    theRightPanel: {height: 0.995*freeHeight},
    recordDiv: {height: 0.992*freeHeight},
    recordDivWithDocs: {height: 0.49 * freeHeight},
    docIframe: {height: 0.49 * freeHeight},
    docIframeCollapsed: {height: DOCWIN_MIN_HEIGHT},
    subfieldTextarea: {width: freeWidth - 444},
    subfieldTextareaNoLabels: {width: freeWidth - 292}
  };

  // Búsquedas
  document.getElementById("searchResultsIframe").style.height = g_Dimensions.searchResultsIframe.height + "px";
  document.getElementById("recordVisualization").style.height = g_Dimensions.recordVisualization.height + "px";
  document.getElementById("indexTerms").style.height = g_Dimensions.indexTerms.height + "px";

  // Edición
  document.getElementById("theRightPanel").style.height = g_Dimensions.theRightPanel.height + "px";
  document.getElementById("recordDiv").style.height = g_Dimensions.recordDiv.height + "px";
  document.getElementById("docIframe").style.height = g_Dimensions.docIframeCollapsed.height + "px";
}


// -----------------------------------------------------------------------------
function toggleSubfieldLabels()
// Mostramos/ocultamos las etiquetas con los nombres de los subcampos.
// -----------------------------------------------------------------------------
{
    DISPLAY_SUBFIELD_LABELS = !DISPLAY_SUBFIELD_LABELS;
    
    var tableCells = document.getElementById("recordDiv").getElementsByTagName("td");
    for (var i=0; i < tableCells.length; i++) {
        if ( "subfieldLabelCell" == tableCells[i].className ) {
            tableCells[i].style.display = ( DISPLAY_SUBFIELD_LABELS ) ? "" : "none";
        }
    }
    
    // Ajustamos el width de los textareas (subfieldBox).
    // ATENCION: Sería deseable que este ajuste se realizara automáticamente, pero
    // aún subsiste el problema de los URL largos.
    var textareas = document.getElementById("recordDiv").getElementsByTagName("textarea");
    for (var i=0; i < textareas.length; i++) {
        if ( "subfieldBox" == textareas[i].className ) {
            //textareas[i].style.width = "100%";
      textareas[i].style.width = (( DISPLAY_SUBFIELD_LABELS ) ? g_Dimensions.subfieldTextarea.width : g_Dimensions.subfieldTextareaNoLabels.width) + "px";
        }
    }
}


// ---------------------------------------------------------------------------
function indexOfSubfield(subfield)
// Indice del subcampo subfield dentro del array de subcampos que lo contiene
// ---------------------------------------------------------------------------
{
    var subfieldIndex = -1;    // -1 => el subcampo no está en el array
    var field = parentField(subfield,"subfield");
    var subfields = getSubfields(field,"array");
    for (var i=0; i < subfields.length; i++) {
        if ( subfields[i] == subfield ) {
            subfieldIndex = i;
            break;
        }
    }
    return subfieldIndex;
}


// ---------------------------------------------------------------------------
function highlightSubfieldBox(subfieldBox)
// Resalta un subfield box.
// Si box.error = true, entonces no se alteran sus propiedades visuales.
// Variables globales: selectedSubfieldBox, selectedField.
// ATENCION: revisar resaltado del selectedField
// ---------------------------------------------------------------------------
{
    //alert();
    //var eventSource = (evt) ? evt.target : event.srcElement;
    //var subfieldBox = eventSource;

    // Quitamos el resaltado al box antiguo
    if ( selectedSubfieldBox != null && !selectedSubfieldBox.error ) {
        selectedSubfieldBox.style.backgroundColor = "";
        selectedSubfieldBox.style.borderColor = "";
    }
    //if ( selectedField != null ) selectedField.style.backgroundColor = "";

    // Resaltamos el box nuevo
    if ( !subfieldBox.error ) {
        subfieldBox.style.backgroundColor = SUBFIELDBOX_HL_BGCOLOR;
        subfieldBox.style.borderColor = SUBFIELDBOX_HL_BORDERCOLOR;
    }

    selectedSubfieldBox = subfieldBox;
    selectedField = parentField(subfieldBox, "subfieldBox");
    
    //selectedField.style.backgroundColor = "#D6D6D6";

    //document.selection.empty();  // http://www.faqts.com/knowledge_base/view.phtml/aid/7863
    // Quitamos la selección pero perdimos el foco! (y si usamos focus(), entramos en un loop)
}


// -----------------------------------------------------------------------------
function showDoc(tag)
// ATENCION: usar argumentos, de lo contrario no funciona al ser llamada
// desde los menúes contextuales u otros popups. Tampoco funciona bien si se
// llama desde un link (campo 008) y está seleccionado "OCLC" en el menú.
// -----------------------------------------------------------------------------
{
    //var tag = document.getElementById("docItem").value;
    var menu = document.getElementById("docSource");
    var docSource = menu.options[menu.selectedIndex].value;
    var url = docURL(docSource,tag);

    if ( "notFound" == url ) {
        alert( "El campo " + tag + " no aparece en la documentación de MARC 21." );
    } else {
        //alert(url);
        document.getElementById("docIframe").src = url;
        if ( document.getElementById("docIframe").offsetHeight == DOCWIN_MIN_HEIGHT ) { //display != "block"
            docIframeShow();
        }
        
        frames.docIframe.focus();
        //document.getElementById("docIframe").focus();  ==> No tiene el efecto deseado, en IE
    }
}


// -----------------------------------------------------------------------------
function docURL(docSource,tag)
// -----------------------------------------------------------------------------
{
    var url;
    switch ( docSource ) {
        case "LC" :
            var url_dir = ( DOC_LC_REMOTE ) ? "http:/" + "/www.loc.gov/marc/bibliographic/" : HTDOCS + "doc/loc/marc/bibliographic/";
            if ( tag == "" )
                tag = "TOC";
            if ( "TOC" == tag.toUpperCase() )
                url = url_dir + "ecbdhome.html#TOC";
            else
            if ( "EJE" == tag.toUpperCase() )
                url = url_dir + "examples.html";
            else
            if ( tag.search("#") != -1 )
                url = url_dir + tag;
            else
            if ( "001~003~005~006".search(tag) != -1 )
                url = url_dir + "ecbdcntr.html#mrcb" + tag;
            else
            if ( "007" == tag )
                url = url_dir + "ecbd007s.html";
            else
            if ( "008" == tag )
                url = url_dir + "ecbd008s.html";
            else
            if ( "01~02~03~04".search(tag.substr(0,2)) != -1 )
                url = url_dir + "ecbdnumb.html#mrcb" + tag;
            else
            if ( "05~06~07~08".search(tag.substr(0,2)) != -1 )
                url = url_dir + "ecbdclas.html#mrcb" + tag;
            else
            if ( "100~110~111~130".search(tag) != -1 )
                url = url_dir + "ecbdmain.html#mrcb" + tag;
            else
            if ( "21~22~24".search(tag.substr(0,2)) != -1 )
                 url = url_dir + "ecbdtils.html#mrcb" + tag;
            else
            if ( "25~26~27".search(tag.substr(0,2)) != -1 )
                url = url_dir + "ecbdimpr.html#mrcb" + tag;
            else
            if ( "3" == tag.substr(0,1) )
                url = url_dir + "ecbdphys.html#mrcb" + tag;
            else
            if ( "4" == tag.substr(0,1) )
                url = url_dir + "ecbdsers.html#mrcb" + tag;
            else
            if ( "50~51~52".search(tag.substr(0,2)) != -1 || "530~533~534~535".search(tag) != -1 )
                url = url_dir + "ecbdnot1.html#mrcb" + tag;
            else
            if ( "54~55~56~58~59".search(tag.substr(0,2)) != -1 || "536~538".search(tag) != -1 )
                url = url_dir + "ecbdnot2.html#mrcb" + tag;
            else
            if ( "6" == tag.substr(0,1) )
                url = url_dir + "ecbdsubj.html#mrcb" + tag;
            else
            if ( "70~71~72~73~74~75".search(tag.substr(0,2)) != -1 )
                url = url_dir + "ecbdadde.html#mrcb" + tag;
            else
            if ( "76~77~78".search(tag.substr(0,2)) != -1 )
                url = url_dir + "ecbdlink.html#mrcb" + tag;
            else
            if ( "80~81~83".search(tag.substr(0,2)) != -1 )
                url = url_dir + "ecbdsrae.html#mrcb" + tag;
            else
            if ( "84~85~86~87~88".search(tag.substr(0,2)) != -1 )
                url = url_dir + "ecbdhold.html#mrcb" + tag;
            else {
                url = "notFound";
            }
            break;
            
        case "OCLC" :
            var url_dir = "http:/" + "/www.oclc.org/bibformats/en/";
            url = url_dir + tag.substr(0,1) + "xx/" + tag + ".shtm";
            break;
            
        case "FOLLETT" :
            var url_dir = "http:/" + "/www.fsc.follett.com/resources/tagofthemonth/";
            if ( "TOC" == tag.toUpperCase() ) {
                url = "http:/" + "/www.fsc.follett.com/resources/tagofthemonth/index.cfm";
            }
            else {
                url = url_dir + tag + "b.cfm";
            }
            break;
            
        case "TLC" :
            var url_dir = "http:/" + "/www.carl.org/tlc/crs/";
            if ( "TOC" == tag.toUpperCase() ) {
                url = "http:/" + "/www.carl.org/tlc/crs/bib0001.htm";
            }
            else {
                url = "";
            }
            break;
    }
    
    return url;
}


// -----------------------------------------------------------------------------
function docIframeHide()
// Oculta el iframe con documentación
// -----------------------------------------------------------------------------
{
    document.getElementById("recordDiv").style.height = g_Dimensions.recordDiv.height + "px";
    
    // Cambios en el iframe
    var docIframe = document.getElementById("docIframe");
    docIframe.style.height = g_Dimensions.docIframeCollapsed.height + "px";
    docIframe.style.borderWidth = "0px";
    var docIframeWrapper = document.getElementById("docIframeWrapper");
    docIframeWrapper.style.display = "none";
    
    // Cambios en el botón
    var button = document.getElementById("btnDocHideShow");
    button.style.backgroundImage = "url('" + HTDOCS + "img/up.gif')";
    button.onclick = docIframeShow;
    button.title = "Mostrar el panel con la documentación de MARC 21";
    
    if ( typeof(selectedSubfieldBox) != "undefined" && selectedSubfieldBox != null ) {
        selectedSubfieldBox.focus();
    } else {
        document.getElementById("btnDocHideShow").blur();
    }
}


// -----------------------------------------------------------------------------
function docIframeShow()
// Muestra el iframe con documentación
// -----------------------------------------------------------------------------
{
    document.getElementById("recordDiv").style.height = g_Dimensions.recordDivWithDocs.height + "px";
    
    // Cambios en el iframe
    var docIframe = document.getElementById("docIframe");
    docIframe.style.height = g_Dimensions.docIframe.height + "px";
    docIframe.style.borderWidth = "1px";
    var docIframeWrapper = document.getElementById("docIframeWrapper");
    docIframeWrapper.style.display = "block";
    
    // Cambios en el botón
    var button = document.getElementById("btnDocHideShow");
    button.style.backgroundImage = "url('" + HTDOCS + "img/down.gif')";
    button.onclick = docIframeHide;
    button.title = "Ocultar el panel con la documentación de MARC 21";
    
    frames.docIframe.focus();  // En IE6, no funciona usando document.getElementById()
}


// -----------------------------------------------------------------------------
function marcHelpPopup(tag,code)
// Presenta ayuda contextual sobre campos/subcampos/reglas.
//
// Basado en: Using the Popup Object,
// http://msdn.microsoft.com/workshop/author/om/popup_overview.asp
// -----------------------------------------------------------------------------
{
    var popupWidth = 450;
    var htmlString = "";
    
    // Ejemplos de uso
    try {
        var path = "marc21_bibliographic/datafield[@tag='" + tag + "']/tip/text()";
        var tip = crossBrowserNodeSelector(xmlData.xmlMARC21,path).nodeValue;
        htmlString += "<div class='tip1'>";
        htmlString += tip.replace(/\$(\w)/g,"<b>$</b><b>$1</b>");
        htmlString += "</div>";
    }
    catch(err) {}

    // Reglas aplicables
    try {
        var path = "marc21_bibliographic/datafield[@tag='" + tag + "']/subfield[@code='" + code + "']/@AACR2";
        var aacr = crossBrowserNodeSelector(xmlData.xmlMARC21,path).nodeValue;
        htmlString += "<div class='tip2'>";
        htmlString += "<i>AACR2:</i> " + aacr.replace(/(\S),/g,"$1 &middot; ");
        htmlString += "</div>";
    }
    catch(err) {}
    
    if ( htmlString == "" ) return;
    
    if (ie) {
        oPopup.document.body.innerHTML = htmlString;
    } else if (moz) {
        oPopup.innerHTML = htmlString;
    }
    
    showPopup(0, 0, popupWidth, 0);
    var realHeight = (ie) ? oPopup.document.body.scrollHeight : oPopup.offsetHeight;
    hidePopup();
    showPopup(-2, event.srcElement.parentNode.offsetHeight-4, popupWidth, realHeight, event.srcElement);
}


// -----------------------------------------------------------------------------
function generalHelpPopup(messageType)
// -----------------------------------------------------------------------------
{
    oPopup.document.body.innerHTML = document.getElementById("searchHelp").innerHTML;
    oPopup.document.getElementById("searchMessage").innerHTML = document.getElementById( messageType + "HelpMessage").innerHTML;
    
    var popupWidth = 500;
    showPopup(0, 0, popupWidth, 0);
    var realHeight = oPopup.document.body.scrollHeight;
    hidePopup();
    showPopup(0, event.srcElement.offsetHeight, popupWidth, realHeight, event.srcElement);
}


// -----------------------------------------------------------------------------
function getDatafields(fieldBlock)
// Devuelve un array con los nodos (campos) del bloque de campos fieldBlock.
// Si fieldBlock está ausente, se incluyen los campos de todos los bloques.
// -----------------------------------------------------------------------------
{
    var datafields = new Array();
    var rows;
    
    if ( fieldBlock ) {
        rows = document.getElementById("recordContainer_" + fieldBlock).getElementsByTagName("tr");
    } else {
        rows = document.getElementById("recordDiv").getElementsByTagName("tr");
    }
    
    for (var i=0; i < rows.length; i++) {
        if ( rows[i].tag ) {
            datafields.push(rows[i]);
        }
    }
    
    return datafields;
}


// ---------------------------------------------------------------------------
function getFieldBlockName(tag)
// Devuelve el nombre del bloque de campos asociado a tag.
// ---------------------------------------------------------------------------
{
    for (var p in FIELD_BLOCK_PATTERN) {
        if ( tag.search(FIELD_BLOCK_PATTERN[p]) != -1 ) {
            return p;
        }
    }
    
    // Si no hubo match, devolvemos el nombre del bloque usado por defecto
    return "description";
}


// ---------------------------------------------------------------------------
function indexOfField(field,fieldBlock)
// Indice del campo field dentro del bloque de campos al que pertenece.
// ---------------------------------------------------------------------------
{
    var fieldIndex = -1;         // -1 -> el campo no está en el array
    var dataFields = getDatafields(fieldBlock);
    for (var i=0; i < dataFields.length; i++) {
        if ( dataFields[i] == field ) {
            fieldIndex = i;
            break;
        }
    }
    return fieldIndex;
}


// -----------------------------------------------------------------------------
function firstPositionAfter(tag,fieldBlock)
// Devuelve el índice del primer campo cuyo tag es mayor que 'tag' (excepto
// cuando está seleccionado un campo 020/022)
// TO-DO: chequear condiciones de borde.
// -----------------------------------------------------------------------------
{
    var dataFields = getDatafields(fieldBlock);
    for (var i=0; i < dataFields.length; i++) {
        if (dataFields[i].tag > tag  // respetamos el orden numérico
            ||
            (tag.search(/[2345]../) != -1 )
            &&
            ( dataFields[i].tag.search(/020|022/) != -1 )  // excepción: ISBN/ISSN van después de todos los otros campos de la descripción
           ) {
            return i;
        }
    }
    return i;
}


// -----------------------------------------------------------------------------
function findNewFieldPosition(tag,fieldBlock)
// Encuentra el índice i del nodo (campo) junto al cual (i.e., antes del cual) se
// debe ubicar el nuevo campo.  (0 <= i <= datafields.length).
//
// TO-DO: esto se podría reescribir, de manera quizás más económica, agrupando
// por un lado todas las condiciones que llevan a
//     newPosition = indexOfField(selectedField) + 1;
// y por otro todas aquellas que llevan a
//     newPosition = firstPositionAfter(tag);
// (y aparte, la excepción: newPosition = getDatafields(fieldBlock).length;)
// -----------------------------------------------------------------------------
{
    var newPosition;
    
    // Algunas veces, el formulario se queda sin ningún campo seleccionado (un error que deberíamos corregir)
    if ( selectedField == null ) {
        selectedField = document.getElementById("field245");
    }
    
    if ( tag.search(/[56]../) != -1 ) {
        // Campos 5xx, 6xx
        if ( selectedField.tag.substr(0,1) == tag.substr(0,1) ) {
            newPosition = indexOfField(selectedField,fieldBlock) + 1;
        }
        else {
            newPosition = firstPositionAfter(tag,fieldBlock);
        }
    }
    else if ( tag.search(/7[0-5]./) != -1 ) {
        // Campos 70x-75x
        if ( selectedField.tag.search(/7[0-5]./) != -1 ) {
            newPosition = indexOfField(selectedField,fieldBlock) + 1;
        }
        else {
            newPosition = firstPositionAfter(tag,fieldBlock);
        }
    }
    else if ( tag.search(/7[6-8]./) != -1 ) {
        // Campos 76x-78x
        if ( selectedField.tag.search(/7[6-8]./) != -1 ) {
            newPosition = indexOfField(selectedField,fieldBlock) + 1;
        }
        else {
            newPosition = firstPositionAfter(tag,fieldBlock);
        }
    }
    else if ( tag.search(MARC_TAGS_NR) != -1 ) {
        // Campo no repetible
        newPosition = firstPositionAfter(tag,fieldBlock);
    }
    else {
        // Campo repetible (distinto de los ya examinados)
        if ( selectedField.tag == tag ) {
            newPosition = indexOfField(selectedField,fieldBlock) + 1;
        }
        else {
            // Tratamiento especial para los números normalizados
            if ( tag.search(/020|022/) != -1 && USE_FIELD_BLOCKS ) {
                newPosition = getDatafields(fieldBlock).length;
            } else {
                newPosition = firstPositionAfter(tag,fieldBlock);
            }
        }
    }
    
    return newPosition;
}


// -----------------------------------------------------------------------------
function isSubfieldPresent(field,code)
// Devuelve true si ya hay un subcampo 'code' en el campo 'field',
// y false caso contrario.
// -----------------------------------------------------------------------------
{
    var subfields = getSubfields(field,"array");
    var answer = false;
    for (var i=0; i < subfields.length; i++) {
        if ( subfields[i].code == code ) {
            answer = true;
            break;
        }
    }
    return answer;
}



// -----------------------------------------------------------------------------
function checkKey(evt)
// TO-DO: arreglar el problema del foco. (El truco del loop parece remediarlo, 2003/11/27)
// -----------------------------------------------------------------------------
{
    var evt = (evt) ? evt : window.event;
    var eventSource = (evt.target) ? evt.target : evt.srcElement;
    
    // Intento de remediar el problema de las alturas de los TEXTAREAS en Mozilla
    if (moz) {
        eventSource.style.height = 1;
        eventSource.style.height = eventSource.scrollHeight;
    }
    
    // Sólo nos interesan: Alt, Ctrl, Enter, Esc, Shift
    // ATENCION: ¿Agregamos alguna tecla de función?
    if ( !evt.shiftKey && !evt.altKey && !evt.ctrlKey && evt.keyCode != 13 && evt.keyCode != 27 && evt.keyCode != 123 ) {
        return true;
    }
    
    var subfield = parentSubfield(eventSource,"subfieldBox");

    switch ( evt.keyCode ) {
        case 13 :                // 13: enter --> tab
            if (ie) {
                evt.keyCode = 9;  // ATENCION: evt.keyCode es readonly en Mozilla!
                return true;
            } else if (moz) {
                // Queremos detectar el siguiente textarea para pasarle el foco.
                // ATENCION: Esta solución es muy poco eficiente.
                
                // 1. Deme todos los textareas del formulario
                var subfieldBoxes = document.getElementById("recordDiv").getElementsByTagName("textarea");
                
                // 2. Recorremos la lista de nodos, y cuando llegamos al que originó el
                // evento le pasamos el foco al próximo nodo.
                for (var i=0; i < subfieldBoxes.length - 1; i++) {
                    if ( subfieldBoxes[i] == eventSource ) {
                        subfieldBoxes[i+1].focus();
                        break;
                    }
                }
                
                return false;
            }
            break;
        
        case 27 :
            return false; // para evitar borrado accidental de datos con ESC
            break;
        
        case 35 :     // 35 = Fin = End --> foco al último campo (del último bloque de campos)
            if ( evt.altKey ) {
                // Explicación: 
                //  .firstChild  table
                //  .lastChild   tbody
                //  .lastChild   tr
                var lastField = document.getElementById("recordDiv").firstChild.lastChild.lastChild;
                // ATENCION: ajustar para que no dependa de los bloques presentes
                lastSubfieldBox(lastField).focus();
                firstSubfieldBox(lastField).focus();
                return false;
            }
            break;
        
        case 36 :     // Inicio=Home --> foco al primer campo
            if ( evt.altKey ) {
                // TO-DO: reescribir, así no funciona
                var firstField = document.getElementById("recordDiv").firstChild.firstChild.nextSibling.nextSibling.firstChild;
                // ATENCION: ajustar para que no dependa de los bloques presentes
                firstSubfieldBox(firstField).focus();
                alert("Problema pendiente: evitar que Alt+Inicio \nme lleve a la homepage");
                // TO-DO: está ignorando el return false! Incluso cambiando el keyCode:
                // En IE 6 (home) parece andar bien.
                evt.keyCode = 35;
                return false;
            }
            break;
        
        case 38 :       // 38: up arrow
            if ( evt.altKey ) {
                var field = parentField(subfield,"subfield");
                if ( evt.ctrlKey && canMoveUpF(field) ) {
                    mField = moveField(field,"up");  // move up field
                    for (var i=0; i < 5; i++) {     // ATENCION: sucio truco
                        firstSubfieldBox(mField).focus();
                    }
                    return false;
                }
                    else if ( !evt.ctrlKey && canMoveUpSf(subfield) ) {
                    mSubfield = moveSubfield(subfield,"up");  // move up subfield
                    for (var i=0; i < 5; i++) {   // sucio truco
                        childSubfieldBox(mSubfield).focus();
                    }
                    return false;
                }
            }
            else {
                // we would like to emulate shift+tab...
            }
            break;
        
        case 40 :                 // 40: down arrow
            if ( evt.altKey ) {
                var field = parentField(subfield,"subfield");
                    if ( evt.ctrlKey && canMoveDownF(field) ) {
                    mField = moveField(field,"down");  // move down field
                    for (var i=0; i < 5; i++) {  // sucio truco
                        firstSubfieldBox(mField).focus();
                    }
                    return false;
                }
                else if ( !evt.ctrlKey && canMoveDownSf(subfield) ) {
                    mSubfield = moveSubfield(subfield,"down");  // move down subfield
                    for (var i=0; i < 5; i++) {  // sucio truco
                        childSubfieldBox(mSubfield).focus();
                    }
                    return false;
                }
            }
            else if ( !evt.shiftKey ) { // shift + down arrow lo queremos seguir usando para poder seleccionar texto
                evt.keyCode = 9;           // down arrow --> tab
                return true;
                // TO-DO: en Marc Magician, cursorDown sirve para moverse dentro
                // de un textbox, pero también para navegar de un textbox al siguiente.
            }
            break;
        
        case 46 :      // Shift(+Ctrl)+Delete
            if ( evt.shiftKey ) {
                deleteObj(subfield);
                return false;
            }
            break;
        
        case 73 :       // Ctrl+I
            if ( evt.ctrlKey ) {
                if ( parentField(subfield,"subfield").hasIndicators ) {
                    editIndicators(parentField(subfield,"subfield"));
                }
                return false;
            }
            break;
        
        case 123 :       // F12
            if ( "4" == this.code ) {
                editCodedData("relator");
                return false;
            }
            // TO-DO: agregar campos 041, 044
            break;
    }
}


// -----------------------------------------------------------------------------
function deleteObj(subfield)
// Shift + Delete --> Elimina subcampo
// Ctrl + Shift + Delete --> Elimina campo
// Depende de la estructura DOM del formulario (???)
// TO-DO: el foco no se ubica bien
// TO-DO: cuando el campo/subcampo no puede ser borrado, generar un popup que
// lo informe.
// -----------------------------------------------------------------------------
{
    var field = parentField(subfield, "subfield");
    if ( event.shiftKey && event.ctrlKey ) {
        if ( canRemoveF(field) && catalis_confirm("¿Confirma la eliminación del campo " + field.tag + "?") ) {
            var focusTarget = removeField(field);
            if ( focusTarget != null ) {  // null cuando se elimina el último campo de un bloque
                firstSubfieldBox(focusTarget).focus();
            }
        }
    }
    else if ( event.shiftKey ) {
        // TO-DO: obviar la pregunta si el subcampo está vacío
        if ( canRemoveSf(subfield) && confirm("¿Confirma la eliminación del subcampo " + field.tag + "$" + subfield.code + "?") ) {
            var focusTarget = nextSubfieldBox(subfield);
            removeSubfield(subfield);
            for (var i=0; i < 20; i++)  // !!!
                focusTarget.focus();
        }
    }
}


// -----------------------------------------------------------------------------
function refreshTitleBar()
// Actualiza la barra de título con el texto del campo 245.
// TO-DO: el onchange no basta para detectar la *eliminación* o el
// *movimiento* de subcampos (¿corregido?)
// -----------------------------------------------------------------------------
{
    //var MAX_TITLE_LENGTH = 75;
    if ( document.getElementById("field245") ) {
        var title = getSubfields(document.getElementById("field245")).replace(/ \.(?=($|\^))/,".").replace(/\^\w/g," ");
        document.title = SOFT_NAME + " :: " + title;
    }
}


// -----------------------------------------------------------------------------
function showCodeTable(name)
// Muestra la tabla de códigos de relación, etc.
// -----------------------------------------------------------------------------
{
    var dialogLeft = event.clientX;
    var dialogTop = event.clientY;
    var winProperties = "font-size:10px; dialogLeft:" + dialogLeft + "px; dialogTop:" + dialogTop + "px; dialogWidth:550px; dialogHeight:200px; status:no; help:no";
    var newCode = showModalDialog(HTDOCS + "html/relatorCodes.htm", "", winProperties);
    alert(newCode);
}


// -----------------------------------------------------------------------------
function showKeys()
// Claves que se envían al diccionario para el registro actual.
// -----------------------------------------------------------------------------
{
    var recordID = document.getElementById("marcEditForm").f001.value;
    var url = SCRIPT_URL + "?IsisScript=catalis/xis/extract-keys.xis&amp;db=" + g_activeDatabase.name + "&amp;recordID=" + recordID;
    window.open(url, "", "height=450, width=740, scrollbars=yes, resizable=yes");
}


// -----------------------------------------------------------------------------
function showSearchDiv()
// Muestra la pantalla de búsquedas
// -----------------------------------------------------------------------------
{
    // Cerramos ventanas no modales asociadas a la pantalla de edición
    // ATENCION: revisar esto.
    /*
    if ( typeof(displayWindowClosed) != "undefined" && !displayWindowClosed ) {
        try { modelessWin.close() }
        catch(err) {};
    }
    */

    document.getElementById("searchResultsFrameWrapper").style.display = "block";
    document.getElementById("theSearchDiv").style.display = "block";
    document.getElementById("theMarcEditDiv").style.display = "none";
    document.title = SOFT_NAME;
    
    // Bloques de elementos visibles/invisibles
    document.getElementById("single_record_block").style.visibility = "hidden";
    document.getElementById("field_subfield_block").style.visibility = "hidden";
    document.getElementById("resultNavigation_block").style.visibility = "hidden";
    document.getElementById("btnBuscar").style.display = "none";
    document.getElementById("btnEditar").style.display = "inline";
    // El botón 'btnEditar' se habilita sólo si hay un registro en el form de edición
    document.getElementById("btnEditar").disabled = ( document.getElementById("marcEditForm").f001.value == "" );
    
    try {
        document.getElementById("kwSearchBox").focus();
    }
    catch (err) {
        document.getElementById("dictBrowseBox").focus();
    }
    // TO-DO: decidir qué elemento debe recibir el foco, en base al valor de
    // su propiedad .style.display
}


// -----------------------------------------------------------------------------
function showEditDiv()
// -----------------------------------------------------------------------------
{
    document.getElementById("searchResultsFrameWrapper").style.display = "none";
    document.getElementById("theSearchDiv").style.display = "none";
    document.getElementById("theMarcEditDiv").style.display = "block";
    document.title = SOFT_NAME;
    
    // Bloques de elementos visibles/invisibles
    document.getElementById("single_record_block").style.visibility = "visible";
    document.getElementById("field_subfield_block").style.visibility = "visible";
    document.getElementById("btnBuscar").style.display = "inline";
    document.getElementById("btnEditar").style.display = "none";

    // ATENCION: este elemento sólo debe ser visible si el registro editado es parte
    // del conjunto de resultados de la "búsqueda" más reciente. Actualmente, se lo
    // está mostrando de manera incondicional cada vez que se pasa a la pantalla
    // de edición.
    document.getElementById("resultNavigation_block").style.visibility = "visible";
    
    // Solo necesitamos actualizar el título cuando ya hay un título (y por lo tanto
    // un registro) en el form de edición
    if ( document.getElementById("field245") ) {
        refreshTitleBar();
    }
    
    // ATENCION: foco? recordamos dónde había quedado antes y lo ponemos alli?
    /*
    if ( selectedSubfieldBox != null ) {   // algo anda mal aquí con selectedSubfieldBox
        selectedSubfieldBox.focus();
    }
    */
    // En rawEdit() se llama a esta función, y se definen:
    // selectedSubfieldBox = null; selectedField = null;
    // Quizás estos deban definirse acá mismo.
}


// -----------------------------------------------------------------------------
function newFieldShortcut()
// Atajo para la creación de nuevos campos
// -----------------------------------------------------------------------------
{
    if ( document.getElementById("tagBox").value.search(/\d{3}/ ) != -1 ) {
        var tags = document.getElementById("tagBox").value.split(/\s+|\s*,\s*|\./);
        createFieldList(tags);
        document.getElementById("tagBox").value = "";
    }
}


// -----------------------------------------------------------------------------
function newSubfieldShortcut(field)
// Atajo para la creación de nuevos subcampos
// -----------------------------------------------------------------------------
{
    if ( document.getElementById("codeBox").value.search(/\w/ ) != -1 ) {
        var codes = document.getElementById("codeBox").value.split(/\s+|\s*,\s*|\./);
        // TO-DO: rechazar valores no admisibles
        createSubfieldList(field,codes);
        document.getElementById("codeBox").value = "";
    }
}


// -----------------------------------------------------------------------------
function handleMaxMfn(maxmfn)
// Actualiza el contador de registros de la base de datos bibliográfica.
// -----------------------------------------------------------------------------
{
    document.getElementById("maxmfn").innerHTML = maxmfn;

    // Cartel para avisar que se realizó la actualización del número
    if (ie) {
        oPopup.document.body.innerHTML = document.getElementById("maxMfnActualizado").innerHTML;
    } else if (moz) {
        oPopup.innerHTML = document.getElementById("maxMfnActualizado").innerHTML;
    }
    showPopup(0, 20, 200, 60, document.getElementById("maxmfn"));
    setTimeout("hidePopup()",1000);
}


// -----------------------------------------------------------------------------
function handleKwSearch()
// Verifica que la expresión no sea vacía, y elimina espacios sobrantes.
// -----------------------------------------------------------------------------
{
    var form = document.getElementById("kwSearchForm");
    form.dictionaryTerm.value = "";
    
    var query = document.getElementById("kwSearchBox").value;
    query = query.replace(/\s+/g," ");
    query = query.replace(/^\s+|\s+$/g,"");
    document.getElementById("kwSearchBox").value = query;

    if ( "" == query.replace(/\s+/g,"") ) {
        alert("Debe ingresar una expresión de búsqueda");
        return;
    } else {
        // Cartelito
        catalisMessage("Buscando...");
        
        /*
        var newSearch = new Object();
        newSearch.query = query;
        g_SearchHistory.push(newSearch);
        */

        form.submit();
    }
}


// -----------------------------------------------------------------------------
function deleteRecord()
// -----------------------------------------------------------------------------
{
    if ( confirm("BORRADO DEL REGISTRO\n\nSi borra este registro, no podrá recuperarlo. ¿Confirma el borrado?") ) {
        var form = document.getElementById("hiddenFORM");
        form.tarea.value = "BORRAR_REG";
        form.recordID.value = document.getElementById("marcEditForm").f001.value;
        form.target = "hiddenIFRAME";
        form.method = "GET";
        
        // Cartelito
        catalisMessage(document.getElementById("borrandoRegistro").innerHTML);
        
        form.submit();
    }
}


// -----------------------------------------------------------------------------
function databaseChange(newdb)
// Cambia la base de datos bibliográfica activa.
// TO-DO: evitar que deba volver a cargarse toda la página; actualizar sólo los
// elementos necesarios (que son casi todos!)
// -----------------------------------------------------------------------------
{
    // Cartelito
    catalisMessage(document.getElementById("cambiandoBase").innerHTML);
    
    var form = document.getElementById("hiddenFORM");
    form.db.value = newdb;
    form.tarea.value = "MAIN_PAGE";
    form.method = "GET";
    form.target = "_top";
    form.submit();
}


// -----------------------------------------------------------------------------
function viewRecordDetails(evt,recordID,recordDisplayStyle)
// Solicita al servidor un registro bibliográfico, para presentarlo en el panel
// inferior de la pantalla de búsquedas.
// -----------------------------------------------------------------------------
{
    // Resaltamos la fila que corresponde al registro seleccionado
    // ATENCION: el resaltado debe posponerse hasta que el registro sea recibido
    if ( recordID != null ) {
        if ( g_HighlightRowId != "" ) {
            frames.searchResultsIframe.document.getElementById(g_HighlightRowId).style.backgroundColor = "";
        }
        g_HighlightRowId = "resultRow" + recordID;
        frames.searchResultsIframe.document.getElementById(g_HighlightRowId).style.backgroundColor = RESULTROW_HL_BGCOLOR;
    }

    g_RecordDisplayStyle = recordDisplayStyle;

    var form = document.getElementById("hiddenFORM");
    if ( recordID == null ) {
        recordID = form.recordID.value;
    }

    // Cartelito
    // ATENCION: ¿Lo omitimos cuando la solicitud se produzca de
    // manera automática (e.g., lista de resultados con un único elemento)?
    catalisMessage(document.getElementById("solicitandoRegistro").innerHTML + " " + recordID + "...");
    
    // Enviamos petición del registro al servidor (la respuesta irá al IFRAME oculto)
    form.tarea.value = ( "etiq" == recordDisplayStyle ) ? "SEND_ETIQUETADO" : "SEND_RECORD";
    form.recordID.value = recordID;
    form.target = "hiddenIFRAME";
    form.method = "GET";
    form.submit();
}


// -----------------------------------------------------------------------------
function indexFromRecordID (recordID)
// -----------------------------------------------------------------------------
{
    for (var i=0; i < resultSet.length; i++) {
        if ( resultSet[i] == recordID ) {
            return i+1;
        }
    }
}


// -----------------------------------------------------------------------------
function editRecord(recordID,evt)
// Solicita al servidor un registro para ser presentado en el formulario de
// edición. Suponemos que el registro es parte del set de resultados de la
// búsqueda más reciente.
// -----------------------------------------------------------------------------
{
    switch ( recordID ) {
        case null :
            recordID = document.getElementById("hiddenFORM").recordID.value;
            g_editResultIndex = indexFromRecordID (recordID);
            break;
        case "prev" :
            g_editResultIndex = g_editResultIndex - 1;
            recordID = resultSet[g_editResultIndex - 1];
            break;
        case "next" :
            g_editResultIndex = g_editResultIndex + 1;
            recordID = resultSet[g_editResultIndex - 1];
            break;
        default :
            g_editResultIndex = indexFromRecordID (recordID);
            break;
    }

    // Cartelito
    catalisMessage(document.getElementById("solicitandoRegistro").innerHTML + " " + recordID + " para editar ...");

    // Enviamos petición del registro al servidor (la respuesta irá al IFRAME oculto).
    // Si es llamada sin parámetro mfn: ver comentario para función de arrriba (???).
    var form = document.getElementById("hiddenFORM");
    form.tarea.value = "EDITAR_REG";
    form.recordID.value = recordID;
    form.method = "GET";
    form.target = "hiddenIFRAME";
    form.submit();
}


// -----------------------------------------------------------------------------
function showSearchForm(formType)
// Para alternar entre el formulario de búsquedas y el diccionario.
// TO-DO: el diccionario debería estar disponible *junto* al formulario
// de búsqueda.
// -----------------------------------------------------------------------------
{
    document.getElementById("searchNotIndex").style.display = "none";
    document.getElementById("indexNotSearch").style.display = "none";
    document.getElementById(formType + "Tab").className += " activeTab";
    switch (formType) {
        case "search" :
            document.getElementById("searchNotIndex").style.display = "block";
            document.getElementById("indexTab").className = "tab";
            document.getElementById("kwSearchBox").focus();
            break;
        case "index" :
            document.getElementById("indexNotSearch").style.display = "block";
            document.getElementById("searchTab").className = "tab";
            document.getElementById("dictBrowseBox").focus();
            break;
    }
}


// -----------------------------------------------------------------------------
function searchFromDictionary(dictionaryTerm,rowNumber)
// -----------------------------------------------------------------------------
{
    // Resaltado de la fila con el término seleccionado
    if ( g_HighlightIndexRowId != "" ) {
        document.getElementById(g_HighlightIndexRowId).style.backgroundColor = "";
    }
    g_HighlightIndexRowId = "dictKeyRow" + rowNumber;
    document.getElementById(g_HighlightIndexRowId).style.backgroundColor = INDEXTERM_HL_BGCOLOR;
    
    // Cartelito
    catalisMessage("Buscando...");
    
    var form = document.getElementById("kwSearchForm");
    form.dictionaryTerm.value = dictionaryTerm;
    form.submit();
}


// -----------------------------------------------------------------------------
function updateDictionaryList(key1,reverse)
// Solicita al servidor una lista de términos del diccionario.
// -----------------------------------------------------------------------------
{
    // Cartelito
    catalisMessage(document.getElementById("solicitandoTerminos").innerHTML + "...");
    
    var form = document.getElementById("indexForm");
    form.dictkey.value = key1;
    form.reverse.value = ( reverse ) ? "On" : "";
    form.submit();
}



// -----------------------------------------------------------------------------
function modifiedRecord()
// -----------------------------------------------------------------------------
{
    // ATENCION: ¿esto significa que por el solo hecho de haber cambiado el *catalogador* el
    // registro se considera modificado?
    var currentRecord = serializeRecord(true,true,true,true);
    var modified = ( currentRecord != originalRecord );
    return modified;
}


// -----------------------------------------------------------------------------
function checkModified(elementID)
// Ante el intento de abandonar el registro que está siendo editado,
// necesitamos verificar si el registro fue modificado, y en caso afirmativo,
// consultar si éste debe grabarse antes de continuar.
// -----------------------------------------------------------------------------
{
    // Si el elementID corresponde a un elemento de un popup, éste ya no existe!
    if ( document.getElementById(elementID) ) {
        //document.getElementById(elementID).blur(); // no va con Mozilla
    }
    // ATENCION: ¿adónde debería ir el foco?
    
    
    // La condición sobre el botón de Grabar tiene que ver con el nivel de permisos del usuario; ver showRecordInForm(). Tal vez sea mejor usar una variable global.
    if ( !document.getElementById("btnGrabar").disabled && typeof(originalRecord) != "undefined" && modifiedRecord() ) {
        
        // El usuario debe tomar una decisión
        var userDecision = promptSaveChanges();
        
        switch ( userDecision ) {
            case "cancel" :
                if ( "selDatabase" == elementID ) {
                    // Restauramos la opción correspondiente a la base activa
                    document.getElementById("selDatabase").selectedIndex = g_activeDatabase.index;
                }
                return false;  // nos vamos, y acá no ha pasado nada
                break;
            case "save" :
                g_NextTask = elementID; // para que, luego de grabar, sepamos qué hacer
                saveRecord();
                break;
            case "doNotSave" :
                break;      // seguimos adelante, hacia handleNextTask()
            default :
                alert("Error! userDecision = " + userDecision);
                return;
        }
    }

    // Si no hay cambios, o el usuario decidió que no deben guardarse
    handleNextTask(elementID);
}


// -----------------------------------------------------------------------------
function handleNextTask(elementID)
// Luego de resuelta la grabación del registro modificado, se ejecuta la
// acción que el usuario había solicitado.
// elementID = el elemento (button, select) desde el cual se inició la acción.
// -----------------------------------------------------------------------------
{
    g_NextTask = "";

    switch ( elementID ) {
        case 'btnBuscar' :
            showSearchDiv();
            break;
        case 'btnPrevResult' :
            editRecord("prev");
            break;
        case 'btnNextResult' :
            editRecord("next");
            break;
        case 'newTemplate' :
            getNewRecordParams();
            break;
        case 'newImport' :
            getIsoRecord();
            break;
        case 'newDuplicate' :
            duplicateRecord();
            break;
        case 'selDatabase' :
            var selectObj = document.getElementById("selDatabase");
            selectObj.blur();
            databaseChange(selectObj.options[selectObj.selectedIndex].value);
            break;
        case 'btnFinSesion' :
            endSession();
            break;
        default :
            alert("Error! elementID = " + elementID);
            return;
    }
}


//--------------------------------------------------------
function sortEjemplares(ej1,ej2)
// Ordenamiento de ejemplares.
//--------------------------------------------------------
{
    if ( ej1.parte < ej2.parte )
        return -1;
    if ( ej1.parte > ej2.parte )
        return 1;
    // A igual parte, ordenamos por número de ejemplar
    var n1 = ej1.numeroEj.replace(/\D/g,"");
    var n2 = ej2.numeroEj.replace(/\D/g,"");
    return n1 - n2;
}


// -----------------------------------------------------------------------------
function updateDialogHeight(objWindow)
// Modifica la altura de una ventana de diálogo, en base a su contenido visible.
// -----------------------------------------------------------------------------
{
    var newHeight = objWindow.dialogHeight.replace("px","")*1 + (objWindow.document.body.scrollHeight - objWindow.document.body.offsetHeight);
    //alert("objWindow.dialogHeight=" + objWindow.dialogHeight + "\nobjWindow.document.body.scrollHeight=" + objWindow.document.body.scrollHeight + "\nobjWindow.document.body.offsetHeight=" +  objWindow.document.body.offsetHeight + "\nnewHeight=" + newHeight);
    var maxAllowHeight = screen.height - 70;
    var minAllowHeight = 160;
    newHeight = Math.min(newHeight, maxAllowHeight);
    newHeight = Math.max(newHeight, minAllowHeight);
    objWindow.dialogHeight = newHeight + "px";
}


// -----------------------------------------------------------------------------
function updateDialogWidth(objWindow)
// Modifica el ancho de una ventana de diálogo, en base a su contenido visible.
// -----------------------------------------------------------------------------
{
    var newWidth = objWindow.dialogWidth.replace("px","")*1 + (objWindow.document.body.scrollWidth - objWindow.document.body.offsetWidth);
    //alert("objWindow.dialogWidth=" + objWindow.dialogWidth + "\nobjWindow.document.body.scrollWidth=" + objWindow.document.body.scrollWidth + "\nobjWindow.document.body.offsetWidth=" +  objWindow.document.body.offsetWidth + "\nnewWidth=" + newWidth);
    //newWidth = Math.min(newWidth, screen.width - 60);
    objWindow.dialogWidth = newWidth + "px";
}


// -----------------------------------------------------------------------------
function showHiddenData()
// Permite ver el iframe oculto, para analizar su contenido usando 'view source'.
// -----------------------------------------------------------------------------
{
    //var props = new Array();
    var form = document.getElementById("hiddenIFRAME");
    //alert(form.style.display);
    if ( "block" != form.style.display ) {
        form.style.display = "block";
        form.style.width = "100px";
        form.style.height = "20px";
        form.style.position = "absolute";
        form.style.top = "2px";
        form.style.left = "160px";
    }
    else {
        form.style.display = "none";
        form.style.width = "0px";
        form.style.height = "0px";
    }
    
    // TO-DO: mostrar el código fuente en una ventana auxiliar, pero
    // sin que eso implique actualizar el contenido del iframe.
    //var frameSrc = "view-source:" + frames.hiddenIFRAME.location.href;
    //var newWin = window.open(frameSrc);
}


// -----------------------------------------------------------------------------
function showPopup(x,y,width,height,refObject)
// -----------------------------------------------------------------------------
{
    if (ie) {
        oPopup.show(x,y,width,height,refObject);
    } else if (moz) {
        // Truco para obtener las coordenadas (de: JavaScript and DHTML Cookbook)
        var offsetTrail = refObject;
        var offsetLeft = 0;
        var offsetTop = 0;
        while (offsetTrail) {
            offsetLeft += offsetTrail.offsetLeft;
            offsetTop += offsetTrail.offsetTop;
            offsetTrail = offsetTrail.offsetParent;
        }
        
        var left = x + offsetLeft;
        var top = y + offsetTop;
        //alert(refObject.tagName + "\n" + offsetLeft + "\n" + offsetTop);
        oPopup.style.width = width;
        oPopup.style.height = height;
        oPopup.style.position = "absolute";
        oPopup.style.left = left + "px";
        oPopup.style.top = top + "px";
        oPopup.style.zIndex = "200";
        oPopup.style.display = "block";
    }
}


// -----------------------------------------------------------------------------
function hidePopup()
// -----------------------------------------------------------------------------
{
    if ( typeof oPopup != "undefined" ) {  // por un error que muestra Mozilla
        if (ie) {
            oPopup.hide();
            document.getElementById("cartel").style.display = "none";
        } else if (moz) {
            oPopup.style.display = "none";
        }
    }
}


// -----------------------------------------------------------------------------
function showNewRecords(evt)
// -----------------------------------------------------------------------------
{
    // Cartelito
    catalisMessage(document.getElementById("solicitandoListado").innerHTML);
    
    if (ie) {
        document.frames.searchResultsIframe.location.href = document.getElementById("searchResultsIframe").src;
    } else if (moz) {
        document.getElementById("searchResultsIframe").src = document.getElementById("searchResultsIframe").src;
    }
    
    var eventSource = (evt) ? evt.target : window.event.srcElement;
    eventSource.blur();
}


// -----------------------------------------------------------------------------
function map490to440(field490)
// Convierte un campo 490 en un 440.
// TO-DO: tener en cuenta indicador 1, y un posible campo 8xx asociado al 490.
// -----------------------------------------------------------------------------
{
    var sf = getSubfields(field490);
    if ( sf.substr(0,2) != "^a" ) sf = "^a" + sf;  // 440$a es obligatorio
    
    var field440 = createField("440","#0",sf);
    displayField(field440,field490);  // field490 es el nodo de referencia para ubicar el field440
    updatePunctuation(field440);
    removeField(field490);
    firstSubfieldBox(field440).focus();
}

// -----------------------------------------------------------------------------
function map830to440(field830)
// Convierte un campo 830 en un 440.
// -----------------------------------------------------------------------------
{
    var sf = getSubfields(field830);
    if ( sf.substr(0,2) != "^a" ) sf = "^a" + sf;  // 440$a es obligatorio
    
    var field440 = createField("440","#0",sf);
    displayField(field440);
    updatePunctuation(field440);
    removeField(field830);
    firstSubfieldBox(field440).focus();
}

// -----------------------------------------------------------------------------
function map100to700(field100)
// Convierte un campo 100 en un 700.
// ATENCION: ¿hay que poner el primer indicador del 245 en 0? ¿Re-Cutter?
// -----------------------------------------------------------------------------
{
    var sf = getSubfields(field100);
    if ( sf.substr(0,2) != "^a" ) sf = "^a" + sf;  // 700$a es obligatorio
    
    var ind = getIndicators(field100).substr(0,1) + "#";
    var field700 = createField("700",ind,sf);
    displayField(field700,field100);  // field100 es el nodo de referencia para ubicar el field700
    updatePunctuation(field700);
    removeField(field100);
    firstSubfieldBox(field700).focus();
}


// -----------------------------------------------------------------------------
function map740to246(field740)
// Convierte un campo 740 en un 246 (variante de título).
// -----------------------------------------------------------------------------
{
    var sf = getSubfields(field740);
    if ( sf.substr(0,2) != "^a" )  sf = "^a" + sf;  // 246$a es obligatorio
    
    var ind = "1#";
    var field246 = createField("246",ind,sf);
    displayField(field246);
    updatePunctuation(field246);
    removeField(field740);
    firstSubfieldBox(field246).focus();
}


// -----------------------------------------------------------------------------
function enhance505(old505,enhance)
// Convierte un campo 505 "basic" en un 505 "enhanced", y viceversa.
//
// TO-DO: según ISBD, el separador es " ; " en lugar de " -- ".
// -----------------------------------------------------------------------------
{
    var sf = getSubfields(old505,"","empty");
    var ind;
    
    if (enhance) {
        sf = sf.replace(/^\^a(\d+)\. /,"^g$1.^t");  // número inicial
        sf = sf.replace(/^\^a/,"^t");
        sf = sf.replace(/ -- (\d+)\. /g," --^g$1.^t");  // números posteriores
        sf = sf.replace(/ \/ /g," /^r").replace(/ -- /g," --^t");
        ind = getIndicators(old505).substr(0,1) + "0";  // preservamos el 1er indicador
    }
    else {
        // change to basic
        sf = "^a" + sf.substr(2).replace(/ \/\^r/g," / ").replace(/ --\^[tg]/g," -- ").replace(/\^t/g," ");
        ind = getIndicators(old505).substr(0,1) + "#";  // preservamos el 1er indicador
    }
    
    var new505 = createField("505",ind,sf);
    displayField(new505,old505);  // old505 es el nodo de referencia para ubicar el new505
    removeField(old505);
    updatePunctuation(new505);
    firstSubfieldBox(new505).focus();
}


// -----------------------------------------------------------------------------
function displayPermanentTitle(uiElement,text,w,h)
// Experimento (para usar con relator codes). La idea es colocar una
// etiqueta que muestre el text oasociado al código, pero que no interfiera
// con el value del textarea.
// -----------------------------------------------------------------------------
{
    var theTitle = document.createElement("span");
    theTitle.className = "permanentTitle";
    theTitle.innerHTML = text;
    uiElement.appendChild(theTitle);
}


// -----------------------------------------------------------------------------
function catalisMessage(msg,button)
// -----------------------------------------------------------------------------
{
    // TO-DO: agregar un parámetro para poder posicionar el cartel (por defecto, centrado)
    //document.getElementById("cartel").style.top = (screen.height - 100)/2.2 + "px";
    //document.getElementById("cartel").style.left = (screen.width - 420)/2 + "px";
    
    document.getElementById("cartel").style.top = (document.documentElement.clientHeight - 100)/2.2 + "px";
    document.getElementById("cartel").style.left = (document.documentElement.clientWidth - 420)/2 + "px";
    document.getElementById("cartelMsg").innerHTML = msg;
    document.getElementById("cartel").style.display = "block";
    if ( button ) {
        document.getElementById("cartelBtn").style.display = "block";
        document.getElementById("cartelBtn").focus();
    }
}

// -----------------------------------------------------------------------------
function mostrarImagen() {
// -----------------------------------------------------------------------------
  if (document.getElementById("miniatura-imagen")) {
    var imageUrl, displayBtn;
    if (f985) {
      var recordId = document.getElementById("marcEditForm").f001.value;
      imageUrl = HTDOCS + "img/" + g_activeDatabase.name + "/" + recordId + "." + f985.substr(4) + "?" + Math.random();
    } else {
      imageUrl = HTDOCS + "img/book-cover-placeholder.jpg";
    }
    document.getElementById("miniatura-imagen").src = imageUrl;
  }
}

// -----------------------------------------------------------------------------
function init()
// Funciones ejecutadas al finalizar la carga de la página principal.
// -----------------------------------------------------------------------------
{
    document.getElementById("cartelMsg").innerHTML += "<br><br>Ejecutando funciones de inicio...";
    loadXML();          // Cargamos los documentos XML
    defineSomeVars();
    setEventHandlers(); // para los elementos estáticos de la interfaz
    disableKeys();      // deshabilitamos algunas combinaciones de teclas (TO-DO: estudiar otras interfaces, e.g. Gmail, a9)
    loadTemplates();    // cargamos las plantillas MARC
    loadLocalTemplateData(); // completamos las plantillas
    setDimensions();    // establecemos algunas dimensiones en base a la resolución de pantalla
    showSearchDiv();    // mostramos pantalla de búsquedas, ocultamos la de edición

    if ( !USE_FIELD_BLOCKS ) {
        var THs = document.getElementById("recordDiv").getElementsByTagName("th");
        for (var i=0; i < THs.length; i++) {
            THs[i].style.display = "none";
        }
    }

    // Objeto popup global (inicialmente oculto)
    if ( window.createPopup ) { // IE
        oPopup = window.createPopup();
    } else {  // Moz
        oPopup = document.createElement("div");
        oPopup.style.display = "none";
        document.body.appendChild(oPopup);
    }

    //document.getElementById("cartel").style.display = "none";

    // Permiso para creación de registros
    var userCanCreate = ( g_activeDatabase.userLevel == 2 || g_activeDatabase.userLevel == 3 );
    document.getElementById("btnNuevo").disabled = !userCanCreate;
    document.getElementById("btnImport").disabled = !userCanCreate;

    document.getElementById("searchResultsIframe").src = SEARCH_RESULTS_IFRAME_SRC;
    document.getElementById("theToolbar").style.visibility = "visible";
}


// -----------------------------------------------------------------------------
function endSession()
// Finaliza la sesión.
// -----------------------------------------------------------------------------
{
    if ( confirm("¿Confirma que desea finalizar la sesión?") ) {
        document.getElementById("logoutForm").submit();
    }
}
