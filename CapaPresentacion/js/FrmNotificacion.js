
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
            } else {
                swal("Mensaje", response.d.Mensaje, "warning");
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            $("#loaddd").LoadingOverlay("hide");
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        }
    });
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