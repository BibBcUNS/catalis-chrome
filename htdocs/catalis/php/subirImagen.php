<?php

// Basado en http://www.w3schools.com/php/php_file_upload.asp

// TODO: validar presencia de database y recordId

// Constantes
define('MAX_FILE_SIZE', 100000);
define('RECOMMENDED_IMG_HEIGHT', 160);
define('TOLERANCE', 10);

$target_dir = "../img/" . $_POST["database"] . "/";
$imageFileType = pathinfo($_FILES["imagenParaSubir"]["name"], PATHINFO_EXTENSION);
$target_file = $target_dir . $_POST["recordId"] . "." . $imageFileType;
$uploadOk = 1;
$message = "";

// Verifica si el archivo es realmente una imagen
if (isset($_POST["submit"])) {
    $imageData = getimagesize($_FILES["imagenParaSubir"]["tmp_name"]);
    if ($imageData !== false) {
        $uploadOk = 1;
    } else {
        $message = "El archivo no es una imagen.";
        $uploadOk = 0;
    }
}

// Verifica el tamaño del archivo
if ($_FILES["imagenParaSubir"]["size"] > MAX_FILE_SIZE) {
    $message = "El archivo es muy grande.";
    $uploadOk = 0;
}

// Verifica que el archivo sea de uno de los formatos permitidos
if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
    $message = "Solo se permiten archivos JPG, JPEG, PNG & GIF.";
    $uploadOk = 0;
}

// Si todo está bien, tratamos de guardar el archivo en su destino
if ($uploadOk == 1) {
    if (move_uploaded_file($_FILES["imagenParaSubir"]["tmp_name"], $target_file)) {
        // $imageSize = getimagesize($target_file);
        $message = "La imagen fue subida";
        $message .= " (" . $imageData[0] . " x " . $imageData[1] . ").";
        if (abs($imageData[1] - RECOMMENDED_IMG_HEIGHT) > TOLERANCE) {
            $message .= "<br>Se recomienda que las miniaturas tengan alrededor de " . RECOMMENDED_IMG_HEIGHT . " px de alto.";
        }
        // $message .= " Recuerde guardar el registro.";
    } else {
        $message = "Hubo un error al subir el archivo.";
        $uploadOk = 0;
    }
}
?>

<html>
<head>
<!-- La respuesta es JavaScript que va a un iframe oculto del diálogo de edición de imágenes -->
<script type="text/javascript">
    function init() {
        var uploadOk = <?php echo $uploadOk ? 'true' : 'false'; ?>;
        var message = "<?php echo $message; ?>";
        var database = "<?php echo $_POST['database']; ?>";
        var recordId = "<?php echo $_POST['recordId']; ?>";
        var fileType = "<?php echo $imageFileType; ?>";
        if (uploadOk) {
            // Cambios en el diálogo
            var imageUrl = parent.parentWindow.HTDOCS + "img/" + database + "/" + recordId  + "." + fileType + "?" + Math.random();
            parent.document.getElementById("imagen-actual").src = imageUrl;
            parent.document.getElementById("imagenParaSubir").value = ""; // FIXME no borra el valor; ver http://stackoverflow.com/questions/1703228/how-can-i-clear-an-html-file-input-with-javascript
            var emptyGif = parent.parentWindow.HTDOCS + "img/1x1.gif";
            parent.document.getElementById("imagen-seleccionada").src = emptyGif;
            parent.document.getElementById("submit-borrar").disabled = false;
            parent.document.getElementById("submit-subir").disabled = true;

            // Cambios en el formulario de edición
            parent.parentWindow.document.getElementById("miniatura-imagen").src = imageUrl;

            // Valores que devuelve el diálogo a la ventana principal
            parent.returnValue.status = "imagen-subida";
            parent.returnValue.fileType = fileType;
        }
        parent.document.getElementById("server-message").innerHTML = message;
    }

    window.onload = init;
</script>
</head>
</html>
