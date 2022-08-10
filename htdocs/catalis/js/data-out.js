/* =============================================================================
 * data-out.js
 *
 * Funciones encargadas de generar los distintos tipos de salidas a
 * partir del registro bibliográfico activo.
 *
 * (c) 2003  Fernando J. Gómez - CONICET - INMABB
 * =============================================================================
 */


// -----------------------------------------------------------------------------
function padWithZeros(num, totalLength)
// Rellena num con ceros a la izquierda, hasta completar totalLength posiciones
// -----------------------------------------------------------------------------
{
    var dummy;
    dummy = "00000".substr(0,totalLength).concat(num);   // ATENCION: ¿concat() no es standard?
    dummy = dummy.substr(dummy.length-totalLength,totalLength);
    return dummy;
}


// -----------------------------------------------------------------------------
function invalidChars(subfield)
// Detecta caracteres que no son admisibles en un subcampo.
// -----------------------------------------------------------------------------
{
    var invalidChars = "";
    for (var i=0; i < subfield.length; i++) {
        if ( subfield.charCodeAt(i) < 32 ) {
            invalidChars = subfield.charCodeAt(i);
            break;
        }
    }
    return invalidChars;
}


// -----------------------------------------------------------------------------
function serialize008(materialType)
// Construye el campo 008 a partir de los datos esparcidos por el formulario
// -----------------------------------------------------------------------------
{
    var form = document.getElementById("marcEditForm");
    var f008 = "";
    var f008ByType = "";
    f008 += form.f008_00_05.value;
    // Registro nuevo: asignamos fecha de creación ==> esto debe hacerse en el servidor
    //<field action="replace" tag="9800"><pft>if a(v9800) then s(date)*2.6 fi</pft></field>
    f008 += form.f008_06.value;
    f008 += form.f008_07_10.value;
    f008 += form.f008_11_14.value;
    f008 += form.f008_15_17.value;

    switch (materialType) {
        case "BK" :
            f008ByType = form.f008_BK_18_21.value + form.f008_BK_22.value + form.f008_BK_23.value
                       + form.f008_BK_24_27.value + form.f008_BK_28.value + form.f008_BK_29.value
                       + form.f008_BK_30.value + form.f008_BK_31.value + "#" + form.f008_BK_33.value
                       + form.f008_BK_34.value;
            break;
        case "MU" :
            f008ByType = form.f008_MU_18_19.value + form.f008_MU_20.value + form.f008_MU_21.value
                       + form.f008_MU_22.value + form.f008_MU_23.value + form.f008_MU_24_29.value
                       + form.f008_MU_30_31.value + "#" + form.f008_MU_33.value + "#";
            break;
        case "CR" :
            f008ByType = form.f008_CR_18.value + form.f008_CR_19.value + "#"
                       + form.f008_CR_21.value + form.f008_CR_22.value + form.f008_CR_23.value
                       + form.f008_CR_24.value + form.f008_CR_25_27.value + form.f008_CR_28.value
                       + form.f008_CR_29.value + "###" + form.f008_CR_33.value + form.f008_CR_34.value;
            break;
        case "VM" :
            f008ByType = form.f008_VM_18_20.value + "#" + form.f008_VM_22.value + "#####"
                       + form.f008_VM_28.value + form.f008_VM_29.value + "###" + form.f008_VM_33.value
                       + form.f008_VM_34.value;
            break;
        case "CF" :
            f008ByType = "####" + form.f008_CF_22.value + "###" + form.f008_CF_26.value + "#"
                       + form.f008_CF_28.value + "######";
            break;
        case "MP" :
            f008ByType = form.f008_MP_18_21.value + form.f008_MP_22_23.value + "#"
                       + form.f008_MP_25.value + "##" + form.f008_MP_28.value + form.f008_MP_29.value
                       + "#" + form.f008_MP_31.value + "#" + form.f008_MP_33_34.value;
            break;
        case "MIX" :
            f008ByType = "#####" + form.f008_MIX_23.value + "###########";
            break;
        default :
            alert("Error: materialType=" + materialType);
            break;
    }
    f008 += f008ByType;
    f008 += form.f008_35_37.value;
    f008 += form.f008_38.value;
    f008 += form.f008_39.value;
    //f008 += "#d";
    return f008;
}


