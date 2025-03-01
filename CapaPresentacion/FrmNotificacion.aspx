<%@ Page Title="" Language="C#" MasterPageFile="~/PaginaMas.Master" AutoEventWireup="true" CodeBehind="FrmNotificacion.aspx.cs" Inherits="CapaPresentacion.FrmNotificacion" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
  <div class="col-sm-3">
    <!-- Profile Image -->
    <div class="card card-primary card-outline">
      <div class="card-body box-profile" id="loaddd">
          <input id="txtIdpopiet" value="0" type="hidden" />
        <div class="text-center">
          <img class="profile-user-img img-fluid img-circle"
               src="Imagenes/logogm.jpg"
               alt="User profile picture">
        </div>

        <h3 id="nompropi" class="profile-username text-center">Nombre Propie</h3>

        <p id="apellpropi" class="text-muted text-center">Apellidos</p>

        <ul class="list-group list-group-unbordered mb-3">
          <li class="list-group-item" id="totalnotif">
            <b>Notificaciones</b> <a class="float-right">0</a>
          </li>
          <%--<li class="list-group-item">
            <b>Following</b> <a class="float-right">543</a>
          </li>
          <li class="list-group-item">
            <b>Friends</b> <a class="float-right">13,287</a>
          </li>--%>
        </ul>
          <div class="form-horizontal">
              <div class="input-group input-group-sm mb-3">
                  <input type="text" id="nrocipropi" class="form-control form-control-sm" placeholder="Ingrese CI">
                  <div class="input-group-append">
                      <button type="button" id="btnBuscar" class="btn btn-danger">Buscar</button>
                  </div>
              </div>
          </div>

        <a href="FrmPropietario.aspx" class="btn btn-primary btn-block"><b>Registrar Propietario</b></a>
      </div>
      <!-- /.card-body -->
    </div>
    <!-- /.card -->
  </div>
  <div class="col-sm-9">
    <div class="card">
      <div class="card-header p-2">
        <ul class="nav nav-pills">
          <li class="nav-item"><a class="nav-link active" href="#activity" data-toggle="tab">Registro Notificacion</a></li>
          <li class="nav-item"><a class="nav-link" href="#timeline" data-toggle="tab">Detalle</a></li>
          <li class="nav-item"><a class="nav-link" href="#settings" data-toggle="tab">Negocios</a></li>
        </ul>
      </div><!-- /.card-header -->
      <div class="card-body">
        <div class="tab-content">
          <div class="active tab-pane" id="activity">
              <div class="row" id="loadregi">
                  <div class="col-md-6">
                      <div class="form-group">
                          <label for="txtDescripcion">Descripcion:</label>
                          <textarea class="form-control" rows="3" id="txtDescripcion" placeholder="Descripcion"></textarea>
                      </div>
                      <div class="row">
                          <div class="col-sm-6">
                              <div class="form-group">
                                  <label for="txtfechapresent">Presentarse en:</label>
                                  <div class="input-group date" id="txtfechapresent" data-target-input="nearest">
                                      <input type="text" class="form-control datetimepicker-input" data-target="#txtfechapresent" />
                                      <div class="input-group-append" data-target="#txtfechapresent" data-toggle="datetimepicker">
                                          <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-sm-6">
                              <div class="form-group">
                                  <label for="txtfechaact">Fecha actual:</label>
                                  <input type="text" class="form-control" id="txtfechaact" disabled>
                              </div>
                          </div>
                      </div>
                      <div class="row justify-content-center align-items-center mb-3">
                          <button type="button" id="btnNuevoRegNot" class="btn btn-primary"><i class="fas fa-plus-circle"></i> Registrar</button>
                      </div>
                  </div>
                  <div class="col-md-6">
                      <div class="card bg-light d-flex flex-fill">
                          <div class="card-header text-muted border-bottom-0">
                              Datos del notificador
                          </div>
                          <div class="card-body pt-0">
                              <div class="row">
                                  <div class="col-7">
                                      <input id="txtIdnotiifi" type="hidden" />
                                      <h2 id="apelliNotiff" class="lead"><b>Nombre notificador</b></h2>
                                      <p class="text-muted text-sm"><b>Cargo: </b>Notificador dependiente de Intendencia municipal </p>
                                      <ul class="ml-4 mb-0 fa-ul text-muted">
                                          <li id="correoNoti" class="small">
                                              <span class="fa-li"><i class="fas fa-lg fa-envelope"></i></span>Correo: correo@gmail.com

                                          </li>
                                          <li id="celularNoti" class="small">
                                              <span class="fa-li"><i class="fas fa-lg fa-phone"></i></span>Celular: 73999726

                                          </li>
                                      </ul>
                                  </div>
                                  <div class="col-5 text-center">
                                      <img id="fotonotif" src="dist/img/user1-128x128.jpg" alt="user-avatar" class="img-circle img-fluid">
                                  </div>
                              </div>
                          </div>
                          <%--<div class="card-footer">
                              <div class="text-right">
                                  <a href="#" class="btn btn-sm bg-teal">
                                      <i class="fas fa-comments"></i>
                                  </a>
                                  <a href="#" class="btn btn-sm btn-primary">
                                      <i class="fas fa-user"></i>View Profile
                                  </a>
                              </div>
                          </div>--%>
                      </div>
                  </div>
              </div>

              <!-- Post -->
              
              <!-- /.post -->
          </div>
          <!-- /.tab-pane -->
          <div class="tab-pane" id="timeline">
              <div class="timeline timeline-inverse" id="UilistNot">
                  <%--<div class="time-label">
                      <span class="bg-danger">10 Feb. 2014
                      </span>
                  </div>
                  <div>
                      <i class="fas fa-file bg-primary"></i>

                      <div class="timeline-item">
                          <span class="time"><i class="far fa-clock"></i> 12:05</span>

                          <h3 class="timeline-header"><a href="#">Codigo Notificacion</a> Detalle</h3>

                          <div class="timeline-body">
                              Detalle de la notificacion disqus groupon greplin oooj voxy zoodles
                          </div>
                          <div class="timeline-footer">
                              <a href="#" class="btn btn-primary btn-sm">Ver Detalle</a>
                              <a href="#" class="btn btn-success btn-sm">Imprimir</a>
                          </div>
                      </div>
                  </div>

                  <div class="time-label">
                      <span class="bg-success">10 Jan. 2014
                      </span>
                  </div>
                  <div>
                      <i class="fas fa-file bg-primary"></i>

                      <div class="timeline-item">
                          <span class="time"><i class="far fa-clock"></i> 27 mins ago</span>

                          <h3 class="timeline-header"><a href="#">Jay White</a> commented on your post</h3>

                          <div class="timeline-body">
                              Take me to your leader!
                          </div>
                          <div class="timeline-footer">
                              <a href="#" class="btn btn-primary btn-sm">Ver Detalle</a>
                              <a href="#" class="btn btn-success btn-sm">Imprimir</a>
                          </div>
                      </div>
                  </div>--%>
              </div>
          </div>
          <!-- /.tab-pane -->

          <div class="tab-pane" id="settings">
              <div class="post clearfix">
                  <div class="user-block">
                      <img class="img-circle img-bordered-sm" src="../../dist/img/user7-128x128.jpg" alt="User Image">
                      <span class="username">
                          <a href="#">Sarah Ross</a>
                          <a href="#" class="float-right btn-tool"><i class="fas fa-times"></i></a>
                      </span>
                      <span class="description">Sent you a message - 3 days ago</span>
                  </div>
                  <!-- /.user-block -->
                  <p>
                      Lorem ipsum represents a long-held tradition for designers,
      typographers and the like. Some people hate it and argue for
      its demise, but others ignore the hate as they create awesome
      tools to help create filler text for everyone from bacon lovers
      to Charlie Sheen fans.
                  </p>

                  <div class="form-horizontal">
                      <div class="input-group input-group-sm mb-0">
                          <input class="form-control form-control-sm" placeholder="Response">
                          <div class="input-group-append">
                              <button type="button" class="btn btn-danger">Send</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <!-- /.tab-pane -->
        </div>
        <!-- /.tab-content -->
      </div><!-- /.card-body -->
    </div>
  </div>
</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/FrmNotificacion.js" type="text/javascript"></script>
</asp:Content>
