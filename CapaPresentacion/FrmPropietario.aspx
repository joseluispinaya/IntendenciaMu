<%@ Page Title="" Language="C#" MasterPageFile="~/PaginaMas.Master" AutoEventWireup="true" CodeBehind="FrmPropietario.aspx.cs" Inherits="CapaPresentacion.FrmPropietario" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-md-12">
            <div class="card card-primary">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h3 class="card-title">
                        <i class="fas fa-edit"></i>
                        Lista de Propietarios Registrados
                    </h3>
                    <button type="button" id="btnNuevoPropie" class="btn btn-success btn-sm"><i class="fas fa-users"></i>Nuevo Registro</button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-12">
                            <table class="table table-bordered table-striped" id="tbPropietar" style="width: 100%">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Nro CI</th>
                                        <th>Nombres</th>
                                        <th>Apellidos</th>
                                        <th>Celular</th>
                                        <th>Registrado</th>
                                        <th>Estado</th>
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

    <div class="modal fade" id="modalpropietario" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 id="myLarlLabel" class="modal-title">Registro Propietario</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input id="txtIdProp" name="IdPropietario" value="0" type="hidden" />
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="txtnombres">Nombres:</label>
                                <input type="text" class="form-control form-control-sm model" id="txtnombres" name="Nombres" placeholder="Nombres">
                            </div>
                            <div class="form-group">
                                <label for="txtNroci">Nro CI:</label>
                                <input type="text" class="form-control form-control-sm model" id="txtNroci" name="Nro CI" placeholder="Nro cedula">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="txtapellidos">Apellidos:</label>
                                <input type="text" class="form-control form-control-sm model" id="txtapellidos" name="Apellidos" placeholder="Apellidos">
                            </div>

                            <div class="form-group">
                                <label for="txtCelular">Celular:</label>
                                <input type="text" class="form-control form-control-sm model" id="txtCelular" name="Celular" placeholder="Celular">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="btnGuardarCambios">Guardar</button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/FrmPropietario.js" type="text/javascript"></script>
</asp:Content>
