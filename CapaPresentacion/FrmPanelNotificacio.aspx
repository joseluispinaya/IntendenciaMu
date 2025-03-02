<%@ Page Title="" Language="C#" MasterPageFile="~/PaginaMas.Master" AutoEventWireup="true" CodeBehind="FrmPanelNotificacio.aspx.cs" Inherits="CapaPresentacion.FrmPanelNotificacio" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box" id="loaddd">
              <span class="info-box-icon bg-info"><i class="fas fa-search"></i></span>

              <div class="info-box-content">
                <input type="text" class="form-control form-control-sm mb-2" id="txtNroci" name="Nro CI" placeholder="Nro cedula">
                <button type="button" id="btnPanelBuscar" class="btn btn-info btn-xs"><i class="fa fa-book"></i> Buscar</button>
                <!-- <span class="info-box-number">1,410</span> -->
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box">
                <input id="txtIdpopietpa" value="0" type="hidden" />
              <span class="info-box-icon bg-success"><i class="fas fa-user-plus"></i></span>

              <div class="info-box-content">
                <span class="info-box-text" id="panameprop">Nombre propie</span>
                <span class="info-box-number" id="nrocell">Nro ci</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-warning"><i class="far fa-copy"></i></span>

              <div class="info-box-content">
                <span class="info-box-text">Notificaciones</span>
                <span class="info-box-number">Activo 1</span>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-danger"><i class="far fa-copy"></i></span>

              <div class="info-box-content">
                <span class="info-box-text">Notificaciones</span>
                <span class="info-box-number">No Activo 3</span>
              </div>
            </div>
          </div>
        </div>

    <div class="row" id="cardnoti">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/FrmPanelNotificacio.js" type="text/javascript"></script>
</asp:Content>
