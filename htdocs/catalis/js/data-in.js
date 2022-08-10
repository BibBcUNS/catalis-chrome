/* =============================================================================
 * data-in.js
 *
 * Funciones encargadas de presentar la informaci�n de los registros
 * en el formulario de edici�n.
 *
 * (c) 2003-2004  Fernando J. G�mez - CONICET - INMABB
 * =============================================================================
 */


// ATENCION: En saved-record.htm hay c�digo que probablemente podr�a reubicarse aqu�.

// -----------------------------------------------------------------------------
function getNewRecordParams()
// Solicita informaci�n necesaria para crear un nuevo registro
// -----------------------------------------------------------------------------
{
    var dWidth = ( screen.width == 800 ) ? 620 : 750;
    var dHeight = ( screen.width == 800 ) ? 290 : 320;
    var dTop =  ( screen.width == 800 ) ? 32 : 120;

    if (ie) {
        var winProperties = "font-size: 10px; dialogWidth: " + dWidth + "px; dialogHeight: " + dHeight + "px; dialogTop: " + dTop + "px; status: no; resizable: yes; help: no";
        var newRecParams = showModalDialog(URL_SELECT_TEMPLATE, null, winProperties);
        if ( "undefined" == typeof(newRecParams) ) {
            return;  // abortamos
        }
        createRecord(newRecParams);
    } else if (moz) {
        openSimDialog(URL_SELECT_TEMPLATE, dWidth, dHeight, createRecord);
        return;
        // La ventana de di�logo le pasa luego el control a createRecord()
    }
}


// -----------------------------------------------------------------------------
function createRecord(newRecParams)
// Prepara el formulario de edici�n para ingresar un nuevo registro
// -----------------------------------------------------------------------------
{
    var templateName = newRecParams[0];
    var aacrText = newRecParams[1];
    if ( "undefined" == typeof(templateName) || "" == templateName )
        return;

    // Aqu� es donde debemos decidir si se ingres� un asiento AACR2 y
    // luego se cancel� la operaci�n
    if ( typeof(aacrText) == "undefined" || aacrText == "" ) {
        showEditDiv();
        var datafields = templates[templateName].datafields.replace(/\n$/,'').split(/\n/);
        renderDatafields(datafields);
    } else {
        // Tenemos un asiento AACR2
        var marc = aacr2marc(aacrText);
        var fieldList = marc.datafields;

        var dataFields = "";
        for (var i=0; i < fieldList.length; i++) {
            var tag = fieldList[i].substr(0,3);
            var ind = fieldList[i].substr(4,2);
            var subfields = fieldList[i].substr(7);
            //createField(tag,ind,subfields);
            dataFields += tag + " " + ind + subfields + "\n";
        }

        // Ofrecemos la ventana de edici�n avanzada para corregir etiquetas inv�lidas
        var fieldsRendered = rawEdit(dataFields,true);
        if ( !fieldsRendered ) return;
    }

    //showEditDiv();
    selectedSubfieldBox = null;
    selectedField = null;

    var form = document.getElementById("marcEditForm");

    // recordID
    form.recordID.value = "New"; // �Es necesario?

    // Leader
    var leaderData = templates[templateName].leader;
    renderLeader(leaderData);

    // Control fields (00x)
    form.f001.value = "[pendiente]";
    form.f003.value = "";
    form.f005.value = "";
    form.f005_nice.value = "";
    form.f006.value = "";
    form.f007.value = "";
    form.f008_00_05.value = "######";
    form.f008_00_05_nice.value = "";
    form.createdBy.value = "";
    var materialType = getMaterialType(leaderData.substr(1,1), leaderData.substr(2,1));
    renderField008(templates[templateName].f008, materialType);

    // C�digos adicionales: 041, 044, 046, 047
    // (En base a la presencia de �stos, "encender" los respectivos botones)

    // Post-it note, vac�a
    postItNote = "";
    document.getElementById("postItNoteBtn").style.backgroundColor = "";
    document.getElementById("postItNoteBtn").title = "";

    // Record OK, false
    //form.recordOK.checked = false;
    //form.recordOK.parentNode.className = "recordNotOK";

    // Ejemplares, cero
    ejemplares = [];
    /*if ( document.getElementById("cantEjemplares") ) {
        document.getElementById("cantEjemplares").innerHTML = "0";
    }*/
    if ( document.getElementById("ejemplaresBtn") ) {
        document.getElementById("ejemplaresBtn").style.backgroundColor = "";
    }

  // Tipo de archivo de imagen
  f985 = "";
  mostrarImagen();

  // Etiquetas generadas
  f993 = "";

    // Original record state = el contenido de la plantilla
    originalRecord = serializeRecord(true,true,true,true);

    // Buttons
    document.getElementById("btnGrabar").disabled = false;
    document.getElementById("btnGrabar").style.backgroundImage = "url('" + HTDOCS + "img/stock_save-16.png')";
    document.getElementById("btnBorrar").disabled = true;

    // Ocultamos el navegadorcito de la lista de resultados
    document.getElementById("resultNavigation_block").style.visibility = "hidden";

    // Foco al primer subcampo del primer campo
    //var container = document.getElementById("recordContainer");
    //firstSubfieldBox(container.firstChild).focus();

    // Foco al subcampo 245$a
    setTimeout('firstSubfieldBox(document.getElementById("field245")).focus()',50);

    // ATENCION: en la plantilla de CD-ROM, cuyo primer campo de datos es
    // el 245, el foco se coloca "a medias" (i.e. no tenemos cursor). El loop
    // parece remediar el problema s�lo ocasionalmente. El timeout ser� mejor?
}


