

var table;

const MODELO_BASE = {
    IdPropietario: 0,
    NroCi: "",
    Nombres: "",
    Apellidos: "",
    Celular: "",
    Activo: true
}

$(document).ready(function () {

    dtPropietarios();
})

function dtPropietarios() {
    // Verificar si el DataTable ya está inicializado
    if ($.fn.DataTable.isDataTable("#tbPropietar")) {
        // Destruir el DataTable existente
        $("#tbPropietar").DataTable().destroy();
        // Limpiar el contenedor del DataTable
        $('#tbPropietar tbody').empty();
    }

    table = $("#tbPropietar").DataTable({
        responsive: true,
        "ajax": {
            "url": 'FrmPropietario.aspx/ObtenerPropietarios',
            "type": "POST", // Cambiado a POST
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function (d) {
                return JSON.stringify(d);
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
            { "data": "IdPropietario", "visible": false, "searchable": false },
            { "data": "NroCi" },
            { "data": "Nombres" },
            { "data": "Apellidos" },
            { "data": "Celular" },
            { "data": "FechaRegistro" },
            {
                "data": "Activo", render: function (data) {
                    if (data == true)
                        return '<span class="badge badge-info">Activo</span>';
                    else
                        return '<span class="badge badge-danger">No Activo</span>';
                }
            },
            {
                "defaultContent": '<button class="btn btn-primary btn-editar btn-sm mr-2"><i class="fas fa-pencil-alt"></i></button>',
                "orderable": false,
                "searchable": false,
                "width": "40px"
            }
        ],
        "order": [[0, "desc"]],
        "dom": "Bfrtip",
        "buttons": [
            {
                text: 'Exportar Excel',
                extend: 'excelHtml5',
                title: '',
                filename: 'Reporte Propietarios',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6] // Ajusta según las columnas que desees exportar
                }
            },
            'pageLength'
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

$.fn.inputFilter = function (inputFilter) {
    return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function (e) { // Captura el evento como 'e'
        if (inputFilter(this.value) || e.key === "Backspace" || e.key === " ") { // se usa 'e' en lugar de 'event'
            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
            this.value = this.oldValue;
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
            this.value = "";
        }
    });
};

$("#txtnombres").inputFilter(function (value) {
    return /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/u.test(value);
});
$("#txtapellidos").inputFilter(function (value) {
    return /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/u.test(value);
});

$("#txtCelular").inputFilter(function (value) {
    return /^\d*$/.test(value) && value.length <= 8;
});

function mostrarModal(modelo, cboEstadoDeshabilitado = true) {
    modelo = modelo ?? { ...MODELO_BASE };

    const campos = {
        "txtIdProp": modelo.IdPropietario,
        "txtNroci": modelo.NroCi,
        "txtnombres": modelo.Nombres,
        "txtapellidos": modelo.Apellidos,
        "txtCelular": modelo.Celular,
    };

    Object.entries(campos).forEach(([id, valor]) => $("#" + id).val(valor));

    $("#myLarlLabel").text(cboEstadoDeshabilitado ? "Nuevo Registro" : "Editar Registro");
    $("#modalpropietario").modal("show");
}

$("#tbPropietar tbody").on("click", ".btn-editar", function (e) {
    e.preventDefault();
    let filaSeleccionada;

    if ($(this).closest("tr").hasClass("child")) {
        filaSeleccionada = $(this).closest("tr").prev();
    } else {
        filaSeleccionada = $(this).closest("tr");
    }

    const model = table.row(filaSeleccionada).data();
    mostrarModal(model, false);
})

$('#btnNuevoPropie').on('click', function () {
    mostrarModal(null, true);
})

function dataRegistrar() {
    const modelo = structuredClone(MODELO_BASE);
    modelo["IdPropietario"] = parseInt($("#txtIdProp").val());
    modelo["NroCi"] = $("#txtNroci").val();
    modelo["Nombres"] = $("#txtnombres").val();
    modelo["Apellidos"] = $("#txtapellidos").val();
    modelo["Celular"] = $("#txtCelular").val();
    modelo["Activo"] = true;

    var request = {
        oPropietario: modelo
    };

    $.ajax({
        type: "POST",
        url: "FrmPropietario.aspx/GurdarPropietario",
        data: JSON.stringify(request),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            // Mostrar overlay de carga antes de enviar la solicitud modal-content
            $(".modal-content").LoadingOverlay("show");
        },
        success: function (response) {
            $(".modal-content").LoadingOverlay("hide");
            if (response.d.Estado) {
                dtPropietarios();
                $('#modalpropietario').modal('hide');
                swal("Mensaje", response.d.Mensaje, "success");
            } else {
                swal("Mensaje", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $(".modal-content").LoadingOverlay("hide");
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        },
        complete: function () {
            // Rehabilitar el botón después de que la llamada AJAX se complete (éxito o error)
            $('#btnGuardarCambios').prop('disabled', false);
        }
    });
}

function dataActualizar() {
    const modelo = structuredClone(MODELO_BASE);
    modelo["IdPropietario"] = parseInt($("#txtIdProp").val());
    modelo["NroCi"] = $("#txtNroci").val();
    modelo["Nombres"] = $("#txtnombres").val();
    modelo["Apellidos"] = $("#txtapellidos").val();
    modelo["Celular"] = $("#txtCelular").val();
    modelo["Activo"] = true;

    var request = {
        oPropietario: modelo
    };

    $.ajax({
        type: "POST",
        url: "FrmPropietario.aspx/ActualizarPropietario",
        data: JSON.stringify(request),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            // Mostrar overlay de carga antes de enviar la solicitud modal-content
            $(".modal-content").LoadingOverlay("show");
        },
        success: function (response) {
            $(".modal-content").LoadingOverlay("hide");
            if (response.d.Estado) {
                dtPropietarios();
                $('#modalpropietario').modal('hide');
                swal("Mensaje", response.d.Mensaje, "success");
            } else {
                swal("Mensaje", response.d.Mensaje, "warning");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $(".modal-content").LoadingOverlay("hide");
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        },
        complete: function () {
            // Rehabilitar el botón después de que la llamada AJAX se complete (éxito o error)
            $('#btnGuardarCambios').prop('disabled', false);
        }
    });
}

$('#btnGuardarCambios').on('click', function () {

    // Deshabilitar el botón para evitar múltiples envíos
    $('#btnGuardarCambios').prop('disabled', true);

    const inputs = $("input.model").serializeArray();
    const inputs_sin_valor = inputs.filter((item) => item.value.trim() == "")

    if (inputs_sin_valor.length > 0) {
        const mensaje = `Debe completar el campo : "${inputs_sin_valor[0].name}"`;
        toastr.warning("", mensaje)
        $(`input[name="${inputs_sin_valor[0].name}"]`).focus()
        $('#btnGuardarCambios').prop('disabled', false);
        return;
    }


    if (parseInt($("#txtIdProp").val()) === 0) {
        dataRegistrar();
    } else {
        dataActualizar();
    }
})