

$(document).ready(function () {
    cargarPropietarios();

});

//para filtro de propietario

function cargarPropietarios() {

    $("#cboBuscarPropi").select2({
        ajax: {
            url: "FrmPropietario.aspx/ObtenerPropietariosFiltro",
            dataType: 'json',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            delay: 250,
            data: function (params) {
                return JSON.stringify({ busqueda: params.term });
            },
            processResults: function (data) {
                //console.log("Datos recibidos:", data.d.objeto);
                return {
                    results: data.d.Data.map((item) => ({
                        id: item.IdPropietario,
                        text: item.Nombres,
                        Apellidos: item.Apellidos,
                        NroCi: item.NroCi,
                        propietario: item
                    }))
                };
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            }
        },
        language: "es",
        placeholder: 'Buscar propietario',
        minimumInputLength: 1,
        templateResult: formatoResultados
    });
}

function formatoResultados(data) {

    var imagenes = "Imagenes/selectlo.jpg";
    // Esto es por defecto, ya que muestra el "buscando..."
    if (data.loading)
        return data.text;

    var contenedor = $(
        `<table width="100%">
            <tr>
                <td style="width:60px">
                    <img style="height:60px;width:60px;margin-right:10px" src="${imagenes}"/>
                </td>
                <td>
                    <p style="font-weight: bolder;margin:2px">${data.text} ${data.Apellidos}</p>
                    <p style="margin:2px">CI: ${data.NroCi}</p>
                </td>
            </tr>
        </table>`
    );

    return contenedor;
}

$(document).on("select2:open", function () {
    document.querySelector(".select2-search__field").focus();

});

$("#cboBuscarPropi").on("select2:select", function (e) {

    var data = e.params.data.propietario;

    $("#panameprop").text(`${data.Nombres} ${data.Apellidos}`);
    $("#nrocell").text(data.Celular);
    $("#txtIdpopietpa").val(data.IdPropietario);
    $("#txtNroci").val(data.NroCi);

    obtenerNotificaciones(data.IdPropietario);

    $("#cboBuscarPropi").val("").trigger("change")
    //console.log(data);
});

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

                    $("#acticoun").text("Activas: 0");
                    $("#noacticoun").text("Canceladas: 0");

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
                                    Ver mas <i class="fas fa-arrow-circle-right"></i>
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
                $("#noacticoun").text("Canceladas: " + countNoActivo);

                let valNotica = Number(countActivo);


                // Generar tarjetas
                listaNotifi.forEach(function (notificacion) {
                    var activo = notificacion.Activo;
                    //var infobgClass = activo ? "info-box bg-success" : "info-box bg-danger";
                    var infobgClass = activo ? "info-box bg-danger" : "info-box bg-success";
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

                if (valNotica >= 3) {
                    swal("Alerta", "El propietario ya tiene un exedente de notificaciones", "error");
                }

            } else {
                // Si la respuesta no es válida, mostrar mensaje vacío
                cardContainer.html(`
                    <div class="col-sm-6 offset-sm-3 col-md-4 offset-md-4">
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
                $("#noacticoun").text("Canceladas: 0");

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
    $("#noacticoun").text("Canceladas: 0");

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

                
                var minus = notificacionData.Propietario.Nombres + " " + notificacionData.Propietario.Apellidos;
                var mayus = minus.toUpperCase();

                var minususu = notificacionData.Usuario.Nombres + " " + notificacionData.Usuario.Apellidos;
                var mayususu = minususu.toUpperCase();

                $("#valorEstado").val(activo ? 1 : 0);

                $("#txtIdNotificaa").val(notificacionData.IdNotificacion);
                $("#propietariod").text(mayus);
                //$("#propietariod").text(notificacionData.Propietario.Nombres + " " + notificacionData.Propietario.Apellidos);
                $("#fechanoti").html(`<span class="fa-li"><i class="fas fa-lg fa-clock"></i></span> Fecha: ${notificacionData.FechaPresencia}`);
                $("#codiNoti").html(`<span class="fa-li"><i class="fas fa-lg fa-envelope"></i></span> Codigo: ${notificacionData.Codigo}`);
                $("#estadono").html(`<span class="fa-li"><i class="fas fa-lg fa-file"></i></span> ${estadoTexto}`);

                //$("#notifidetaa").html(`<b>Notificador: </b> ${notificacionData.Usuario.Nombres} ${notificacionData.Usuario.Apellidos} personal de intendencia`);
                $("#notifidetaa").html(`<b>Notificador: </b> ${mayususu} personal de intendencia`);
                $("#fecharegissn").html(`<span class="fa-li"><i class="fas fa-lg fa-clock"></i></span> Emitido el: ${notificacionData.FechaRegistro}`);

                $("#prebaa").html(`<b>Detalle: </b> ${notificacionData.Descripcion}`);

                /*$("#notificadorn").text(notificacionData.Usuario.Nombres + " " + notificacionData.Usuario.Apellidos);*/

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

//$('#btnPanelBuscar').on('click', function () {

//    buscarPropietariopa();
//});

function cancelarDataNotificacion(idNotifi, estadonoti) {

    const request = { IdNotifi: idNotifi, Activo: estadonoti };

    $.ajax({
        type: "POST",
        url: "FrmNotificacion.aspx/CancelarNotifiMejor",
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

    const idNotifi = Number($("#txtIdNotificaa").val());
    const estadonoti = $("#valorEstado").val() === "1"; // Ya es booleano

    if (idNotifi === 0) {
        return swal("Mensaje", "Debe seleccionar una notificación", "warning");
    }

    if (!estadonoti) {
        return swal("Mensaje", "La Notificación seleccionada ya se encuentra cancelada", "warning");
    }

    cancelarDataNotificacion(idNotifi, estadonoti);

    //if (parseInt($("#txtIdNotificaa").val()) === 0) {
    //    swal("Mensaje", "Debe Seleccionar una notificacion", "warning")
    //    return;
    //}

    //cancelarDataNotificacion();

});