// -----------------------------------------------------------------------------
function showRecordInForm(receivedRecord)
// Presenta en el formulario de edici�n los datos del registro recibido
// desde el servidor (via hiddenIFRAME).
//
// TO-DO: para minimizar el riesgo de que se "mezclen" dos registros, en
// caso de que el nuevo registro no termine de presentarse de manera normal
// en el formulario, �deber�amos dejar completamente en blanco el formulario
// antes de comenzar con el display?
// -----------------------------------------------------------------------------
{
    showEditDiv();

    selectedSubfieldBox = null;
    selectedField = null;

    var form = document.getElementById("marcEditForm");

    //form.mfn.value = receivedRecord.mfn;
    form.recordID.value = receivedRecord.f001;

    // Datafields
    renderDatafields(receivedRecord.datafields.split(/\n/));

    // Leader
    renderLeader(receivedRecord.leader);

    // Control fields (00x)
    form.f001.value = receivedRecord.f001;
    form.f003.value = receivedRecord.f003;

    form.f005.value = receivedRecord.f005;
    form.f005_nice.value = receivedRecord.f005.substr(6,2) + " "
    form.f005_nice.value += MONTH_NAME[receivedRecord.f005.substr(4,2)] + " ";
    form.f005_nice.value += receivedRecord.f005.substr(0,4) + ", ";
    form.f005_nice.value += receivedRecord.f005.substr(8,2) + ":";
    form.f005_nice.value += receivedRecord.f005.substr(10,2);

    form.f006.value = receivedRecord.f006;
    form.f007.value = receivedRecord.f007;

    form.f008_00_05.value = receivedRecord.f008.substr(0,6);

    var century = ( receivedRecord.f008.substr(0,2) > 66 ) ? "19" : "20";

    form.f008_00_05_nice.value = receivedRecord.f008.substr(4,2) + " ";
    form.f008_00_05_nice.value += MONTH_NAME[receivedRecord.f008.substr(2,2)] + " ";
    form.f008_00_05_nice.value += century + receivedRecord.f008.substr(0,2);

    form.createdBy.value = " " + receivedRecord.createdBy;
    var leader06 = receivedRecord.leader.substr(1,1);
    var leader07 = receivedRecord.leader.substr(2,1);
    var materialType = getMaterialType(leader06, leader07);
    renderField008(receivedRecord.f008, materialType);

    // C�digos adicionales: 041, 044, 046, 047
    // (En base a la presencia de �stos, "encender" los respectivos botones)

    // Existencias
    ejemplares = receivedRecord.ejemplares;
    /*if ( document.getElementById("cantEjemplares") ) {
        document.getElementById("cantEjemplares").innerHTML = ejemplares.length;
    }*/
    if ( document.getElementById("ejemplaresBtn") ) {
        document.getElementById("ejemplaresBtn").style.backgroundColor = ( ejemplares.length > 0 ) ? HOLDINGS_BGCOLOR : "";
    }

    // Post-it note
    postItNote = receivedRecord.postItNote;
    document.getElementById("postItNoteBtn").style.backgroundColor = ( postItNote != "" ) ? POSTITNOTE_BGCOLOR : "";
    document.getElementById("postItNoteBtn").title = ( postItNote != "" ) ? postItNote.substr(2).replace(/\^\w/g,"\n\n") : "";

    // Record OK
    //form.recordOK.checked = (receivedRecord.OK == "OK");
    //form.recordOK.parentNode.className = (receivedRecord.OK == "OK") ? "recordOK" : "recordNotOK";

  // Tipo de archivo de imagen
  f985 = receivedRecord.f985;
  mostrarImagen();

  // Etiquetas generadas
  f993 = receivedRecord.f993;

    // Save original record state
    originalRecord = serializeRecord(true,true,true,true);

    // Buttons
    var userCanWrite = ( g_activeDatabase.userLevel == 3 || ( g_activeDatabase.userLevel == 2 && g_currentUser == receivedRecord.createdBy ) );
    document.getElementById("btnGrabar").disabled = !userCanWrite;
    // TO-DO: usar una imagen adecuada para el bot�n deshabilitado.
    document.getElementById("btnGrabar").style.backgroundImage = "url('" + HTDOCS + "img/" + (userCanWrite ? "stock_save-16.png" : "") + "')";
    document.getElementById("btnBorrar").disabled = !userCanWrite;

    // T�tulo de la ventana
    refreshTitleBar();

    // Navegadorcito de la lista de resultados
    var totalResults = resultSet.length;
    document.getElementById("resultSetCounter").value = g_editResultIndex + "/" + totalResults;
    document.getElementById("btnPrevResult").disabled = ( 1 == g_editResultIndex );
    document.getElementById("btnNextResult").disabled = ( totalResults == g_editResultIndex );
    document.getElementById("btnPrevResult").style.backgroundImage = ( 1 == g_editResultIndex ) ? "url('" + HTDOCS + "img/1x1.gif')" : "url('" + HTDOCS + "img/left.gif')";
    document.getElementById("btnNextResult").style.backgroundImage = ( totalResults == g_editResultIndex ) ? "url('" + HTDOCS + "img/1x1.gif')" : "url('" + HTDOCS + "img/right.gif')";

    // Quitamos el cartel de "Solicitando el registro..."
    document.getElementById("cartel").style.display = "none";

    // Foco al primer subcampo del campo 245
    setTimeout('firstSubfieldBox(document.getElementById("field245")).focus()',100);
}


