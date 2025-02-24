
var table;

const MODELO_BASE = {
    IdUsuario: 0,
    Nombres: "",
    Apellidos: "",
    Correo: "",
    Users: "",
    Clave: "",
    Celular: "",
    IdRol: 0,
    Activo: true,
    ImageFull: ""
}

$(document).ready(function () {

    dtUsuarios();
    cargarRoles();
})

function dtUsuarios() {
    // Verificar si el DataTable ya está inicializado
    if ($.fn.DataTable.isDataTable("#tbUsuario")) {
        // Destruir el DataTable existente
        $("#tbUsuario").DataTable().destroy();
        // Limpiar el contenedor del DataTable
        $('#tbUsuario tbody').empty();
    }

    table = $("#tbUsuario").DataTable({
        responsive: true,
        "ajax": {
            "url": 'FrmUsuario.aspx/ObtenerUsuario',
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
            { "data": "IdUsuario", "visible": false, "searchable": false },
            {
                "data": "ImageFull", render: function (data) {
                    return `<img style="height:40px" src=${data} class="rounded mx-auto d-block"/>`
                }
            },
            { "data": "Rol.Descripcion" },
            { "data": "Nombres" },
            { "data": "Apellidos" },
            { "data": "Correo" },
            { "data": "Users" },
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
                filename: 'Reporte Usuarios',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6, 7] // Ajusta según las columnas que desees exportar
                }
            },
            'pageLength'
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

async function cargarRoles() {
    $("#cboRol").html(""); // Limpiar antes de cargar

    try {
        let response = await $.ajax({
            type: "POST",
            url: "FrmUsuario.aspx/ObtenerRol",
            contentType: 'application/json; charset=utf-8',
            dataType: "json"
        });

        if (response.d.Estado) {
            response.d.Data.forEach(row => {
                if (row.Activo) {
                    $("<option>").val(row.IdRol).text(row.Descripcion).appendTo("#cboRol");
                }
            });
        }
    } catch (error) {
        console.error("Error en cargarRoles:", error);
    }
}


function mostrarImagenSeleccionada(input) {
    let file = input.files[0];
    let reader = new FileReader();

    reader.onload = (e) => $('#imgUsuarioM').attr('src', e.target.result);
    file ? reader.readAsDataURL(file) : $('#imgUsuarioM').attr('src', "Imagenes/Sinfotop.png");

    let fileName = file ? file.name : 'Ningún archivo seleccionado';
    $(input).next('.custom-file-label-upload').text(fileName);
}

$('#txtFotoS').change(function () {
    mostrarImagenSeleccionada(this);
});

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

//function mostrarModal(modelo = {...MODELO_BASE}, cboEstadoDeshabilitado = true)
function mostrarModal(modelo, cboEstadoDeshabilitado = true) {
    modelo = modelo ?? { ...MODELO_BASE };

    const campos = {
        "txtIdUsuario": modelo.IdUsuario,
        "txtnombres": modelo.Nombres,
        "txtapellidos": modelo.Apellidos,
        "txtCorreo": modelo.Correo,
        "txtUsuario": modelo.Users,
        "txtContra": modelo.Clave,
        "txtCelular": modelo.Celular,
        "cboRol": modelo.IdRol || $("#cboRol option:first").val(),
        "cboEstado": modelo.Activo ? 1 : 0,
    };

    Object.entries(campos).forEach(([id, valor]) => $("#" + id).val(valor));

    $("#imgUsuarioM").attr("src", modelo.ImageFull || "Imagenes/Sinfotop.png");
    $("#cboEstado").prop("disabled", cboEstadoDeshabilitado);
    $("#txtFotoS").val("");
    $(".custom-file-label-upload").text('Ningún archivo seleccionado');

    $("#myLarlLabel").text(cboEstadoDeshabilitado ? "Nuevo Registro" : "Editar Registro");
    $("#modaluser").modal("show");
}

$("#tbUsuario tbody").on("click", ".btn-editar", function (e) {
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

$('#btnNuevoRol').on('click', function () {
    mostrarModal(null, true);
})

function sendDataToServer(request) {
    $.ajax({
        type: "POST",
        url: "FrmUsuario.aspx/Guardar",
        data: JSON.stringify(request),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $(".modal-content").LoadingOverlay("show");
        },
        success: function (response) {
            $(".modal-content").LoadingOverlay("hide");
            if (response.d.Estado) {
                dtUsuarios();
                $('#modaluser').modal('hide');
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

function registerDataAjax() {
    var fileInput = document.getElementById('txtFotoS');
    var file = fileInput.files[0];

    const modelo = structuredClone(MODELO_BASE);
    modelo["IdUsuario"] = parseInt($("#txtIdUsuario").val());
    modelo["Nombres"] = $("#txtnombres").val();
    modelo["Apellidos"] = $("#txtapellidos").val();
    modelo["Correo"] = $("#txtCorreo").val();
    modelo["Users"] = $("#txtUsuario").val();
    modelo["Clave"] = $("#txtContra").val();
    modelo["Celular"] = $("#txtCelular").val();
    modelo["IdRol"] = $("#cboRol").val();

    if (file) {

        var maxSize = 2 * 1024 * 1024; // 2 MB en bytes
        if (file.size > maxSize) {
            swal("Mensaje", "La imagen seleccionada es demasiado grande max 1.5 Mb.", "warning");
            // Rehabilitar el botón si hay un error de validación
            $('#btnGuardarCambios').prop('disabled', false);
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            var arrayBuffer = e.target.result;
            var bytes = new Uint8Array(arrayBuffer);

            var request = {
                oUsuario: modelo,
                imageBytes: Array.from(bytes)
            };

            sendDataToServer(request);
        };

        reader.readAsArrayBuffer(file);
    } else {
        // Si no se selecciona ningún archivo, envía un valor nulo o vacío para imageBytes
        var request = {
            oUsuario: modelo,
            imageBytes: null // o cualquier otro valor que indique que no se envió ningún archivo
        };

        sendDataToServer(request);
    }
}

function sendDataEditToServer(request) {
    $.ajax({
        type: "POST",
        url: "FrmUsuario.aspx/EditarUsuario",
        data: JSON.stringify(request),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $(".modal-content").LoadingOverlay("show");
        },
        success: function (response) {
            $(".modal-content").LoadingOverlay("hide");
            if (response.d.Estado) {
                dtUsuarios();
                $('#modaluser').modal('hide');
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

function editarDataAjaxU() {
    var fileInput = document.getElementById('txtFotoS');
    var file = fileInput.files[0];

    const modelo = structuredClone(MODELO_BASE);
    modelo["IdUsuario"] = parseInt($("#txtIdUsuario").val());
    modelo["Nombres"] = $("#txtnombres").val();
    modelo["Apellidos"] = $("#txtapellidos").val();
    modelo["Correo"] = $("#txtCorreo").val();
    modelo["Users"] = $("#txtUsuario").val();
    modelo["Clave"] = $("#txtContra").val();
    modelo["Celular"] = $("#txtCelular").val();
    modelo["IdRol"] = $("#cboRol").val();
    modelo["Activo"] = ($("#cboEstado").val() == "1" ? true : false);

    if (file) {

        var maxSize = 2 * 1024 * 1024; // 2 MB en bytes
        if (file.size > maxSize) {
            swal("Mensaje", "La imagen seleccionada es demasiado grande max 1.5 Mb.", "warning");
            // Rehabilitar el botón si hay un error de validación
            $('#btnGuardarCambios').prop('disabled', false);
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            var arrayBuffer = e.target.result;
            var bytes = new Uint8Array(arrayBuffer);

            var request = {
                oUsuario: modelo,
                imageBytes: Array.from(bytes)
            };

            sendDataEditToServer(request);
        };

        reader.readAsArrayBuffer(file);
    } else {
        // Si no se selecciona ningún archivo, envía un valor nulo o vacío para imageBytes
        var request = {
            oUsuario: modelo,
            imageBytes: null // o cualquier otro valor que indique que no se envió ningún archivo
        };

        sendDataEditToServer(request);
    }
}

function esCorreoValido(correo) {
    // Expresión regular mejorada para validar correos electrónicos
    var emailRegex = /^[a-zA-Z0-9._%+-ñÑáéíóúÁÉÍÓÚ]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return correo !== "" && emailRegex.test(correo);
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

    var correo = $("#txtCorreo").val().trim();

    if (!esCorreoValido(correo)) {
        toastr.warning("", "Debe ingresar un Correo válido");
        $("#txtCorreo").focus();
        $('#btnGuardarCambios').prop('disabled', false);
        return;
    }


    if (parseInt($("#txtIdUsuario").val()) === 0) {
        //swal("Mensaje", "Guardado.", "success")
        //registerDataAjax();
        registerDataAjax();
    } else {
        //swal("Mensaje", "Falta para Actualizar personal.", "warning")
        editarDataAjaxU();
    }
})

$('#btnReport').on('click', function () {

    var url = 'ReporteCred.aspx';
    window.open(url, '', 'height=700,width=900,scrollbars=0,location=1,toolbar=0');
});