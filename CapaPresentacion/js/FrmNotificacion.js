
function ObtenerFecha() {

    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (('' + day).length < 2 ? '0' : '') + day + '/' + (('' + month).length < 2 ? '0' : '') + month + '/' + d.getFullYear();

    return output;
}

$(document).ready(function () {
    cargarNotificador();
    moment.locale('es');
    $('#txtfechapresent').datetimepicker({
        format: 'L',
        locale: 'es',
        defaultDate: moment()
    });
    //$("#txtfechfin").datepicker({ dateFormat: "dd/mm/yy" });

    $("#txtfechaact").val(ObtenerFecha());


});

function cargarNotificador() {
    const usuarioL = sessionStorage.getItem('usuarioLo');
    if (usuarioL) {
        var usuario = JSON.parse(usuarioL);

        $("#apelliNotiff").text(usuario.Apellidos);
        $("#txtIdnotiifi").val(usuario.IdUsuario);
        $("#fotonotif").attr("src", usuario.ImageFull);

        // Actualizar correo y celular
        $("#correoNoti").html(`<span class="fa-li"><i class="fas fa-lg fa-envelope"></i></span>Correo: ${usuario.Correo}`);
        $("#celularNoti").html(`<span class="fa-li"><i class="fas fa-lg fa-phone"></i></span>Celular: ${usuario.Celular}`);
    } else {
        console.error('No se encontró información del usuario en sessionStorage.');
        window.location.href = 'Login.aspx'; // Redirigir si no hay usuario válido
    }
}

var listaNotifiObj = [];