// -----------------------------------------------------------------------------
function showRecordDetails(receivedRecord)
// Presenta en la pantalla de b�squedas los detalles del registro recibido
// desde el servidor v�a IFRAME.
// El estilo de visualizaci�n depende de la variable global g_RecordDisplayStyle,
// que fue seteada por la funci�n que hizo la petici�n del registro al servidor.
// -----------------------------------------------------------------------------
{
    var recordDisplayStyle = g_RecordDisplayStyle;
    if ( "etiq" != recordDisplayStyle ) {
        var marcDatafields = receivedRecord.datafields.split(/\n/);
    }

    document.getElementById("marcDisplayDiv").style.display = "none";
    document.getElementById("aacrDisplayDiv").style.display = "none";
    document.getElementById("etiqDisplayDiv").style.display = "none";
    document.getElementById("postItNoteDiv").style.display = "none";
    document.getElementById(recordDisplayStyle + "DisplayDiv").style.display = "block";

    // Botones
    document.getElementById("aacrDisplayBtn").disabled = "";
    document.getElementById("marcDisplayBtn").disabled = "";
    document.getElementById("etiqDisplayBtn").disabled = "";
    document.getElementById("editRecordBtn").disabled = "";

    document.getElementById("aacrDisplayBtn").style.backgroundColor = "";
    document.getElementById("marcDisplayBtn").style.backgroundColor = "";
    document.getElementById("etiqDisplayBtn").style.backgroundColor = "";
    document.getElementById("postItNoteDisplayBtn").style.backgroundColor = "";

    document.getElementById(recordDisplayStyle + "DisplayBtn").style.backgroundColor = DISPLAY_STYLE_BGCOLOR;

    switch (recordDisplayStyle) {
        case "marc" :
            var leader = receivedRecord.leader;  // ATENCION: mejorar esto
            var f001 = receivedRecord.f001;
            var f003 = receivedRecord.f003;
            var f005 = receivedRecord.f005;
            var f006 = receivedRecord.f006;
            var f007 = receivedRecord.f007;
            var f008 = receivedRecord.f008;
            var ejemplares = receivedRecord.ejemplares;
            var postItNote = receivedRecord.postItNote;
            var recordDisplay = marc2marcTagged(leader, f001, f003, f005, f006, f007, f008, marcDatafields, ejemplares, postItNote);
            break;
        case "aacr" :
            var ejemplares = receivedRecord.ejemplares;
            var f001 = receivedRecord.f001;
            var f005 = receivedRecord.f005;
            var f008 = receivedRecord.f008;
            var leader06 = receivedRecord.leader.substr(1,1);
            var leader07 = receivedRecord.leader.substr(2,1);
            var materialType = getMaterialType(leader06,leader07);
            var imageFileType = receivedRecord.f985.substr(4);  // FG, 2017/09/01
            var recordDisplay = marc2aacr(materialType,f001,f005,f008,marcDatafields,ejemplares,imageFileType);
            break;
        case "etiq" :
            var recordDisplay = receivedRecord.etiq;
            break;
        case "postItNote" :
            var recordDisplay = receivedRecord.postItNote.replace(/\n/g,"<br>");
            break;
    }

    var container = document.getElementById(recordDisplayStyle + "DisplayDiv");
    container.innerHTML = recordDisplay;

    // Deshabilitamos links *internos* (pensados para el OPAC)
    var linksArray = container.getElementsByTagName("a");
    for (var i=0; i < linksArray.length; i++) {
        if ( linksArray[i].href.indexOf("IsisScript") > 0 ) {
            linksArray[i].onclick = function() {return false};
        }
    }


    // Dejamos el recordID cargado en el form, por si luego se hace un submit desde
    // uno de los botones de abajo (AACR/MARC)
    document.getElementById("hiddenFORM").recordID.value = receivedRecord.f001;

    // Habilitamos el bot�n Anotaciones s�lo si hay anotaciones    
    document.getElementById("postItNoteDisplayBtn").disabled = ( "" == receivedRecord.postItNote );

    // Quitamos el cartel de "Solicitando registro"
    document.getElementById("cartel").style.display = "none";

    // try-catch, pues a veces tenemos un error al no estar disponible el elemento donde
    // se quiere poner el foco
    /*try {
        document.getElementById(recordDisplayStyle + "DisplayDiv").focus();
    }
    catch(err) {}*/

    // Cambiamos el try-catch por este setTimeout (JS & DHTML Cookbook) - Mozilla no lo acepta
    //setTimeout('document.getElementById("' + recordDisplayStyle + 'DisplayDiv").focus()',0);

    // ATENCION: hay que forzar un scroll up --> �focus en un elemento invisible?
}


