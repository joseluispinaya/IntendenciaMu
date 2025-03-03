
function buscarPropietariopa() {

    var nroCi = $("#txtNroci").val().trim(); // Evitar espacios en blanco

    if (nroCi === "") {
        swal("Mensaje", "Ingrese el Nro CI para buscar", "warning");
        return;
    }

    $.ajax({
        type: "POST",
        url: "FrmNotificacion.aspx/BuscarPropie",
        data: JSON.stringify({ Nroci: nroCi }),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        beforeSend: function () {
            // Mostrar overlay de carga antes de enviar la solicitud
            $("#loaddd").LoadingOverlay("show");
        },
        success: function (response) {
            $("#loaddd").LoadingOverlay("hide");

            if (response.d.Estado) {
                var data = response.d.Data;

                $("#panameprop").text(`${data.Nombres} ${data.Apellidos}`);
                $("#nrocell").text(data.Celular);
                $("#txtIdpopietpa").val(data.IdPropietario);

                var iddeProp = parseInt(data.IdPropietario, 10);

                if (!isNaN(iddeProp) && iddeProp > 0) {
                    obtenerNotificaciones(iddeProp);
                } else {
                    limpiarNotificaciones();
                }
            } else {
                limpiarNotificaciones();
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
            var cardContainer = $("#cardnoti");
            cardContainer.empty(); // Limpiar contenido antes de agregar nuevos

            if (response.d.Estado) {
                var listaNotifi = response.d.Data;

                if (listaNotifi.length === 0) {
                    // Si no hay notificaciones, mostrar el mensaje
                    //<div class="col-sm-4 d-flex justify-content-center">
                    cardContainer.html(`
                        <div class="col-sm-6 offset-sm-3 col-md-4 offset-md-4">
                            <div class="small-box bg-warning text-center">
                                <div class="inner">
                                    <h3>0<sup style="font-size: 20px"> Notificaciones</sup></h3>
                                    <p>Sin notificaciones registrado</p>
                                </div>
                                <div class="icon">
                                    <i class="fas fa-calendar"></i>
                                </div>
                                <a href="#" class="small-box-footer">
                                    More info <i class="fas fa-arrow-circle-right"></i>
                                </a>
                            </div>
                        </div>
                    `);
                    return;
                }

                var { countActivo, countNoActivo } = listaNotifi.reduce((acc, n) => {
                    if (n.Activo) acc.countActivo++;
                    else acc.countNoActivo++;
                    return acc;
                }, { countActivo: 0, countNoActivo: 0 });

                $("#acticoun").text("Activas: " + countActivo);
                $("#noacticoun").text("No Activas: " + countNoActivo);


                // Generar tarjetas
                listaNotifi.forEach(function (notificacion) {
                    var activo = notificacion.Activo;
                    var infobgClass = activo ? "info-box bg-success" : "info-box bg-danger";
                    var estadoTexto = activo ? "Estado: Activo" : "Estado: No Activo";

                    // Estructura del card
                    var cardHtml = `
                        <div class="col-md-3 col-sm-6 col-12 d-flex">
                            <div class="${infobgClass} w-100">
                                <span class="info-box-icon"><i class="far fa-calendar-alt"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text">${notificacion.FechaRegistro}</span>
                                    <span class="info-box-number">Codigo: ${notificacion.Codigo}</span>
                                    <span class="info-box-number">${estadoTexto}</span>
                                    <span class="progress-description">
                                        Not. ${notificacion.Usuario.Nombres}
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
                // Si la respuesta no es válida, mostrar mensaje vacío
                cardContainer.html(`
                    <div class="col-sm-4 d-flex justify-content-center">
                        <div class="small-box bg-warning text-center">
                            <div class="inner">
                                <h3>0<sup style="font-size: 20px"> Notificaciones</sup></h3>
                                <p>Ocurrio un error intente mas tarde</p>
                            </div>
                            <div class="icon">
                                <i class="fas fa-calendar"></i>
                            </div>
                            <a href="#" class="small-box-footer">
                                More info <i class="fas fa-arrow-circle-right"></i>
                            </a>
                        </div>
                    </div>
                `);

                $("#acticoun").text("Activas: 0");
                $("#noacticoun").text("No Activas: 0");

                swal("Mensaje", "Ocurrio un error intente mas tarde", "warning");
                //swal("Mensaje", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });
}

// Función reutilizable para limpiar la sección de notificaciones
function limpiarNotificaciones() {
    $("#cardnoti").empty();
    $("#acticoun").text("Activas: 0");
    $("#noacticoun").text("No Activas: 0");

    $("#txtIdpopietpa").val("0");
    $("#panameprop").text("Nombre Notificado");
    $("#nrocell").text("Nro celular");
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
            var cardContainer = $("#cardnoti");

            if (response.d.Estado) {
                var listaNotifi = response.d.Data;

                var { countActivo, countNoActivo } = listaNotifi.reduce((acc, n) => {
                    if (n.Activo) acc.countActivo++;
                    else acc.countNoActivo++;
                    return acc;
                }, { countActivo: 0, countNoActivo: 0 });

                $("#acticoun").text("Activas: " + countActivo);
                $("#noacticoun").text("No Activas: " + countNoActivo);

                //var cardContainer = $("#cardnoti");
                cardContainer.empty(); // Limpiar contenido antes de agregar nuevos

                // Generar tarjetas
                listaNotifi.forEach(function (notificacion) {
                    var activo = notificacion.Activo;
                    var infobgClass = activo ? "info-box bg-success" : "info-box bg-danger";
                    var estadoTexto = activo ? "Estado: Activo" : "Estado: No Activo";

                    // Estructura del card
                    var cardHtml = `
                        <div class="col-md-3 col-sm-6 col-12 d-flex">
                            <div class="${infobgClass} w-100">
                                <span class="info-box-icon"><i class="far fa-calendar-alt"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text">${notificacion.FechaRegistro}</span>
                                    <span class="info-box-number">Codigo: ${notificacion.Codigo}</span>
                                    <span class="info-box-number">${estadoTexto}</span>
                                    <span class="progress-description">
                                        Not. ${notificacion.Usuario.Nombres}
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
                // Si no hay datos, limpiar los elementos y mostrar 0 en los contadores
                cardContainer.empty();
                $("#acticoun").text("Activas: 0");
                $("#noacticoun").text("No Activas: 0");

                swal("Mensaje", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });
}

function VerDatos(idNotificacion) {
    //console.log("Ver ID: " + idNotificacion);
    CargarDatosDetalle(idNotificacion)
    //$("#modaldetallenotif").modal("show");
}

function CargarDatosDetalle(IdNotifi) {

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
                var activo = notificacionData.Activo;
                var estadoTexto = activo ? "Estado: Activo" : "Estado: No Activo";

                $("#txtIdNotificaa").val(notificacionData.IdNotificacion);
                $("#propietariod").text(notificacionData.Propietario.Nombres + " " + notificacionData.Propietario.Apellidos);
                //$("#descripcionn").text(notificacionData.Descripcion);
                $("#fechanoti").html(`<span class="fa-li"><i class="fas fa-lg fa-file"></i></span> Fecha: ${notificacionData.FechaPresencia}`);
                $("#codiNoti").html(`<span class="fa-li"><i class="fas fa-lg fa-envelope"></i></span> Codigo: ${notificacionData.Codigo}`);
                $("#estadono").html(`<span class="fa-li"><i class="fas fa-lg fa-clock"></i></span> ${estadoTexto}`);

                $("#prebaa").html(`<b>Detalle: </b> ${notificacionData.Descripcion}`);

                $("#notificadorn").text(notificacionData.Usuario.Nombres + " " + notificacionData.Usuario.Apellidos);

                $("#modaldetallenotif").modal("show");
            } else {
                swal("Mensaje", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });

}

$('#btnPanelBuscar').on('click', function () {

    buscarPropietariopa();
});

function cancelarDataNotificacion() {

    var request = {
        IdNotifi: parseInt($("#txtIdNotificaa").val()),
        Activo: false
    };

    $.ajax({
        type: "POST",
        url: "FrmNotificacion.aspx/CancelarNotifi",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        beforeSend: function () {
            // Mostrar overlay de carga antes de enviar la solicitud modal-content
            $(".modal-content").LoadingOverlay("show");
        },
        success: function (response) {
            $(".modal-content").LoadingOverlay("hide");
            if (response.d.Estado) {
                buscarPropietariopa();
                $("#txtIdNotificaa").val("0");
                $('#modaldetallenotif').modal('hide');
                swal("Mensaje", response.d.Mensaje, "success");

            } else {
                swal("Mensaje", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $(".modal-content").LoadingOverlay("hide");
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });
}

$('#btnGuardarCambiosNot').on('click', function () {

    if (parseInt($("#txtIdNotificaa").val()) === 0) {
        swal("Mensaje", "Debe Seleccionar una notificacion", "warning")
        return;
    }

    cancelarDataNotificacion();

});