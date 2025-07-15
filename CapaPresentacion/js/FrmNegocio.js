
var table;

$(document).ready(function () {
    cargarPropietariosNeg();

});

//para filtro de propietario

function cargarPropietariosNeg() {

    $("#cboBuscarPropiNe").select2({
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

$("#cboBuscarPropiNe").on("select2:select", function (e) {

    var data = e.params.data.propietario;

    $("#txtnombrepropiet").val(`${data.Nombres} ${data.Apellidos}`);
    $("#txtIdpopieta").val(data.IdPropietario);

    $('#listNego').show(); 

    listaNegocios(data.IdPropietario);

    $("#cboBuscarPropiNe").val("").trigger("change")
    //console.log(data);
});

function listaNegocios(IdPropi) {
    if ($.fn.DataTable.isDataTable("#tbPadrons")) {
        $("#tbPadrons").DataTable().destroy();
        $('#tbPadrons tbody').empty();
    }
    var request = { IdPropi: IdPropi }

    table = $("#tbPadrons").DataTable({
        responsive: true,
        "ajax": {
            "url": 'FrmNegocio.aspx/ObtenerListaNegocios',
            "type": "POST", // Cambiado a POST
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                //console.log("Response from server:", json.d.objeto);
                if (json.d.Estado) {
                    return json.d.Data; // Asegúrate de que esto apunta al array de datos
                } else {
                    return [];
                }
            }
        },
        "columns": [
            { "data": "IdNegocio", "visible": false, "searchable": false },
            { "data": "NombreNegocio" },
            { "data": "Actividad" },
            { "data": "NroPadron" },
            {
                "defaultContent": '<button class="btn btn-primary btn-editar btn-sm"><i class="fas fa-pencil-alt"></i></button>',
                "orderable": false,
                "searchable": false,
                "width": "40px"
            }
        ],
        "order": [[0, "desc"]],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

$('#padronSwitch').change(function () {
    if ($(this).is(':checked')) {
        $('#rowInputPadron').show();       // Mostrar los inputs
        $('#rowImagenPadron').hide();      // Ocultar la imagen
    } else {
        $('#rowInputPadron').hide();       // Ocultar los inputs
        $('#rowImagenPadron').show();      // Mostrar la imagen
        $('#txtnropadron, #txtValidez').val(''); // Limpiar campos
    }
});

function dataRegistrar() {

    const estatus = $('#padronSwitch').is(':checked') ? 1 : 0;

    var modelo = {
        NroPadron: estatus ? $("#txtnropadron").val().trim() : "Sin padron",
        NombreNegocio: $("#txtnombreNeg").val().trim(),
        Actividad: $("#txtactividad").val().trim(),
        Ubicacion: $("#txtDireccion").val().trim(),
        Valides: estatus ? $("#txtValidez").val().trim() : "Sin padron",
        IdPropietario: parseInt($("#txtIdpopieta").val()),
    }

    var request = {
        oNegocio: modelo
    };

    $.ajax({
        type: "POST",
        url: "FrmNegocio.aspx/Guardar",
        data: JSON.stringify(request),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            // Mostrar overlay de carga antes de enviar la solicitud modal-content
            $("#loads").LoadingOverlay("show");
        },
        success: function (response) {
            $("#loads").LoadingOverlay("hide");
            if (response.d.Estado) {
                var iddeProp = parseInt($("#txtIdpopieta").val());

                if (iddeProp !== 0) {
                    $('#listNego').show();
                    listaNegocios(iddeProp);
                } else {
                    $('#listNego').hide();
                }
                swal("Mensaje", response.d.Mensaje, "success");
            } else {
                swal("Mensaje", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $("#loads").LoadingOverlay("hide");
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        },
        complete: function () {
            // Rehabilitar el botón después de que la llamada AJAX se complete (éxito o error)
            $('#btnNuevoReg').prop('disabled', false);
        }
    });
}

$('#btnNuevoReg').on('click', function () {

    // Deshabilitar el botón para evitar múltiples envíos
    $('#btnNuevoReg').prop('disabled', true);

    const inputs = $("input.model").serializeArray();
    const inputs_sin_valor = inputs.filter((item) => item.value.trim() == "")

    if (inputs_sin_valor.length > 0) {
        const mensaje = `Debe completar el campo : "${inputs_sin_valor[0].name}"`;
        toastr.warning("", mensaje)
        $(`input[name="${inputs_sin_valor[0].name}"]`).focus()
        $('#btnNuevoReg').prop('disabled', false);
        return;
    }


    if (parseInt($("#txtIdNegocioc").val()) === 0) {
        dataRegistrar();
    } else {
        swal("Mensaje", "En desarrollo el actualizar", "warning");
        $('#btnNuevoReg').prop('disabled', false);
        //dataActualizar();
    }
})