<%@ Page Title="" Language="C#" MasterPageFile="~/PaginaMas.Master" AutoEventWireup="true" CodeBehind="FrmNegocio.aspx.cs" Inherits="CapaPresentacion.FrmNegocio" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="plugins/selectzero2/select2.min.css">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-md-5">
            <div class="card card-primary" id="loads">
                <div class="card-header">
                    <h3 class="card-title">Registro de Negocio</h3>
                </div>
                <div class="card-body">
                    <input id="txtIdNegocioc" value="0" type="hidden" />
                    <input id="txtIdpopieta" value="0" type="hidden" />
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Buscar propietario</label>
                                <select class="form-control form-control-sm" id="cboBuscarPropiNe" style="width: 100%;">
                                    <option value=""></option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="txtnombrepropiet">Nombre Propietario:</label>
                                <input type="text" class="form-control form-control-sm" id="txtnombrepropiet"
                                    disabled>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="txtnombreNeg">Nombre Negocio:</label>
                                <input type="text" class="form-control form-control-sm model" id="txtnombreNeg"
                                    name="Nombre negocio" placeholder="Nombre negocio">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="txtactividad">Actividad:</label>
                                <input type="text" class="form-control form-control-sm model" id="txtactividad"
                                    name="Actividad" placeholder="Actividad">
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="txtDireccion">Direccion:</label>
                        <input type="text" class="form-control form-control-sm model" id="txtDireccion" name="Direccion"
                            placeholder="Ingrese la Direccion">
                    </div>


                </div>
                <div class="card-footer text-center">
                    <button type="button" id="btnNuevoReg" class="btn btn-success btn-sm"><i
                            class="fas fa-edit mr-2"></i>Guardar</button>
                </div>
            </div>
        </div>
        <div class="col-md-7">
            <div class="card card-primary">
                <div class="card-header">
                    <h3 class="card-title">Informacion del Padron</h3>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <div class="custom-control custom-switch">
                            <input type="checkbox" class="custom-control-input" id="padronSwitch">
                            <label class="custom-control-label" for="padronSwitch">Cuenta con Padron ?</label>
                        </div>
                    </div>

                    <div class="row" id="rowImagenPadron">
                        <div class="col-md-12 text-center">
                            <div class="form-group">
                                <label for="txtFotoSx">SIN PADRON MUNICIPAL</label>
                            </div>

                            <div class="form-group">
                                <img id="imgSinpadron" src="Imagenes/sinpadron.png" alt="Foto usuario" style="height: 130px; max-width: 130px;">
                            </div>
                        </div>
                    </div>

                    <div class="row" id="rowInputPadron" style="display: none;">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="txtnropadron">Nro Padron:</label>
                                <input type="text" class="form-control form-control-sm" id="txtnropadron"
                                    name="Nro Padron" placeholder="Nro Padron">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="txtValidez">Validez:</label>
                                <input type="text" class="form-control form-control-sm" id="txtValidez" name="Validez"
                                    placeholder="Validez">
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div class="card card-primary" id="listNego" style="display: none;">
                <div class="card-header">
                    <h3 class="card-title">Lista de Negocios</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-12">
                            <table class="table table-bordered table-striped table-sm" id="tbPadrons" style="width: 100%">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Negocio</th>
                                        <th>Actividad</th>
                                        <th>Nro Padron</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
        <script src="plugins/selectzero2/select2.min.js"></script>
<script src="plugins/selectzero2/es.min.js"></script>
    <script src="js/FrmNegocio.js" type="text/javascript"></script>
</asp:Content>