function obtenerListaNotifiporId(IdPropi) {
    var request = { IdPropi: IdPropi };

    $.ajax({
        type: "POST",
        url: "FrmNotificacion.aspx/ObtenerListaNotifiId",
        data: JSON.stringify(request),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response.d.Estado) {
                listaNotifiObj = response.d.Data;

                var listaNotifi = response.d.Data;
                var countActivo = listaNotifi.filter(n => n.Activo).length;
                let valNotica = Number(countActivo);

                $("#totalnotif a").text(listaNotifi.length);

                var html = '';

                listaNotifi.forEach(function (notificacion) {
                    var fechaRegistro = notificacion.FechaRegistro;
                    var codigo = notificacion.Codigo;
                    var descripcion = notificacion.Descripcion;
                    var idNotificacion = notificacion.IdNotificacion;
                    var activo = notificacion.Activo;

                    var bgClass = activo ? "bg-danger" : "bg-success";
                    var estadoTexto = activo ? "Estado: Activo" : "Estado: Cancelado";

                    html += `
                        <div class="time-label">
                            <span class="${bgClass}">${fechaRegistro}</span>
                        </div>
                        <div>
                            <i class="fas fa-file bg-primary"></i>
                            <div class="timeline-item">
                                <span class="time"><i class="far fa-clock"></i> ${estadoTexto}</span>
                                <h3 class="timeline-header"><a href="#">Código Notificación</a> ${codigo}</h3>
                                <div class="timeline-body">${descripcion}</div>
                                <div class="timeline-footer">
                                    <a href="#" class="btn btn-primary btn-sm" onclick="verDetalle(${idNotificacion})">Ver Detalle</a>
                                    <a href="#" class="btn btn-success btn-sm" onclick="ImprimirNot(${idNotificacion})">Imprimir</a>
                                </div>
                            </div>
                        </div>`;
                });

                $("#UilistNot").html(html); // Insertamos el HTML generado en el contenedor

                if (valNotica >= 2) {
                    swal("Alerta", "El propietario esta por ser clausurado por exeso de notificaciones", "error");
                }

            } else {
                $("#UilistNot").html(""); // Limpia el contenido
                $("#totalnotif a").text("0");
                swal("Mensaje", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $("#totalnotif a").text("0");
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });
}


function buscarPropietario() {

    //data: JSON.stringify({ Nroci: $("#nrocipropi").val().trim() }),
    $.ajax({
        type: "POST",
        url: "FrmNotificacion.aspx/BuscarPropie",
        data: JSON.stringify({ Nroci: $("#nrocipropi").val().trim() }),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        beforeSend: function () {
            // Mostrar overlay de carga antes de enviar la solicitud modal-content
            $("#loaddd").LoadingOverlay("show");
        },
        success: function (response) {
            $("#loaddd").LoadingOverlay("hide");

            if (response.d.Estado) {
                $("#nompropi").text(response.d.Data.Nombres);
                $("#apellpropi").text(response.d.Data.Apellidos);
                $("#txtIdpopiet").val(response.d.Data.IdPropietario);

                var iddeProp = parseInt($("#txtIdpopiet").val());
                if (iddeProp !== 0) {
                    obtenerListaNotifiporId(iddeProp);
                } else {
                    $("#UilistNot").html(""); // Limpia el contenido si el ID es 0
                }

            } else {
                $("#UilistNot").html("");
                $("#totalnotif a").text("0");
                swal("Mensaje", response.d.Mensaje, "warning");
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            $("#loaddd").LoadingOverlay("hide");
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });
}

// Función para manejar el evento de "Ver Afiliados"
function verDetalle(idNotificacion) {
    console.log("Ver ID: " + idNotificacion);
    //var url = 'ReporteAsociaAfi.aspx?id=' + Idasoci;
    //window.open(url, '', 'height=700,width=900,scrollbars=0,location=1,toolbar=0');

    // Por ejemplo, redirigir a otra página:
    // window.location.href = "VerAfiliados.aspx?Idasoci=" + Idasoci;
}

function ImprimirNot(idNotificacion) {

    var url = 'FrmReporteNot.aspx?id=' + idNotificacion;
    //var url = 'FrmReporteNot.aspx?id=' + idNotificacion + '&t=' + new Date().getTime();
    window.open(url, '', 'height=600,width=800,scrollbars=0,location=1,toolbar=0');

    //var notificacion = listaNotifiObj.find(n => n.IdNotificacion === idNotificacion);

    //if (notificacion) {
    //    console.log("Detalles de la Notificación:", notificacion);
    //} else {
    //    console.log("No se encontró la notificación con ID:", idNotificacion);
    //}

}

$('#btnBuscar').on('click', function () {

    if ($("#nrocipropi").val().trim() === "") {
        swal("Mensaje", "Ingrese el Nro Ci para Buscar", "warning");
        return;
    }
    buscarPropietario();
});

function registerDataNotificacion() {

    var request = {
        oNotificacion: {
            IdPropietario: parseInt($("#txtIdpopiet").val()),
            IdUsuario: parseInt($("#txtIdnotiifi").val()),
            Descripcion: $("#txtDescripcion").val(),
            FechaPresencia: $('#txtfechapresent').datetimepicker('date').format('DD/MM/YYYY')
        }
    }

    $.ajax({
        type: "POST",
        url: "FrmNotificacion.aspx/Guardar",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        beforeSend: function () {
            // Mostrar overlay de carga antes de enviar la solicitud modal-content
            $("#loadregi").LoadingOverlay("show");
        },
        success: function (response) {
            $("#loadregi").LoadingOverlay("hide");
            if (response.d.Estado) {
                var iddeProp = parseInt($("#txtIdpopiet").val());

                if (iddeProp !== 0) {
                    obtenerListaNotifiporId(iddeProp);
                } else {
                    $("#UilistNot").html(""); // Limpia el contenido si el ID es 0
                }

                let smss = `${response.d.Mensaje} Id: ${response.d.Valor}`;
                swal("Mensaje", smss, "success");
                //swal("Mensaje", response.d.Mensaje, "success");

            } else {
                swal("Mensaje", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $("#loadregi").LoadingOverlay("hide");
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });
}

$('#btnNuevoRegNot').on('click', function () {

    if (parseInt($("#txtIdpopiet").val()) === 0) {
        swal("Mensaje", "Debe Buscar un Propietario.", "warning")
        return;
    }

    if ($("#txtIdnotiifi").val().trim() === "") {
        swal("Mensaje", "Debe Iniciar sesion no se encontro el notificador", "warning")
        return;
    }

    registerDataNotificacion();

    //var fechaVer = $('#txtfechapresent').datetimepicker('date').format('DD/MM/YYYY');
    //console.log('Fecha seleccionada:', fechaVer);
});