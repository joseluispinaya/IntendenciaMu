
$(document).ready(function () {
    // Validar si existen tanto el token como el usuario en sessionStorage
    const tokenSesion = sessionStorage.getItem('tokenSesion');
    const usuarioL = sessionStorage.getItem('usuarioLo');
    //console.log(usuarioL);

    if (tokenSesion && usuarioL) {
        //console.log("hay sesion");
        // Parsear el usuario almacenado
        var usuParaenviar = JSON.parse(usuarioL);
        var idUsu = usuParaenviar.IdUsuario; // Obtener IdUsuario

        // Llamar a obtenerDetalleUsuarioR pasando el IdUsuario
        obtenerDetalleUsuarioR(idUsu);

    } else {
        // Si no hay sesión, redirigir al login
        //console.log("no hay sesion");
        window.location.href = 'Login.aspx';
    }

});

$('#salirsis').on('click', function (e) {
    e.preventDefault();
    CerrarSesionz();
});

//$('#salirsis').on('click', async function (e) {
//    e.preventDefault();
//    await cerrarSesion();
//});


async function obtenerDetalleUsuarioR(idUsu) {
    try {
        const response = await $.ajax({
            type: "POST",
            url: "Inicio.aspx/ObtenerToken",
            data: JSON.stringify({ IdUsu: idUsu }),
            contentType: 'application/json; charset=utf-8',
            dataType: "json"
        });

        if (response.d.Estado) {
            const tokenSession = sessionStorage.getItem('tokenSesion');
            if (tokenSession !== response.d.Valor) {
                CerrarSesionz();
                //await cerrarSesion();
            } else {
                // Actualiza la información del usuario en la interfaz nuevo
                const usuarioL = sessionStorage.getItem('usuarioLo');

                if (usuarioL) {
                    var usuario = JSON.parse(usuarioL);
                    $("#nomUserg").text(usuario.Apellidos);
                    $("#imgUsumast").attr("src", usuario.ImageFull);

                    const rolUser = usuario.IdRol;

                    // Oculta todo al inicio
                    $(".menu-admin, .menu-prop, .menu-noti, .menu-panelz, .menu-report-noti, .menu-report-neg").hide();

                    // Mostrar solo lo que corresponde al rol
                    if (rolUser === 1) {
                        $(".menu-admin").show(); // Usuarios
                    } else if (rolUser === 2) {
                        $(".menu-prop, .menu-report-noti").show(); // Propietarios y reporte notificación
                    } else if (rolUser === 3) {
                        $(".menu-noti, .menu-panelz, .menu-report-noti, .menu-report-neg").show();
                    }


                } else {
                    console.error('No se encontró información del usuario en sessionStorage.');
                    window.location.href = 'Login.aspx'; // Redirigir si no hay usuario válido
                }
            }
        } else {
            window.location.href = 'Login.aspx';
        }
    } catch (error) {
        // Manejo de error de la llamada AJAX
        console.error('Error al obtener los datos del usuario:', error);
        window.location.href = 'Login.aspx'; // Redirigir si hay error grave
    }
}

function CerrarSesionz() {
    //console.log("sesion cerrada");
    sessionStorage.clear();
    window.location.replace('Login.aspx');
}

async function cerrarSesion() {
    try {
        const response = await $.ajax({
            type: "POST",
            url: "Inicio.aspx/CerrarSesion",
            contentType: 'application/json; charset=utf-8',
            dataType: "json"
        });

        if (response.d.Estado) {
            console.log("sesion cerrada");
            sessionStorage.clear(); // Limpia el almacenamiento de sesión
            window.location.replace('Default.aspx'); // Redirige al login
        }
    } catch (error) {
        console.error('Error al cerrar la sesión:', error);
    }
}