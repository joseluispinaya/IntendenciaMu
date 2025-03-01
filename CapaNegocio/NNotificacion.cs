using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidad;

namespace CapaNegocio
{
    public class NNotificacion
    {
        #region "PATRON SINGLETON"
        public static NNotificacion _instancia = null;

        private NNotificacion()
        {

        }

        public static NNotificacion GetInstance()
        {
            if (_instancia == null)
            {
                _instancia = new NNotificacion();
            }
            return _instancia;
        }
        #endregion

        public Respuesta<int> RegistrarNotificacion(ENotificacion oNotificacion)
        {
            return DNotificacion.GetInstance().RegistrarNotificacion(oNotificacion);
        }

        public Respuesta<List<ENotificacion>> ObtenerNotificacionId(int Idpropietario)
        {
            return DNotificacion.GetInstance().ObtenerNotificacionId(Idpropietario);
        }

        public Respuesta<List<ENotificacion>> ObtenerNotificacionIdPrueba(int Idpropietario)
        {
            return DNotificacion.GetInstance().ObtenerNotificacionIdPrueba(Idpropietario);
        }

        public Respuesta<ENotificacion> ObtenerNotificacionPorIdReport(int IdNotifi)
        {
            return DNotificacion.GetInstance().ObtenerNotificacionPorIdReport(IdNotifi);
        }
    }
}