// -----------------------------------------------------------------------------
function showDictionaryKeys(dictionaryKeys,reverse)
// Presenta un listado de t�rminos del diccionario.
//
// TO-DO: desactivar el bot�n "Anteriores" ("Siguientes") cuando ya se est�
// viendo el primer (�ltimo) t�rmino del diccionario.
// -----------------------------------------------------------------------------
{
    document.getElementById("indexTerms").innerHTML = "";

    // Bot�n "Anteriores"
    // TO-DO: omitir bot�n cuando se llega al comienzo del diccionario
    var newButton = document.createElement("button");
    newButton.id = "prevKeysBtn";
    newButton.className = "marcEditButton";
    newButton.style.margin = "4px 50px";
    newButton.style.border = "1px solid #AAA";
    newButton.style.width = "9em";
    newButton._term = dictionaryKeys[0].key;  // custom attribute
    newButton.onclick = function() {
        updateDictionaryList(this._term,"reverse");
    }
    var newImg = document.createElement("img");
    newImg.src = HTDOCS + "img/up.gif";
    newImg.align = "top";
    newButton.appendChild(newImg);
    var newText = document.createTextNode("Anteriores");
    newButton.appendChild(newText);
    document.getElementById("indexTerms").appendChild(newButton);

    // Tabla con la lista de t�rminos
    var newTable = document.createElement("table");
    newTable.cellSpacing = 0;
    newTable.cellPadding = 2;
    newTable.width = 250;
    newTable.style.fontSize = "12px";
    newTable.style.borderTop = "1px dotted #999";
    newTable.style.borderBottom = "1px dotted #999";

    var newTbody = document.createElement("tbody");

    for (var i=0; i < dictionaryKeys.length; i++) {
        var newRow = document.createElement("tr");
        newRow.id = "dictKeyRow" + i;
        var rowClass = (i % 2 == 0) ? "evenRow" : "oddRow";
        newRow.className = rowClass;

        var newCell = document.createElement("td");
        newCell.style.paddingLeft = "3px";
        newCell.style.paddingRight = "3px";
        newCell.align = "right";
        newCell.width = "20";
        newCell.valign = "top";
        var newText = document.createTextNode(dictionaryKeys[i].postings);
        newCell.appendChild(newText);
        newRow.appendChild(newCell);

        var newCell = document.createElement("td");
        newCell.style.fontWeight = "bold";
        newCell.style.paddingLeft = "3px";

        var newLink = document.createElement("a");
        newLink.href = "#";
        newLink.style.color = INDEXTERM_COLOR;
        newLink.title = dictionaryKeys[i].key;
        newLink._index = i;  // custom attribute
        newLink.onclick = function() {
            searchFromDictionary(this.title,this._index);
            return false;
        }
        //var initialUpperCase = (dictionaryKeys[i].key.substr(0,1) == "~") ? 2 : 1;
        //var displayKey = dictionaryKeys[i].key.substr(0,initialUpperCase) + dictionaryKeys[i].key.substr(initialUpperCase).toLowerCase();
        var displayKey = dictionaryKeys[i].key;
        var newText = document.createTextNode(displayKey);
        newLink.appendChild(newText);
        newCell.appendChild(newLink);
        newRow.appendChild(newCell);
        newTbody.appendChild(newRow);
    }
    newTable.appendChild(newTbody);
    document.getElementById("indexTerms").appendChild(newTable);

    // Bot�n "Siguientes"
    // TO-DO: omitir bot�n cuando se llega al final del diccionario
    var newButton = document.createElement("button");
    newButton.id = "nextKeysBtn";
    newButton.className = "marcEditButton";
    newButton.style.margin = "4px 50px";
    newButton.style.border = "1px solid #AAA";
    newButton.style.width = "9em";
    newButton._term = dictionaryKeys[i-1].key;  // custom attribute
    newButton.onclick = function() {
        updateDictionaryList(this._term);
    }
    var newImg = document.createElement("img");
    newImg.src = HTDOCS + "img/down.gif";
    newImg.align = "top";
    newButton.appendChild(newImg);
    var newText = document.createTextNode("Siguientes");
    newButton.appendChild(newText);
    document.getElementById("indexTerms").appendChild(newButton);

    // Quitamos el cartel de "Solicitando t�rminos..."
    document.getElementById("cartel").style.display = "none";

    // ATENCION: ubicar el foco en el lugar m�s apropiado (arriba o abajo)
    // (uno para forzar un scroll, y otro para facilitar el uso del teclado)
    /*if ( "On" == reverse ) {
        document.getElementById("nextKeysBtn").focus();
    }
    else {
        document.getElementById("prevKeysBtn").focus();
    }*/
    document.getElementById("prevKeysBtn").focus();
    document.getElementById("indexTerms").focus();  // no vale en Mozilla
}


