
var table;
let jsPDFInstance; // Variable global para jsPDF

function ObtenerFechaA() {
    const d = new Date();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
}

function ObtenerFechaIa() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (('' + month).length < 2 ? '0' : '') + month + '/' + (('' + day).length < 2 ? '0' : '') + day + '/' + d.getFullYear();

    return output;
}

$(document).ready(function () {
    const { jsPDF } = window.jspdf;
    if (typeof jsPDF !== 'undefined') {
        jsPDFInstance = jsPDF; // Guarda la referencia de jsPDF
    } else {
        console.error("jsPDF no está cargado.");
    }

    $.datepicker.setDefaults($.datepicker.regional["es"])
    //$("#txtFechaInicio").datepicker({ dateFormat: "mm/dd/yy" });
    //$("#txtFechaFin").datepicker({ dateFormat: "mm/dd/yy" });

    $("#txtFechaInicio").datepicker({ dateFormat: "dd/mm/yy" });
    $("#txtFechaFin").datepicker({ dateFormat: "dd/mm/yy" });

    //$("#txtFechaInicio").val(ObtenerFechaIa());
    //$("#txtFechaFin").val(ObtenerFechaIa());

    $("#txtFechaInicio").val(ObtenerFechaA());
    $("#txtFechaFin").val(ObtenerFechaA());

    listaNotifiFechas();
    listaUsuariosRpt();
});

