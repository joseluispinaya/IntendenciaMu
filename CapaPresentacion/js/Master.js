
$(document).ready(function () {
    // Validar si existen tanto el token como el usuario en sessionStorage
    const tokenSesion = sessionStorage.getItem('tokenSesion');
    const usuarioL = sessionStorage.getItem('usuarioLo');
    //console.log(usuarioL);

    if (tokenSesion && usuarioL) {
        // Parsear el usuario almacenado
        var usuParaenviar = JSON.parse(usuarioL);
        var idUsu = usuParaenviar.IdUsuario; // Obtener IdUsuario

        // Llamar a obtenerDetalleUsuarioR pasando el IdUsuario
        obtenerDetalleUsuarioR(idUsu);

    } else {
        // Si no hay sesión, redirigir al login
        window.location.href = 'Login.aspx';
    }

});

$('#salirsis').on('click', async function (e) {
    e.preventDefault(); // Evita que el <a> navegue a otra página
    await cerrarSesion(); // Llama a la función asíncrona y espera su finalización
});


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
                await cerrarSesion(); // Llama a la función para cerrar sesión
            } else {
                // Actualiza la información del usuario en la interfaz nuevo
                const usuarioL = sessionStorage.getItem('usuarioLo');

                if (usuarioL) {
                    var usuario = JSON.parse(usuarioL);
                    $("#nomUserg").text(usuario.Apellidos);
                    $("#imgUsumast").attr("src", usuario.ImageFull);
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

async function cerrarSesion() {
    try {
        const response = await $.ajax({
            type: "POST",
            url: "Inicio.aspx/CerrarSesion",
            contentType: 'application/json; charset=utf-8',
            dataType: "json"
        });

        if (response.d.Estado) {
            sessionStorage.clear(); // Limpia el almacenamiento de sesión
            window.location.replace('Default.aspx'); // Redirige al login
        }
    } catch (error) {
        console.error('Error al cerrar la sesión:', error);
    }
}