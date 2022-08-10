<?php

// TODO: validar presencia de parámetros obligatorios

$target_dir = "../img/" . $_POST["database"] . "/";
$imageFileType = $_POST["fileType"];
$target_file = $target_dir . $_POST["recordId"] . "." . $imageFileType;
$deleteOk = 1;
$message = "";

if (unlink($target_file)) {
    $message = "La imagen fue borrada. Recuerde guardar el registro.";
} else {
    $message = "Hubo un error al borrar la imagen.";
    $deleteOk = 0;
}
?>

<html>
<head>
<!-- La respuesta es JavaScript que va a un iframe oculto del diálogo de edición de imágenes -->
<script type="text/javascript">
    function init() {
        var deleteOk = <?php echo $deleteOk ? 'true' : 'false'; ?>;
        var message = "<?php echo $message; ?>";
        if (deleteOk) {
            // Cambios en el diálogo
            var emptyGif = parent.parentWindow.HTDOCS + "img/1x1.gif";
            var dummyCover = parent.parentWindow.HTDOCS + "img/book-cover-placeholder.jpg";
            parent.document.getElementById("imagen-actual").src = emptyGif;
            parent.document.getElementById("submit-borrar").disabled = true;

            // Cambios en el formulario de edición
            parent.parentWindow.document.getElementById("miniatura-imagen").src = dummyCover;

            // Valores que el diálogo devuelve a la ventana principal
            parent.returnValue.status = "imagen-borrada";
        }
        parent.document.getElementById("server-message").innerHTML = message;
    }
    window.onload = init;
</script>
</head>
</html>
