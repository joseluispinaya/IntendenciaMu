
function buscarPropietariopa() {

    //data: JSON.stringify({ Nroci: $("#nrocipropi").val().trim() }),
    $.ajax({
        type: "POST",
        url: "FrmNotificacion.aspx/BuscarPropie",
        data: JSON.stringify({ Nroci: $("#txtNroci").val().trim() }),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        beforeSend: function () {
            // Mostrar overlay de carga antes de enviar la solicitud modal-content
            $("#loaddd").LoadingOverlay("show");
        },
        success: function (response) {
            $("#loaddd").LoadingOverlay("hide");

            if (response.d.Estado) {
                $("#panameprop").text(response.d.Data.Nombres + " " + response.d.Data.Apellidos);
                $("#nrocell").text(response.d.Data.Celular);
                $("#txtIdpopietpa").val(response.d.Data.IdPropietario);

                var iddeProp = parseInt($("#txtIdpopietpa").val());
                if (iddeProp !== 0) {
                    obtenerNotificaciones(iddeProp);
                } else {
                    $("#cardnoti").empty(); // $("#cardnoti").empty();
                }

            } else {
                $("#cardnoti").empty();
                swal("Mensaje", response.d.Mensaje, "warning");
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            $("#loaddd").LoadingOverlay("hide");
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });
}


function obtenerNotificaciones(IdPropi) {
    var request = { IdPropi: IdPropi };

    $.ajax({
        type: "POST",
        url: "FrmNotificacion.aspx/ObtenerListaNotifiId",
        data: JSON.stringify(request),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response.d.Estado) {
                var listaNotifi = response.d.Data;
                var cardContainer = $("#cardnoti");
                cardContainer.empty(); // Limpiar contenido antes de agregar nuevos

                listaNotifi.forEach(function (notificacion) {
                    var activo = notificacion.Activo;
                    var infobgClass = activo ? "info-box bg-success" : "info-box bg-danger";

                    // Estructura del card
                    var cardHtml = `
                        <div class="col-md-3 col-sm-6 col-12 d-flex">
                            <div class="${infobgClass} w-100">
                                <span class="info-box-icon"><i class="far fa-calendar-alt"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text">${notificacion.FechaRegistro}</span>
                                    <span class="info-box-number">${notificacion.Codigo}</span>
                                    <span class="progress-description">
                                        ${notificacion.Usuario.Nombres} ${notificacion.Usuario.Apellidos}
                                    </span>
                                    <button type="button" class="btn btn-primary btn-sm" onclick="VerDatos(${notificacion.IdNotificacion})">
                                        <i class="fa fa-book"></i> Ver detalle
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;

                    cardContainer.append(cardHtml); // Agregamos directamente al contenedor sin crear filas adicionales
                });

            } else {
                swal("Mensaje", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });
}

function obtenerNotificacionesOri(IdPropi) {
    var request = { IdPropi: IdPropi };

    $.ajax({
        type: "POST",
        url: "FrmNotificacion.aspx/ObtenerListaNotifiId",
        data: JSON.stringify(request),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response.d.Estado) {
                var listaNotifi = response.d.Data;
                var cardContainer = $("#cardnoti");
                cardContainer.empty(); // Limpiar contenido antes de agregar nuevos

                var rowDiv = $("<div class='row'></div>");
                cardContainer.append(rowDiv);

                listaNotifi.forEach(function (notificacion, index) {
                    var activo = notificacion.Activo;
                    var infobgClass = activo ? "info-box bg-success" : "info-box bg-danger";

                    // Estructura del card
                    var cardHtml = `
                        <div class="col-md-3 col-sm-6 col-12">
                            <div class="${infobgClass}">
                                <span class="info-box-icon"><i class="far fa-calendar-alt"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text">${notificacion.FechaRegistro}</span>
                                    <span class="info-box-number">${notificacion.Codigo}</span>
                                    <span class="progress-description">
                                        ${notificacion.Usuario.Nombres} ${notificacion.Usuario.Apellidos}
                                    </span>
                                    <button type="button" class="btn btn-primary btn-sm" onclick="VerDatos(${notificacion.IdNotificacion})">
                                        <i class="fa fa-book"></i> Ver detalle
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;

                    rowDiv.append(cardHtml);

                    // Si ya hay 4 notificaciones en la fila, crear una nueva fila
                    if ((index + 1) % 4 === 0) {
                        rowDiv = $("<div class='row'></div>");
                        cardContainer.append(rowDiv);
                    }
                });

            } else {
                swal("Mensaje", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });
}
function VerDatos(idNotificacion) {
    console.log("Ver ID: " + idNotificacion);
}

$('#btnPanelBuscar').on('click', function () {

    if ($("#txtNroci").val().trim() === "") {
        swal("Mensaje", "Ingrese el Nro Ci para Buscar", "warning");
        return;
    }
    buscarPropietariopa();
});