// -----------------------------------------------------------------------------
function serializeRecord(leader, controlFields, dataFields, localData)
// Los parámetros son variables booleanas.
// -----------------------------------------------------------------------------
{
    var form = document.getElementById("marcEditForm");
    var marcFields = "";

    if ( leader ) {
        // Datos del leader
        marcFields += "\n905 " + form.L_05.value;
        marcFields += "\n906 " + form.L_06.value;
        marcFields += "\n907 " + form.L_07.value;
        marcFields += "\n908 " + form.L_08.value;
        marcFields += "\n909 " + form.L_09.value;
        marcFields += "\n917 " + form.L_17.value;
        marcFields += "\n918 " + form.L_18.value;
        marcFields += "\n919 " + form.L_19.value;
    }

    if ( controlFields ) {
        // Campo 001
        // Si el registro es nuevo, lo debe asignar el servidor. Si el registro
        // ya está en la base, el servidor conserva el campo 001 ya presente.

        // Campo 003 ??

        // Campo 005 --> a cargo del servidor

        // Campo 006
        var f006 = form.f006.value;
        if ( f006 != "" ) {
            f006 = f006.split(/~/);
            for (var i=0; i < f006.length; i++) {
                marcFields += "\n006 " + f006[i];
            }
        }

        // Campo 007
        var f007 = form.f007.value;
        if ( f007 != "" ) {
            f007 = f007.split(/~/);
            for (var i=0; i < f007.length; i++) {
                marcFields += "\n007 " + f007[i];
            }
        }

        // Campo 008
        var materialType = getMaterialType(form.L_06.value,form.L_07.value);
        var f008 = serialize008(materialType);
        marcFields += "\n008 " + f008;
    }

    // Campos de datos
    var fieldContainers = getDatafields();
    for (var i=0; i < fieldContainers.length; i++) {
        var subfields = getSubfields(fieldContainers[i]).replace(/ \.(?=\^|$)/g,".");
        if ( subfields.search(REGEX_EMPTY_SUBFIELD) == -1 ) {  // Ignoramos campos sin datos
            var tag = fieldContainers[i].tag;
            var ind = getIndicators(fieldContainers[i]);
            /*
            if ( tag.search(/245|440/) != -1 ) {
                // remove non sorting delimiters
                subfields = subfields.replace(/[{}]/g,"");
            }
            */
            if ( invalidChars(subfields) != "" ) {
                alert("El campo " + tag + " contiene caracteres no aceptables (código ASCII = " + invalidChars(subfields) + "). Debe quitarlos para poder continuar.\n\nPosible explicación: si usted copió y pegó texto procedente de alguna fuente externa, asegúrese de que en el mismo no queden caracteres de tabulación o saltos de línea.");
                return false;
            } else {
                marcFields += "\n" + tag + " " + ind + subfields;
            }
        }
    }

    if ( localData ) {
        // Ejemplares
        var attr = [];
        attr = [
                {code : "3", label : "parte"},
                {code : "a", label : "institucion"},
                {code : "b", label : "coleccion"},
                {code : "c", label : "precio"},
                {code : "d", label : "donante"},
                {code : "e", label : "instCanje"},
                {code : "f", label : "datestamp"},
                {code : "h", label : "STclase"},
                {code : "i", label : "STlibristica"},
                {code : "j", label : "motivoBaja"},
                {code : "k", label : "STprefijo"},
                {code : "l", label : "donacion"},
                {code : "n", label : "notaBibliog"},
                {code : "o", label : "orden"},
                {code : "p", label : "inventario"},
                {code : "q", label : "estadoFisico"},
                /*{code: "r", label : "isCopy"},*/
                {code : "s", label : "proveedor"},
                {code : "t", label : "numeroEj"},
                {code : "u", label : "userID"},
                {code : "v", label : "STvolumen"},
                {code : "w", label : "fechaBaja"},
                /*{code : "x", label : "notaInterna"},*/
                {code : "y", label : "fechaAdq"}/*,
                {code : "z", label : "notaPublica"}*/
               ];
        for (var i=0; i < ejemplares.length; i++) {
            var subfields = "";
            for (var j=0; j < attr.length; j++) {
                subfields += "^" + attr[j].code + ejemplares[i][attr[j].label];
            }
            // Eliminamos subcampos vacíos
            subfields = subfields.replace(/\^\w(?=\^|$)/g,"");
            marcFields += "\n859 ##" + subfields;

            // ATENCION: eliminar motivoBaja cuando la baja no fue confirmada
        }

        // 980: PostIt note
        if ( postItNote != "" ) {
            marcFields += "\n980 " + postItNote.replace(/\r?\n/g,"\\r\\n");
            // ATENCION: \r\n solo en Windows?
        }

        // 981: Estado del registro
        /*if ( form.recordOK.checked ) {
            marcFields += "\n981 OK";
        }*/

        // 985: Tipo de archivo de imagen
        if (window.f985 && f985 != "") {
          marcFields += "\n985 " + f985;
        }

        // 991: Identificación del catalogador que creó el registro
        // ATENCION: a los efectos de decidir si un registro ha sido modificado,
        // este dato no es relevante!
        marcFields += ( form.createdBy.value != "" )
                     ? "\n991 " + form.createdBy.value.replace(/\s|\[|\]/g,"")
                     : "\n991 " + form.userid.value;

        // 991: Identificación del catalogador
        //marcFields += "\n991 " + form.userid.value;

        // 993: Etiquetas generadas -- para base bibima
        // FG, 11 nov. 2015
        if ( window.f993 && f993 != "" ) {
            marcFields += "\n993 " + f993;
        }
    }

    return marcFields.replace(/^\n/,"");  // quitamos salto de línea inicial
}


