<%@ Page Title="" Language="C#" MasterPageFile="~/PaginaMas.Master" AutoEventWireup="true" CodeBehind="FrmPanelNotificacio.aspx.cs" Inherits="CapaPresentacion.FrmPanelNotificacio" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box" id="loaddd">
              <span class="info-box-icon bg-info"><i class="fas fa-search"></i></span>

              <div class="info-box-content">
                  <%--<span class="info-box-number">Nro CI:</span>--%>
                <input type="text" class="form-control form-control-sm mb-2" id="txtNroci" name="Nro CI" placeholder="Nro cedula">
                <button type="button" id="btnPanelBuscar" class="btn btn-info btn-xs"><i class="fa fa-book"></i> Buscar</button>
                <!-- <span class="info-box-number">1,410</span> -->
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box">
                <input id="txtIdpopietpa" value="0" type="hidden" />
              <span class="info-box-icon bg-warning"><i class="fas fa-user-plus"></i></span>

              <div class="info-box-content">
                  <%--<span class="info-box-number">warning:</span>--%>
                <span class="info-box-text" id="panameprop">Nombre Notificado</span>
                <span class="info-box-number" id="nrocell">Nro celular</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-success"><i class="far fa-copy"></i></span>

              <div class="info-box-content">
                <%--<span class="info-box-number">Detalle:</span>--%>
                <span class="info-box-text">Notificaciones</span>
                <span class="info-box-number" id="acticoun">Activas 0</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-danger"><i class="far fa-copy"></i></span>

              <div class="info-box-content">
                <%--<span class="info-box-number">Detalle:</span>--%>
                <span class="info-box-text">Notificaciones</span>
                <span class="info-box-number" id="noacticoun">Canceladas 0</span>
              </div>
            </div>
          </div>
        </div>

    <div class="row" id="cardnoti">
    </div>

    <div class="modal fade" id="modaldetallenotif" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 id="myLarlLabel" class="modal-title">Detalle Notificacion</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input id="txtIdNotificaa" name="IdPropietario" value="0" type="hidden" />
                    <input id="valorEstado" type="hidden" />
                    <div class="row">
                        <div class="col-md-7">
                            <div class="row">
                                <h5 id="propietariod" style="font-size: 1rem; margin-bottom: 0.2rem;">Nombre propietario</h5>
                              <%--<h2 class="lead" id="propietariod"><b>Nombre propietario</b></h2>--%>
                              <p id="prebaa" class="text-muted text-sm"><b>Detalle: </b>descripcion de la notificacion de Intendencia municipal </p>
  
                              <ul class="ml-4 mb-0 fa-ul text-muted">
                                <li id="fechanoti" class="small"><span class="fa-li"><i class="fas fa-lg fa-clock"></i></span> Fecha : correo@gmail.com</li>
                                <li id="codiNoti" class="small"><span class="fa-li"><i class="fas fa-lg fa-envelope"></i></span> Codigo: 73999726</li>
                                <li id="estadono" class="small"><span class="fa-li"><i class="fas fa-lg fa-file"></i></span> Estado: 73999726</li>
                            </ul>
                          </div>
                        </div>
                        <div class="col-md-5">
                            <%--<h2 class="lead" id="notificadorn"><b>Nombre notificador</b></h2>--%>
                            <h5 style="font-size: 1rem; margin-bottom: 0.2rem;">Detalle Notificador</h5>
                            <p id="notifidetaa" class="text-muted text-sm"><b>Cargo: </b>Notificador dependiente de Intendencia municipal </p>
                            <ul class="ml-4 mb-0 fa-ul text-muted">
                                <li id="fecharegissn" class="small"><span class="fa-li"><i class="fas fa-lg fa-clock"></i></span> Fecha: correo@gmail.com</li>
                                <li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span> Celular: 73999726</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer justify-content-between">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="btnGuardarCambiosNot">Cancelar Notificacion</button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/FrmPanelNotificacio.js" type="text/javascript"></script>
</asp:Content>