// -----------------------------------------------------------------------------
function duplicateRecord()
// Crea una copia (local) del registro activo.
// -----------------------------------------------------------------------------
{
    showEditDiv();

    var form = document.getElementById("marcEditForm");

    // recordID
    form.recordID.value = "New";

    // Leader
    form.L_05.value = "n";

    // Control fields (00x)
    form.f001.value = "[duplicado]";
    form.f003.value = "";
    form.f005.value = "";
    form.f005_nice.value = "";
    form.f006.value = "";
    form.f007.value = "";
    form.f008_00_05.value = "######";
    form.f008_00_05_nice.value = "";
    form.createdBy.value = "";

    // C�digos adicionales: 041, 044, 046, 047
    // (En base a la presencia de �stos, "encender" los respectivos botones)

    // Post-it note (se deja igual?)
    postItNote = "";
    document.getElementById("postItNoteBtn").style.backgroundColor = "";
    document.getElementById("postItNoteBtn").title = "";

    // Record OK: false
    //form.recordOK.checked = false;
    //form.recordOK.parentNode.className = "recordNotOK";

    // Ejemplares: cero
    ejemplares = [];
    /*if ( document.getElementById("cantEjemplares") ) {
        document.getElementById("cantEjemplares").innerHTML = "0";
    }*/
    if ( document.getElementById("ejemplaresBtn") ) {
        document.getElementById("ejemplaresBtn").style.backgroundColor = "";
    }

  // Tipo de archivo de imagen
  f985 = "";
  mostrarImagen();

  // Etiquetas generadas
  f993 = "";

    // Original record state = empty (not saved yet)
    originalRecord = "*";

    // Buttons
    document.getElementById("btnGrabar").disabled = false;
    document.getElementById("btnGrabar").style.backgroundImage = "url('" + HTDOCS + "img/stock_save-16.png')";
    document.getElementById("btnBorrar").disabled = true;

    // Ocultamos el navegadorcito de la lista de resultados
    document.getElementById("resultNavigation_block").style.visibility = "hidden";

    // Foco al primer subcampo del primer campo
    var container = document.getElementById("recordContainer_description");
    firstSubfieldBox(container.firstChild).focus();

    // Cartelito
    catalisMessage(document.getElementById("registroDuplicado").innerHTML, true);
    //setTimeout('document.getElementById("cartel").style.display = "none"',3000);
}



