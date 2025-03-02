

$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const IdNotifi = urlParams.get('id')

    if (IdNotifi !== null) {
        CargarDatos(IdNotifi);
    } else {
        alert("No hay parámetro recibido. El formulario se cerrará.");
        window.close();
    }

    //const IdNotifi = 1;
    //CargarDatos(IdNotifi);
});

async function CargarDatos(IdNotifi) {
    try {
        $.LoadingOverlay("show");

        let response = await $.ajax({
            type: "POST",
            url: "FrmNotificacion.aspx/ReporteNotificacion",
            data: JSON.stringify({ IdNotifi: IdNotifi }),
            contentType: 'application/json; charset=utf-8',
            dataType: "json"
        });

        $.LoadingOverlay("hide");

        if (response.d.Estado) {
            let notificacionData = response.d.Data;
            $("#codigo").text(notificacionData.Codigo);
            $("#descripcion").text(notificacionData.Descripcion);
            $("#fechaPresencia").text(notificacionData.FechaPresencia);
            $("#propietario").text(notificacionData.Propietario.Nombres + " " + notificacionData.Propietario.Apellidos);
            $("#celular").text(notificacionData.Propietario.Celular);
            $("#usuario").text(notificacionData.Usuario.Nombres + " " + notificacionData.Usuario.Apellidos);
        } else {
            alert("Ocurrió un error. El formulario se cerrará.");
            window.close();
        }
    } catch (error) {
        $.LoadingOverlay("hide");
        console.error("Error en la solicitud AJAX:", error);
    }
}
function CargarDatosOrio(IdNotifi) {

    var request = {
        IdNotifi: IdNotifi
    };

    $.ajax({
        type: "POST",
        url: "FrmNotificacion.aspx/ReporteNotificacion",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                var notificacionData = response.d.Data;

                // Llenar los campos del ticket
                $("#codigo").text(notificacionData.Codigo);
                $("#descripcion").text(notificacionData.Descripcion);
                $("#fechaPresencia").text(notificacionData.FechaPresencia);
                $("#propietario").text(notificacionData.Propietario.Nombres + " " + notificacionData.Propietario.Apellidos);
                $("#celular").text(notificacionData.Propietario.Celular);
                $("#usuario").text(notificacionData.Usuario.Nombres + " " + notificacionData.Usuario.Apellidos);
            } else {
                alert("Ocurrió un error. El formulario se cerrará.");
                window.close();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });

}

//function imprSelec(nombre) {
//    var printContents = document.getElementById(nombre).innerHTML;
//    var newWindow = window.open("", "_blank");
//    newWindow.document.write("<html><head><title>Imprimir</title>");
//    newWindow.document.write('<link rel="stylesheet" href="dist/css/reportticke.css">');
//    newWindow.document.write("</head><body>");
//    newWindow.document.write(printContents);
//    newWindow.document.write("</body></html>");
//    newWindow.document.close();
//    setTimeout(function () {
//        newWindow.print();
//        newWindow.close();
//    }, 500);
//}

var ventanaImpresion = null; // Variable global para almacenar la ventana

function imprSelec(nombre) {
    var printContents = document.getElementById(nombre).innerHTML;

    // Si la ventana ya está abierta, reutilizarla
    if (ventanaImpresion && !ventanaImpresion.closed) {
        ventanaImpresion.document.body.innerHTML = printContents; // Actualiza contenido
        ventanaImpresion.focus(); // Trae la ventana al frente
    } else {
        // Abrir una nueva ventana solo si no existe o está cerrada
        ventanaImpresion = window.open("", "_blank", "height=600,width=800");
        ventanaImpresion.document.write("<html><head><title>Comprobante</title>");
        ventanaImpresion.document.write('<link rel="stylesheet" href="dist/css/reportticke.css">');
        ventanaImpresion.document.write("</head><body>");
        ventanaImpresion.document.write(printContents);
        ventanaImpresion.document.write("</body></html>");
        ventanaImpresion.document.close();
    }

    // Espera un poco antes de imprimir
    setTimeout(function () {
        ventanaImpresion.print();

        // Espera un poco más para cerrar después de la impresión
        setTimeout(function () {
            ventanaImpresion.close();
        }, 1000); // Ajusta el tiempo si es necesario

    }, 500);
}

//function hide() {
//    document.getElementById('Imprimir').style.visibility = "hidden";
//}