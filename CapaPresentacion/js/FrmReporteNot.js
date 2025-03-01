

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

function CargarDatos(IdNotifi) {

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

function imprSelec(nombre) {
    var printContents = document.getElementById(nombre).innerHTML;
    var newWindow = window.open("", "_blank");
    newWindow.document.write("<html><head><title>Imprimir</title>");
    newWindow.document.write('<link rel="stylesheet" href="dist/css/reportticke.css">');
    newWindow.document.write("</head><body>");
    newWindow.document.write(printContents);
    newWindow.document.write("</body></html>");
    newWindow.document.close();
    setTimeout(function () {
        newWindow.print();
        newWindow.close();
    }, 500);
}

//function hide() {
//    document.getElementById('Imprimir').style.visibility = "hidden";
//}