// -----------------------------------------------------------------------------
function renderDatafields(datafields)
// Presenta en el formulario los campos de datos de un registro MARC, recibidos
// en el array 'datafields'.
//
// TO-DO: El jueguito con visibility es para evitar una "demora" si se mostrara
// campo por campo. Pero en registros largos, sucede que queda un tiempo
// apreciable el cuadro en blanco.
// Buscar otra soluci�n que use un nodo (TBODY?) temporal (?)
// -----------------------------------------------------------------------------
{
    var recordContainer = [];
    if ( USE_FIELD_BLOCKS ) {
        recordContainer[0] = document.getElementById("recordContainer_description");
        recordContainer[1] = document.getElementById("recordContainer_access");
        recordContainer[2] = document.getElementById("recordContainer_subject");
        recordContainer[3] = document.getElementById("recordContainer_other");
    } else {
        recordContainer[0] = document.getElementById("recordContainer_noblocks");
    }

    // Limpiamos el container de campos de datos
    for (var i=0; i < recordContainer.length; i++) {
        if ( recordContainer[i].hasChildNodes() ) {
            removeAllChildNodes(recordContainer[i]);
        }
    }

    var standardNumbers = [];
    var titleVariants = [];
    //container.style.visibility = "hidden";

    for (var i=0; i < datafields.length; i++) {
        var tag = datafields[i].substr(0,3);

        //if ( tag.search(/9[01].|008|859|981/) != -1 ) continue; // campos especiales

        var ind = datafields[i].substr(4,2);
        var subfields = datafields[i].substr(7);   //.replace(REGEX_SYSTEM_SUBFIELD_DELIMITER,"$");

        // Posponemos el display de los campos 020 & 022,
        // [y de aquellos 246 que sean estrictamente puntos de acceso -- suspendido.]
        // y de los 246, sean o no puntos de acceso.
        if ( USE_FIELD_BLOCKS ) {
            if ( tag.search(/020|022/) != -1 ) {
                standardNumbers.push(datafields[i]);
                continue;
            } else {
                var tag_ind = tag + "_" + ind;
                if ( tag_ind.search(/246_../) != -1 ) {
                    titleVariants.push(datafields[i]);
                    continue;
                }
            }
        }

        var container = recordContainer[0];
        if ( USE_FIELD_BLOCKS ) {
            var fieldBlock = getFieldBlockName(tag);
            container = document.getElementById("recordContainer_" + fieldBlock);
        }

        var newField = createField(tag,ind,subfields);
        container.appendChild(newField);

    }

    // Para que los n�meros normalizados (i.e. Area 8, campos 020 & 022) aparezcan
    // al final de la descripci�n, los retenemos en un array auxiliar, y reci�n
    // al final los ubicamos en el formulario.
    for (var i=0; i < standardNumbers.length; i++) {
        var tag = standardNumbers[i].substr(0,3);
        var ind = standardNumbers[i].substr(4,2);
        var subfields = standardNumbers[i].substr(7);
        var newField = createField(tag,ind,subfields);
        recordContainer[0].appendChild(newField);
    }

    // Hacemos algo similar con los campos 246 que s�lo generan puntos de acceso.
    for (var i=0; i < titleVariants.length; i++) {
        var tag = "246";
        var ind = titleVariants[i].substr(4,2);
        var subfields = titleVariants[i].substr(7);
        var newField = createField(tag,ind,subfields);
        recordContainer[1].appendChild(newField);
    }

    //container.style.visibility = "visible";

    // Foco al primer subcampo del primer campo
    //firstSubfieldBox(recordContainer[0].firstChild).focus();
    // TO-DO: al crear registros desde una plantilla, �el foco deber�a ir
    // inicialmente al 245$a ? Se puede hacer configurable.

    // Para Mozilla: intentamos ajustar altura de textareas.
    if (moz) {
        var subfieldBoxes = document.getElementById("recordDiv").getElementsByTagName("textarea");
        for (var i=0; i < subfieldBoxes.length; i++) {
            subfieldBoxes[i].style.height = 1;
            subfieldBoxes[i].style.height = subfieldBoxes[i].scrollHeight;
        }
    }
}


