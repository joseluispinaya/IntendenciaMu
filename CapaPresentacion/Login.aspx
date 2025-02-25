<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="CapaPresentacion.Login" %>

<!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

    <title>Login</title>
    <!-- SweetAlert2 -->
    <link href="plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css" rel="stylesheet">
    <link href="plugins/sweetalertz/sweetalert.css" rel="stylesheet">
    <!-- Toastr -->
    <link rel="stylesheet" href="plugins/toastr/toastr.min.css">
    <link href="dist/css/login.css" rel="stylesheet">
</head>

<body>

    <div class="container" id="container">
        <div class="form-container sign-up">
            <form>
                <h1>Recuperar Cuenta</h1>
                <div class="social-icons">
                    <a href="#" class="icon"><i class="fa-brands fa-google-plus-g"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
                <span>Ingrese su usuario y correo</span>
                <input type="text" id="nameusu" placeholder="Usuario">
                <input type="email" id="correos" placeholder="Email">
                <!-- <input type="password" placeholder="Password"> -->
                <button type="button" id="btnRecupe">Enviar</button>
            </form>
        </div>
        <div class="form-container sign-in">
            <form>
                <h1>Iniciar</h1>
                <div class="social-icons">
                    <a href="#" class="icon"><i class="fa-brands fa-google-plus-g"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
                <span>Inicie con usuario y clave</span>
                <input type="text" id="txtusername" placeholder="Usuario">
                <input type="password" id="txtpassword" placeholder="Password">
                <!-- <a href="#">Forget Your Password?</a> -->
                <button type="button" id="btnIniciarSesion">Iniciar</button>
            </form>
        </div>
        <div class="toggle-container">
            <div class="toggle">
                <div class="toggle-panel toggle-left">
                    <h1>Bienvenido......</h1>
                    <p>Ingrese los datos para recuperar su cuenta de usuario</p>
                    <button class="hidden" id="login">Iniciar sesion</button>
                </div>
                <div class="toggle-panel toggle-right">
                    <h1>Bienvenido..</h1>
                    <p>Para el inicio de sesion debe llenar los datos requeridos</p>
                    <button class="hidden" id="register">Recuperar cuenta</button>
                </div>
            </div>
        </div>
    </div>

    <script src="plugins/jquery/jquery.min.js"></script>
    <!-- SweetAlert2 -->
    <script src="plugins/sweetalert2/sweetalert2.min.js"></script>
    <script src="plugins/sweetalertz/sweetalert.js"></script>
    <!-- Toastr -->
    <script src="plugins/toastr/toastr.min.js"></script>
    <script src="js/Login.js" type="text/javascript"></script>
</body>

</html>