// -----------------------------------------------------------------------------
function buildISO2709()
// Devuelve leader, directory, fields.
//
// TO-DO: agregar campos 001, 003, 005, 006, 007 -- Reemplazar # por space
// -----------------------------------------------------------------------------
{
    var form = document.getElementById("marcEditForm");

    // Creamos un array con un elemento para cada campo
    var fields = [];
    var materialType = getMaterialType(form.L_06.value,form.L_07.value);
    var f008 = serialize008(materialType).replace(/#/g," ");    //TO-DO: corregir pos. 00-05

    fields.push("008 " + f008);
    var fieldContainers = getDatafields();
    for (var i=0; i < fieldContainers.length; i++) {
        var subfields = getSubfields(fieldContainers[i]).replace(/ \.(?=\^|$)/g,".");
        if ( subfields.search(REGEX_EMPTY_SUBFIELD) == -1 ) {  // Ignoramos campos sin datos
            var tag = fieldContainers[i].tag;
            var ind = getIndicators(fieldContainers[i]).replace(/#/g," ");
            /*
            if ( "245" == tag ) {  // remove non sorting delimiters
                subfields = subfields.replace(/[{}]/g,"");
            }
            */
            fields.push(tag + " " + ind + subfields);
        }
    }
    //alert("fields :" + fields);
    var startPos = "00000";
    var directory = [];
    var body = "";
    for (var i=0; i < fields.length; i++) {
        var tag = fields[i].substr(0,3);
        var fieldValue = fields[i].substr(4).replace(REGEX_SYSTEM_SUBFIELD_DELIMITER, ISO_SUBFIELD_DELIMITER);
        var fieldLength = padWithZeros(fieldValue.length + 1,4);
        directory.push(tag.concat(fieldLength, startPos));  // 3 + 4 + 5  // ATENCION: concat() no es standard?
        body += fieldValue + ISO_FIELD_TERMINATOR;
        startPos = padWithZeros(parseFloat(startPos) + parseFloat(fieldLength), 5);
    }

    // Ordenamos el directorio por tag.
    // "Order of entries.  Directory entries for control fields precede entries for data fields.
    // Entries for control fields are sequenced by tag in increasing numerical order.
    // Entries for data fields are arranged in ascending order according to the first character
    // of the tag, with numeric characters preceding alphabetic characters."
    // Fuente: http://www.loc.gov/marc/specifications/specrecstruc.html#direct
    function directorySort(d1,d2) {
        var firstChar1 = d1.substr(0,1);
        var firstChar2 = d2.substr(0,1);
        if ( firstChar1 == "0" && firstChar2 == "0" )
            return d1.substr(0,3) - d2.substr(0,3);   // both control fields --> use complete tag
        else
            return d1.substr(0,1) - d2.substr(0,1);   // both data fields, or mixed --> use 1st character
    }
    directory = directory.sort(directorySort);

    directory = directory.join("");  // conversión de Array a String

    directory += ISO_FIELD_TERMINATOR;
    body += ISO_RECORD_TERMINATOR;

    // Leader components
    var recordLength = padWithZeros(24 + directory.length + body.length,5);
    var recordStatus = form.L_05.value;
    var recordType = form.L_06.value;
    var bibLevel = form.L_07.value;
    var controlType = form.L_08.value;
    var codingScheme = form.L_09.value;
    var baseDataAddress = padWithZeros(24 + directory.length,5);
    var encLevel = form.L_17.value;
    var descCatalForm = form.L_18.value;
    var linkReq = form.L_19.value;

    var leader = recordLength + recordStatus + recordType + bibLevel
               + controlType + codingScheme + "22" + baseDataAddress
               + encLevel + descCatalForm + linkReq + "4500";
    leader = leader.replace(/#/g," ");

    //alert(leader + "\n\n" + directory + "\n\n" + body);

    var isoRecord = new Object();
    isoRecord.leader = leader;
    isoRecord.directory = directory;
    isoRecord.body = body;

    return isoRecord;
}


// -----------------------------------------------------------------------------
function exportRecord()
// Abre una ventana en la cual presenta el registro ISO2709 construido
// a partir del registro actual.
// -----------------------------------------------------------------------------
{
    var isoRecord = buildISO2709();
    var isoString = isoRecord.leader + isoRecord.directory + isoRecord.body;
    var winProperties = "width=400, height=280, top=120, left=100, resizable=yes, scrollbars=yes, menubar=yes";
    newWin = window.open("", "", winProperties);
    newWin.focus();

    //newWin.document.write("<title>Exportación de registros</title>");
    //newWin.document.write("<pre>" + isoString + "</pre>");

    // Queremos mostrar solo ASCII, y no HTML, de modo que se
    // pueda usar el File->Save del browser para guardar el registro

    /*var newPRE = document.createElement("pre");
    newWin.document.body.appendChild(newPRE);
    newPRE.innerHTML = isoString;
    return;*/

    // ATENCION: es importante el orden de las dos líneas siguientes
    newWin.document.write('<h1 style="font-size: 110%;">Exportación del registro</h1>');
    newWin.document.write('<p>Para utilizarlo en otra aplicación, seleccione y copie el contenido del área coloreada.</p>');
    newWin.document.write('<textarea rows="8" cols="40" style="background: #FED;">' + isoString + '</textarea>');
    newWin.document.title = "Exportación";

    //newWin.document.body.style.fontFamily = "'courier new', monospace";

    // TO-DO: usar para el title el número de registro
    // Deshabilitar line-wrap?
}


// -----------------------------------------------------------------------------
function viewRecord()
// Presenta una ventana con la ficha AACR2 y la lista de campos MARC
// -----------------------------------------------------------------------------
{
    // 1. Construcción de la ficha

    var fieldContainers = getDatafields();
    var marcDatafields = [];
    for (var i=0; i < fieldContainers.length; i++) {
        var subfields = getSubfields(fieldContainers[i]).replace(/ \.(?=\^|$)/g,".");
        if ( subfields.search(REGEX_EMPTY_SUBFIELD) == -1 ) {    // Ignoramos campos sin datos
            var tag = fieldContainers[i].tag;
            var ind = getIndicators(fieldContainers[i]);
            /*
            if ( tag.search(/245|440/) != -1 ) {    // remove non sorting delimiters
                subfields = subfields.replace(/[{}]/g,"");
            }
            */
            marcDatafields.push(tag + " " + ind + subfields);
        }
    }

    var form = document.getElementById("marcEditForm");
    var f001 = form.f001.value;
    var f005 = form.f005.value;
    var materialType = getMaterialType(form.L_06.value,form.L_07.value);
    var f008 = serialize008(materialType);

    var fichaHTML = marc2aacr(materialType,f001,f005,f008,marcDatafields,ejemplares);


    // 2. Construcción de la lista de campos MARC

    var form = document.getElementById("marcEditForm");
    var leader = form.L_05.value + form.L_06.value + form.L_07.value + form.L_08.value + form.L_09.value + form.L_17.value + form.L_18.value + form.L_19.value;
    var f001 = form.f001.value;
    var f003 = form.f003.value;
    var f005 = form.f005.value;
    var f006 = form.f006.value;
    var f007 = form.f007.value;
    var materialType = getMaterialType(form.L_06.value,form.L_07.value);
    var f008 = serialize008(materialType);
    var marcTagged = marc2marcTagged(leader, f001, f003, f005, f006, f007, f008, marcDatafields, ejemplares, postItNote);


    // Capturamos el error que se produce al usar la referencia a la ventana cuando ésta ya fue cerrada
    try {
        var tmp = modelessWin.document;
    }
    catch(err) {
        displayWindowClosed = true;
    }

    // Creamos la ventana
    if ( displayWindowClosed ) {
        var dialogHeight = 350;
        var dialogWidth = 660;
        var winProperties = "dialogHeight: " + dialogHeight + "px; ";
        winProperties += "dialogWidth: " + dialogWidth + "px; ";
        winProperties += "dialogTop: 25px; ";
        //winProperties += "dialogLeft: " + (screen.width - 553) + "px; ";
        winProperties += "resizable: yes; scroll: yes; status: no; help: no";
        //alert(winProperties);
        modelessWin = showModalDialog(URL_RECORD_VISUALIZATION, window, winProperties);
        displayWindowClosed = false;
    }

    // Este loop es para librarnos del error al abrir la ventanita por primera vez
    var popupOK = false;
    while( !popupOK ) {
        try {
            var tmp = modelessWin.document.getElementById("aacrDiv").innerHTML;
            popupOK = true;
        }
        catch (err) {   // Sólo se ejecuta si se produjo un error
            popupOK = false;
        }
    }


    // Actualizamos el contenido de la ventana
    modelessWin.document.getElementById("aacrDiv").innerHTML = fichaHTML;
    modelessWin.document.getElementById("chkAccess").checked = true;
    modelessWin.document.getElementById("chkDescription").checked = true;
    modelessWin.document.getElementById("marcDiv").innerHTML = marcTagged;
    modelessWin.document.getElementById("chkSubfieldSplit").checked = false;

    // Y ajustamos su altura, para que se aprecie mejor el contenido.
    updateDialogHeight(modelessWin);
}


// -----------------------------------------------------------------------------
function saveRecord()
// Envía el registro al servidor para su grabación.
// -----------------------------------------------------------------------------
{
    // Sólo grabamos si hubo alguna modificación
    if ( !modifiedRecord() ) {
        var msg = "El registro no ha sido modificado, y por lo tanto no es necesario volver a grabarlo.";
        catalisMessage(msg,true);
        return;
    }

    // Llamamos a una función de validación
    var msg = marcValidate();
    if ( msg != "" ) {
        msg = "Hay algunos problemas con este registro: <ol>" + msg + "</ol>";
        catalisMessage(msg,true);
        return;
    }

    var marcFields = serializeRecord(true,true,true,true);
    //alert(marcFields);
    if ( !marcFields ) {  // en caso de que haya caracteres no válidos
        alert("Error en saveRecord()");
        return;
    }

    var form = document.getElementById("hiddenFORM");
    form.marcFields.value = marcFields;

    form.recordID.value = document.getElementById("marcEditForm").f001.value;
    form.tarea.value = "GRABAR_REG";
    form.method = "POST";  // method="GET" genera errores, como es de esperar
    form.target = "hiddenIFRAME";
    //form.debug = "1";

    var message = "DATOS QUE SE ENVIAN PARA SER GRABADOS<p>\nNúmero de registro: " + form.recordID.value;
    message += "<div id='dataToBeSaved'><pre>" + form.marcFields.value + "</pre></div>";

    // suspendemos el cuadro de confirmación (FG, 06/sep/2005)
    // lo volvemos a activar, ya que de lo contrario se pueden llegar a grabar datos en forma accidental (FG, 16/sep/2005)
    if ( !catalis_confirm(message,640,460) ) {
        return false;
    }

    // Cartelito
    catalisMessage(document.getElementById("grabandoRegistro").innerHTML);

    form.submit();
}