// -----------------------------------------------------------------------------
function renderLeader(leaderData)
// leaderData: s�lo los 8 elementos que nos interesan (05,06,07,08,09,17,18,19)
// -----------------------------------------------------------------------------
{
    var form = document.getElementById("marcEditForm");
    form.L_05.value = leaderData.substr(0,1);
    form.L_06.value = leaderData.substr(1,1);
    form.L_07.value = leaderData.substr(2,1);
    form.L_08.value = leaderData.substr(3,1);
    form.L_09.value = leaderData.substr(4,1);
    form.L_17.value = leaderData.substr(5,1);
    form.L_18.value = leaderData.substr(6,1);
    form.L_19.value = leaderData.substr(7,1);

    var myPath = "/" + "/dataElement[@pos='L_06']/option[@code='" + form.L_06.value + "']";
    if (ie) {
        form.L_06.title = xmlData.xmlFixedField.selectNodes(myPath)[0].getAttribute("name");
    } else if (moz) {
        form.L_06.title = xmlData.xmlFixedField.evaluate(myPath,xmlData.xmlFixedField,null,9,null).singleNodeValue.getAttribute("name");
    }
    //form.L_06.style.cursor = "help";

    var myPath = "/" + "/dataElement[@pos='L_07']/option[@code='" + form.L_07.value + "']";
    if (ie) {
        form.L_07.title = xmlData.xmlFixedField.selectNodes(myPath)[0].getAttribute("name");
    } else if (moz) {
        form.L_07.title = xmlData.xmlFixedField.evaluate(myPath,xmlData.xmlFixedField,null,9,null).singleNodeValue.getAttribute("name");
    }
    //form.L_07.style.cursor = "help";

}


