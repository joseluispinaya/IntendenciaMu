<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ReporteCred.aspx.cs" Inherits="CapaPresentacion.ReporteCred" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Reporte</title>
    <link href="dist/css/cardstyle.css" rel="stylesheet"/>
</head>
<body>
    <div style="font-size: 11px; text-align: right;">
        <div style="text-align: center;">
            <button type="button" id="Imprimir" onclick="javascript:imprSelec('usuariosContainer')" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                IMPRIMIR
            </button>
        </div>
        <br />
    </div>

    <div id="usuariosContainer" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">

    </div>

    <script src="plugins/jquery/jquery.min.js"></script>
    <script src="js/ReporteCred.js" type="text/javascript"></script>
</body>
</html>