function listaNotifiFechas() {
    if ($.fn.DataTable.isDataTable("#tbNotiff")) {
        $("#tbNotiff").DataTable().destroy();
        $('#tbNotiff tbody').empty();
    }
    var request = {
        fechainicio: $("#txtFechaInicio").val(),
        fechafin: $("#txtFechaFin").val()
    };

    table = $("#tbNotiff").DataTable({
        responsive: true,
        "ajax": {
            "url": 'FrmReportNotifi.aspx/NotificacionesRpt',
            "type": "POST", // Cambiado a POST
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                //console.log("Response from server:", json.d.Data);
                if (json.d.Estado) {
                    return json.d.Data; // Asegúrate de que esto apunta al array de datos
                } else {
                    return [];
                }
            },
            "beforeSend": function () {
                $("#cargann").LoadingOverlay("show");
            },
            "complete": function () {
                $("#cargann").LoadingOverlay("hide");
            }
        },
        "columns": [
            { "data": "Codigo" },
            { "data": "Estado" },
            { "data": "FechaRegistro" },
            { "data": "NombrePropietario" },
            { "data": "NombreUsuario" }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

$('#btnBuscar').on('click', function () {

    listaNotifiFechas();

})

function listaUsuariosRpt() {
    $.ajax({
        type: "POST",
        url: "FrmReportNotifi.aspx/ObtenerUsuarioComple",
        data: {},
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            if (response.d.Estado) {
                var datos = response.d.Data;
                console.log(datos);

                // Limpiamos el contenedor por si hay datos previos
                $("#listarz").empty();

                // Recorremos la lista y generamos el HTML
                datos.forEach(function (usuario) {
                    var cardHtml = `
                    <div class="col-md-4">
                        <div class="card card-widget widget-user">
                            <div class="widget-user-header bg-info">
                                <h3 class="widget-user-username">${usuario.Nombres} ${usuario.Apellidos}</h3>
                                <h5 class="widget-user-desc">${usuario.Rol.Descripcion}</h5>
                            </div>
                            <div class="widget-user-image">
                                <img class="img-circle elevation-2" src="${usuario.ImageFull}" alt="User Avatar">
                            </div>
                            <div class="card-footer">
                                <div class="row">
                                    <div class="col-sm-6 border-right">
                                        <div class="description-block">
                                            <h5 class="description-header">${usuario.NumeroNoti}</h5>
                                            <span class="description-text">NOTIFICACIONES</span>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="description-block">
                                            <a class="btn btn-app bg-success">
                                                <i class="fas fa-users"></i>Ver
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;

                    // Agregamos al contenedor
                    $("#listarz").append(cardHtml);
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

function getBase64Image(imgUrl, callback) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';  // Permite cargar imágenes de otras fuentes si es necesario
    img.src = imgUrl;

    img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');  // Convierte a base64
        callback(dataURL);
    };
}

function generarPDFechas() {
    if (jsPDFInstance) {
        var imgUrl = "../Imagenes/reportemuc.png"; // Ruta de tu imagen
        var fecini = $("#txtFechaInicio").val();
        var fefin = $("#txtFechaFin").val();
        var tituloR = "REPORTE DE: " + fecini + " HASTA: " + fefin;
        getBase64Image(imgUrl, function (base64Img) {
            // Llama a cargarDatosReporteIA para obtener los datos
            cargarDatosReporteIA(function (notificaciones) {
                const doc = new jsPDFInstance({
                    orientation: 'landscape',
                    unit: 'pt',
                    format: 'legal'
                });

                // Agrega la imagen de membrete
                doc.addImage(base64Img, 'PNG', 220, 28, 567, 57);

                // Agrega el título dinámico
                doc.setFontSize(14);  // Ajusta el tamaño del título
                doc.setFont("helvetica", "bold");  // Cambia la fuente y estilo si deseas
                doc.text(tituloR, doc.internal.pageSize.getWidth() / 2, 110, { align: "center" });

                //doc.text("Este es un PDF generado en orientación horizontal", 28, 113);
                // Posición Y inicial para las asociaciones, ajustada después del título
                //let currentY = 130;
                let currentY = 150; // Posición Y inicial
                doc.setFontSize(12);

                // Crea una tabla con los datos directamente
                doc.autoTable({
                    startY: currentY,
                    head: [['Código', 'Estado', 'Fecha Registro', 'Propietario', 'Notificador']],
                    body: notificaciones.map(n => [
                        n.Codigo,
                        n.Estado,
                        n.FechaRegistro,
                        n.NombrePropietario,
                        n.NombreUsuario
                    ]),
                    styles: {
                        fontSize: 10,
                        cellPadding: 5
                    },
                    headStyles: {
                        fillColor: [41, 128, 185], // Azul
                        textColor: 255,
                        fontStyle: 'bold'
                    }
                });

                // Guarda el PDF con los datos y la imagen
                doc.save("documento_Fechas.pdf");
            });
        });
    } else {
        console.error("jsPDF no está disponible en generarPDFHorizontal.");
    }
}

function cargarDatosReporteIA(callback) {
    var request = {
        fechainicio: $("#txtFechaInicio").val(),
        fechafin: $("#txtFechaFin").val()
    };
    $.ajax({
        type: "POST",
        url: "FrmReportNotifi.aspx/NotificacionesRpt",
        data: JSON.stringify(request),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        },
        success: function (response) {
            if (response.d.Estado) {
                var notificaciones = response.d.Data;
                callback(notificaciones);  // Llama al callback pasando las notificaciones
            } else {
                swal("Mensaje", response.d.Mensaje, "warning");
            }
        }
    });
}

$('#btnImprimir').on('click', function () {

    generarPDFechas();
})

function generarPDFHorizontal() {
    if (jsPDFInstance) {
        var imgUrl = "../Imagenes/reportemuc.png"; // Ruta de tu imagen
        var tituloR = "REPORTE DE NOTIFICACIONES POR FUNCIONARIO";
        getBase64Image(imgUrl, function (base64Img) {
            // Llama a cargarDatosRptUsua para obtener los datos
            cargarDatosRptUsua(function (asociaciones) {
                const doc = new jsPDFInstance({
                    orientation: 'landscape',
                    unit: 'pt',
                    format: 'legal'
                });

                // Agrega la imagen de membrete
                doc.addImage(base64Img, 'PNG', 220, 28, 567, 57);

                // Agrega el título dinámico
                doc.setFontSize(14);  // Ajusta el tamaño del título
                doc.setFont("helvetica", "bold");  // Cambia la fuente y estilo si deseas
                doc.text(tituloR, doc.internal.pageSize.getWidth() / 2, 110, { align: "center" });

                //doc.text("Este es un PDF generado en orientación horizontal", 28, 113);
                // Posición Y inicial para las asociaciones, ajustada después del título
                //let currentY = 130;
                let currentY = 150; // Posición Y inicial

                // Itera sobre las asociaciones y agrégalas al PDF
                asociaciones.forEach(function (asociacion, index) {
                    const marginTop = 10;

                    // Agrega el texto de la asociación
                    doc.setFontSize(12);
                    doc.text(`Funcionario: ${asociacion.Nombres} ${asociacion.Apellidos}`, 40, currentY + marginTop);
                    doc.text(`Cargo: ${asociacion.Rol.Descripcion}`, 600, currentY + marginTop);

                    // Verifica si hay activos en la asociación
                    if (asociacion.ListaNotificacion.length > 0) {
                        doc.text('LISTA DE NOTIFICACIONES REGISTRADAS:', 40, currentY + 30);

                        // Agrega la tabla con autoTable
                        doc.autoTable({
                            startY: currentY + 50,
                            head: [['Código', 'Descripcion', 'Fecha Registro', 'Fecha Presencia', 'Propietario']],
                            body: asociacion.ListaNotificacion.map(pcd => [
                                pcd.Codigo,
                                pcd.Descripcion,
                                pcd.FechaRegistro,
                                pcd.FechaPresencia,
                                `${pcd.Propietario.Nombres} ${pcd.Propietario.Apellidos}`
                            ]),
                        });

                        // Actualiza la posición Y para la siguiente asociación
                        currentY = doc.autoTable.previous.finalY + 30; // Deja un margen después de la tabla
                    } else {
                        doc.text('EL FUNCIONARIO NO TIENE REGISTROS.', 40, currentY + 30);
                        currentY += 50; // Ajusta el espaciado si no hay tabla
                    }
                });

                // Guarda el PDF con los datos y la imagen
                doc.save("reporte_Funcionario_datos.pdf");
            });
        });
    } else {
        console.error("jsPDF no está disponible en generarPDFHorizontal.");
    }
}

function cargarDatosRptUsua(callback) {

    $.ajax({
        type: "POST",
        url: "FrmReportNotifi.aspx/ObtenerUsuarioComple",
        data: {},
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        },
        success: function (response) {
            if (response.d.Estado) {
                var usuarios = response.d.Data;
                callback(usuarios);  // Llama al callback pasando las usuarios
            }
        }
    });
}

$('#btnReporteUsua').on('click', function () {

    generarPDFHorizontal();
})