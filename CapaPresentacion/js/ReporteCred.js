

$(document).ready(function () {

    dtUsuariosReport();
})

function dtUsuariosReport() {
    $.ajax({
        type: "POST",
        url: "FrmUsuario.aspx/ObtenerUsuario",
        data: {},
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        },
        success: function (data) {
            if (data.d.Estado) {
                var listaUsers = data.d.Data;
                var container = document.getElementById("usuariosContainer");
                container.innerHTML = ""; // Limpiar antes de agregar nuevas tarjetas

                var row;
                listaUsers.forEach((user, index) => {
                    if (index % 3 === 0) { // Cada 3 elementos crear una nueva fila
                        row = document.createElement("div");
                        row.classList.add("row-badge");
                        container.appendChild(row);
                    }

                    var badge = document.createElement("div");
                    badge.classList.add("badge");
                    badge.innerHTML = `
                        <div class="curve-black"></div>
                        <div class="curve"></div>
                        <div class="profile-pic">
                            <img class="fotoo" src="${user.ImageFull}" style="height: 100px; max-width: 100px; border-radius: 50%;">
                        </div>
                        <div class="info">
                            <p>${user.Nombres}</p>
                            <p>${user.Apellidos}</p>
                            <p>CARGO: ${user.Rol.Descripcion}</p>
                            <p>CELULAR: ${user.Celular}</p>
                        </div>
                        <div class="static-text">
                            <p>INTENDENCIA MUNICIPAL</p>
                            <p>GESTION 2025</p>
                        </div>
                        <div class="qr">
                            <img class="foqr" src="${user.ImageFull}" style="height: 50px; max-width: 50px;">
                        </div>
                    `;

                    row.appendChild(badge);
                });
            }
        }
    });
}

function imprSelec(nombre) {
    var printContents = document.getElementById(nombre).innerHTML;
    var popupWin = window.open('', '_blank', 'width=800,height=600');

    popupWin.document.open();
    popupWin.document.write(`
        <html>
        <head>
            <title>Impresión</title>
            <link rel="stylesheet" href="dist/css/cardstyle.css">
            <style>
                @media print {
                    body {
                        visibility: hidden;
                    }
                    #usuariosContainer {
                        visibility: visible;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                    }
                    .badge {
                        background: rgb(238, 237, 177) !important; /* Forzar fondo */
                        box-shadow: none !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body onload="window.print();window.close()">
            <div id="usuariosContainer">
                ${printContents}
            </div>
        </body>
        </html>
    `);

    popupWin.document.close();
}
//function hide() {
//    document.getElementById('Imprimir').style.visibility = "hidden";
//}