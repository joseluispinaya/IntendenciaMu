<%@ Page Title="" Language="C#" MasterPageFile="~/PaginaMas.Master" AutoEventWireup="true" CodeBehind="FrmUsuario.aspx.cs" Inherits="CapaPresentacion.FrmUsuario" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="dist/css/inpfile.css" rel="stylesheet"/>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-md-12">
            <div class="card card-primary">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h3 class="card-title">
                        <i class="fas fa-edit"></i>
                        Lista de Usuarios Registrados
                    </h3>
                    <button type="button" id="btnNuevoRol" class="btn btn-success btn-sm"><i class="fas fa-users"></i> Nuevo Registro</button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-12">
                            <table class="table table-bordered table-striped" id="tbUsuario" style="width: 100%">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Foto</th>
                                        <th>Rol</th>
                                        <th>Nombres</th>
                                        <th>Apellidos</th>
                                        <th>Correo</th>
                                        <th>Usuario</th>
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

    <div class="modal fade" id="modaluser" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 id="myLarlLabel" class="modal-title">Registro Usuario</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input id="txtIdUsuario" class="model" name="IdUsuario" value="0" type="hidden" />
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="txtnombres">Nombres:</label>
                                <input type="text" class="form-control form-control-sm model" id="txtnombres" name="Nombres" placeholder="Nombres">
                            </div>
                            <div class="form-group">
                                <label for="txtCorreo">Correo:</label>
                                <input type="text" class="form-control form-control-sm model" id="txtCorreo" name="Correo" placeholder="Correo">
                            </div>
                            <div class="form-group">
                                <label for="txtUsuario">Usuario:</label>
                                <input type="text" class="form-control form-control-sm model" id="txtUsuario" name="Usuario" placeholder="Usuario">
                            </div>
                            <div class="form-group">
                                <label for="cboRol">Rol</label>
                                <select class="form-control" id="cboRol">
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="txtapellidos">Apellidos:</label>
                                <input type="text" class="form-control form-control-sm model" id="txtapellidos" name="Apellidos" placeholder="Apellidos">
                            </div>

                            <div class="form-group">
                                <label for="txtCelular">Celular:</label>
                                <input type="text" class="form-control form-control-sm model" id="txtCelular" name="Celular" placeholder="Celular">
                            </div>
                            <div class="form-group">
                                <label for="txtContra">Contraseña:</label>
                                <input type="text" class="form-control form-control-sm model" id="txtContra" name="Contraseña" placeholder="Contraseña">
                            </div>
                            <div class="form-group">
                                <label for="cboEstado">Estado</label>
                                <select class="form-control" id="cboEstado">
                                    <option value="1">Activo</option>
                                    <option value="0">No Activo</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="txtFotoS">Seleccione Foto</label>
                                <div class="custom-file-upload">
                                    <input type="file" class="custom-file-input-upload" id="txtFotoS">
                                    <label class="custom-file-label-upload" for="txtFotoS">Ningún archivo seleccionado</label>
                                </div>
                            </div>
                            <div class="form-group text-center">
                                <img id="imgUsuarioM" src="Imagenes/Sinfotop.png" alt="Foto usuario" style="height: 130px; max-width: 130px; border-radius: 50%;">
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
    <script src="js/FrmUsuario.js" type="text/javascript"></script>
</asp:Content>
