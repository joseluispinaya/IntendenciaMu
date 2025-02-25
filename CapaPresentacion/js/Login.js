
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

$('#btnIniciarSesion').on('click', function () {

    // Deshabilitar el botón para evitar múltiples envíos
    $('#btnIniciarSesion').prop('disabled', true);

    if ($("#txtusername").val().trim() === "" || $("#txtpassword").val().trim() === "") {
        Toast.fire({
            icon: 'warning',
            title: 'Debe ingresar un usuario.'
        })
        $('#btnIniciarSesion').prop('disabled', false);
        //$("#txtusername").focus();
        return;
    }
    //swal("Mensaje", "Logeado exitoso", "success")
    
    loginSistema();
})

function loginSistema() {

    $.ajax({
        type: "POST",
        url: "Login.aspx/LogeoZero",
        data: JSON.stringify({ Usuario: $("#txtusername").val().trim(), Clave: $("#txtpassword").val().trim() }),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response.d.Estado) {

                sessionStorage.setItem('tokenSesion', response.d.Valor);
                // Almacenar el objeto usuario completo en sessionStorage
                sessionStorage.setItem('usuarioLo', JSON.stringify(response.d.Data));
                window.location.href = 'Inicio.aspx';
            } else {
                swal("Mensaje", response.d.Mensaje, "warning");
                //swal("Mensaje", "No se encontro el usuario", "warning")
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
        },
        complete: function () {
            // Rehabilitar el botón después de que la llamada AJAX se complete (éxito o error)
            $('#btnIniciarSesion').prop('disabled', false);
        }
    });
}

$('#btnRecupe').on('click', function () {

    swal("Mensaje", "Logeado exitoso", "success")
})