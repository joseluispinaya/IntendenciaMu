<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="FrmReporteNot.aspx.cs" Inherits="CapaPresentacion.FrmReporteNot" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Notificacion</title>
    <link href="dist/css/reportticke.css" rel="stylesheet"/>

</head>
<body>
    <div style="text-align: center;">
        <button type="button" id="Imprimir" onclick="imprSelec('usuariosContainer')" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            IMPRIMIR
        </button>
    </div>
    <br/>

    <div id="usuariosContainer">
        <img src="Imagenes/reportelo.png" />
        <h2>Notificación</h2>
        <p><b>Nro notificacion:</b> <span id="codigo"></span></p>
        <hr />
        <p class="sectionti">*** DETALLE DEL NOTIFICADO ***</p>
        <p><b>Descripción:</b> <span id="descripcion"></span></p>
        <p><b>Propietario:</b> <span id="propietario"></span></p>
        <p><b>Celular:</b> <span id="celular"></span></p>
        <p><b>Presentarse el:</b> <span id="fechaPresencia"></span></p>
        <hr />
        <p class="sectionti">*** DETALLE DE LA NOTIFICACION ***</p>
        <p><b>Funcionario:</b> <span id="usuario"></span></p>
        <p><b>Fecha Notificacion:</b> <span id="fechaRegisno"></span></p>
        <hr/>
        <p class="firma">*** Firma del notificado ***</p>
    </div>

    <script src="plugins/jquery/jquery.min.js"></script>
    <script src="plugins/loadingoverlay/loadingoverlay.min.js"></script>
    <script src="js/FrmReporteNot.js" type="text/javascript"></script>
</body>
</html>
