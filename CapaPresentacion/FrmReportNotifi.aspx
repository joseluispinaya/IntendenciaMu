<%@ Page Title="" Language="C#" MasterPageFile="~/PaginaMas.Master" AutoEventWireup="true" CodeBehind="FrmReportNotifi.aspx.cs" Inherits="CapaPresentacion.FrmReportNotifi" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="plugins/jquery-ui/jquery-ui.css" >
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-md-12">
            <div class="card card-primary card-outline card-tabs">
                <div class="card-header p-0 pt-1 border-bottom-0">
                    <ul class="nav nav-tabs" id="custom-tabs-three-tab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="custom-tabs-three-home-tab" data-toggle="pill" href="#custom-tabs-three-home" role="tab" aria-controls="custom-tabs-three-home" aria-selected="true">Por Fechas</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="custom-tabs-three-profile-tab" data-toggle="pill" href="#custom-tabs-three-profile" role="tab" aria-controls="custom-tabs-three-profile" aria-selected="false">Funcionarios</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="custom-tabs-three-messages-tab" data-toggle="pill" href="#custom-tabs-three-messages" role="tab" aria-controls="custom-tabs-three-messages" aria-selected="false">General</a>
                        </li>
                    </ul>
                </div>
                <div class="card-body">
                    <div class="tab-content" id="custom-tabs-three-tabContent">
                        <div class="tab-pane fade show active" id="custom-tabs-three-home" role="tabpanel" aria-labelledby="custom-tabs-three-home-tab">
                            <div class="form-row align-items-end" id="cargann">

                                <div class="form-group col-sm-3">
                                    <label for="txtFechaInicio">Fecha Inicio</label>
                                    <input type="text" class="form-control form-control-sm" id="txtFechaInicio">
                                </div>
                                <div class="form-group col-sm-3">
                                    <label for="txtFechaFin">Fecha Fin</label>
                                    <input type="text" class="form-control form-control-sm" id="txtFechaFin">
                                </div>
                                <div class="form-group col-sm-3">
                                    <button type="button" class="btn btn-success btn-block btn-sm" id="btnBuscar">
                                        <i
                                            class="fas fa-search mr-2"></i>Buscar</button>
                                </div>
                                <div class="form-group col-sm-3">
                                    <button class="btn btn-info btn-block btn-sm" type="button" id="btnImprimir">
                                        <i
                                            class="fas fa-print mr-2"></i>Reporte</button>
                                </div>
                            </div>
                            <hr />

                            <div class="row">
                                <div class="col-md-12">
                                    <table class="table table-bordered table-striped table-sm" id="tbNotiff" style="width: 100%">
                                        <thead>
                                            <tr>
                                                <th>Codigo</th>
                                                <th>Estado</th>
                                                <th>Fecha</th>
                                                <th>Propietario</th>
                                                <th>Notificador</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                        <div class="tab-pane fade" id="custom-tabs-three-profile" role="tabpanel" aria-labelledby="custom-tabs-three-profile-tab">
                            <div class="row justify-content-center mb-4">
                                <button type="button" id="btnReporteUsua" class="btn btn-primary btn-sm"><i class="fas fa-file-pdf mr-2"></i>Generar Reporte</button>
                            </div>

                            <div class="row" id="listarz">
                                <%--<div class="col-md-4">
                                    <div class="card card-widget widget-user">
                                        <div class="widget-user-header bg-info">
                                            <h3 class="widget-user-username">Alexander Pierce</h3>
                                            <h5 class="widget-user-desc">Founder & CEO</h5>
                                        </div>
                                        <div class="widget-user-image">
                                            <img class="img-circle elevation-2" src="dist/img/user7-128x128.jpg" alt="User Avatar">
                                        </div>
                                        <div class="card-footer">
                                            <div class="row">
                                                <div class="col-sm-4 border-right">
                                                    <div class="description-block">
                                                        <h5 class="description-header">3,200</h5>
                                                        <span class="description-text">SALES</span>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4 border-right">
                                                    <div class="description-block">
                                                        <h5 class="description-header">13,000</h5>
                                                        <span class="description-text">FOLLOWERS</span>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <div class="description-block">
                                                        <a class="btn btn-app bg-success">
                                                            <i class="fas fa-users"></i>Users
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>--%>


                            </div>
                        </div>
                        <div class="tab-pane fade" id="custom-tabs-three-messages" role="tabpanel" aria-labelledby="custom-tabs-three-messages-tab">
                            Morbi turpeleifend ac ornare magna.
                        </div>
                    </div>
                </div>
                <!-- /.card -->
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="plugins/autotable/jspdf.umd.min.js"></script>
    <script src="plugins/autotable/jspdf.plugin.autotable.min.js"></script>
    <script src="plugins/jquery-ui/jquery-ui.js"></script>
    <script src="plugins/jquery-ui/idioma/datepicker-es.js"></script>
    <script src="js/FrmReportNotifi.js" type="text/javascript"></script>
</asp:Content>