// -----------------------------------------------------------------------------
function renderField008(f008,materialType)
// -----------------------------------------------------------------------------
{
    var form = document.getElementById("marcEditForm");
    form.f008_06.value = f008.substr(6,1);
    form.f008_07_10.value = f008.substr(7,4);
    form.f008_11_14.value = f008.substr(11,4);
    form.f008_15_17.value = f008.substr(15,3);
    form.f008_35_37.value = f008.substr(35,3);
    form.f008_38.value = f008.substr(38,1);
    form.f008_39.value = f008.substr(39,1);

    var typeList = ["BK", "VM", "MU", "CF", "CR", "MP", "MIX"];
    for (var i=0; i < typeList.length; i++) {
        document.getElementById("f008" + typeList[i]).style.display = "none";
    }

    switch (materialType) {
        case "BK" :
            document.getElementById("f008BK").style.display = "block";
            form.f008_BK_18_21.value = f008.substr(18,4);
            form.f008_BK_22.value = f008.substr(22,1);
            form.f008_BK_23.value = f008.substr(23,1);
            form.f008_BK_24_27.value = f008.substr(24,4);
            form.f008_BK_28.value = f008.substr(28,1);
            form.f008_BK_29.value = f008.substr(29,1);
            form.f008_BK_30.value = f008.substr(30,1);
            form.f008_BK_31.value = f008.substr(31,1);
            form.f008_BK_33.value = f008.substr(33,1);
            form.f008_BK_34.value = f008.substr(34,1);
            break;

        case "VM" :
            document.getElementById("f008VM").style.display = "block";
            form.f008_VM_18_20.value = f008.substr(18,3);
            form.f008_VM_22.value = f008.substr(22,1);
            form.f008_VM_28.value = f008.substr(28,1);
            form.f008_VM_29.value = f008.substr(29,1);
            form.f008_VM_33.value = f008.substr(33,1);
            form.f008_VM_34.value = f008.substr(34,1);
            break;

        case "MU" :
            document.getElementById("f008MU").style.display = "block";
            form.f008_MU_18_19.value = f008.substr(18,2);
            form.f008_MU_20.value = f008.substr(20,1);
            form.f008_MU_21.value = f008.substr(21,1);
            form.f008_MU_22.value = f008.substr(22,1);
            form.f008_MU_23.value = f008.substr(23,1);
            form.f008_MU_24_29.value = f008.substr(24,6);
            form.f008_MU_30_31.value = f008.substr(30,2);
            form.f008_MU_33.value = f008.substr(33,1);
            break;

        case "CF" :
            document.getElementById("f008CF").style.display = "block";
            form.f008_CF_22.value = f008.substr(22,1);
            form.f008_CF_26.value = f008.substr(26,1);
            form.f008_CF_28.value = f008.substr(28,1);
            break;

        case "CR" :
            document.getElementById("f008CR").style.display = "block";
            form.f008_CR_18.value = f008.substr(18,1);
            form.f008_CR_19.value = f008.substr(19,1);
            //form.f008_CR_20.value = f008.substr(20,1);  // obsolete (2003)
            form.f008_CR_21.value = f008.substr(21,1);
            form.f008_CR_22.value = f008.substr(22,1);
            form.f008_CR_23.value = f008.substr(23,1);
            form.f008_CR_24.value = f008.substr(24,1);
            form.f008_CR_25_27.value = f008.substr(25,3);
            form.f008_CR_28.value = f008.substr(28,1);
            form.f008_CR_29.value = f008.substr(29,1);
            form.f008_CR_33.value = f008.substr(33,1);
            form.f008_CR_34.value = f008.substr(34,1);
            break;

        case "MP" :
            document.getElementById("f008MP").style.display = "block";
            form.f008_MP_18_21.value = f008.substr(18,4);
            form.f008_MP_22_23.value = f008.substr(22,2);
            form.f008_MP_25.value = f008.substr(25,1);
            form.f008_MP_28.value = f008.substr(28,1);
            form.f008_MP_29.value = f008.substr(29,1);
            form.f008_MP_31.value = f008.substr(31,1);
            form.f008_MP_33_34.value = f008.substr(33,2);
            break;

        case "MIX" :
            document.getElementById("f008MIX").style.display = "block";
            form.f008_MIX_23.value = f008.substr(23,1);
            break;
    }


    // Field 008 tooltips

    var myPath, tooltip;

    myPath = "/" + "/dataElement[@pos='f008_06']/option[@code='" + form.f008_06.value + "']";
    try {
        tooltip = form.f008_06.value + " : " + xmlData.xmlFixedField.selectNodes(myPath)[0].getAttribute("name");
        document.getElementById("TD_f008_06").title = tooltip;
    }
    catch (err) {
        document.getElementById("TD_f008_06").title = "";
    }

    myPath = "/" + "/country[@code='" + form.f008_15_17.value + "']";
    try {
        tooltip = form.f008_15_17.value + " : " + xmlData.xmlCountryCodes.selectNodes(myPath)[0].getAttribute("name");
        document.getElementById("TD_f008_15_17").title = tooltip;
    }
    catch (err) {
        document.getElementById("TD_f008_15_17").title = "";
    }

    myPath = "/" + "/language[@code='" + form.f008_35_37.value + "']";
    try {
        tooltip = form.f008_35_37.value + " : " + xmlData.xmlLanguageCodes.selectNodes(myPath)[0].getAttribute("name");
        document.getElementById("TD_f008_35_37").title = tooltip;
    }
    catch(err) {
        document.getElementById("TD_f008_35_37").title = "";
    }

    // TO-DO: colocar los tooltips para los elementos restantes
}

