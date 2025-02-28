using CapaDatos;
using CapaEntidad;
using System.Collections.Generic;

namespace CapaNegocio
{
    public class NPropietario
    {
        #region "PATRON SINGLETON"
        public static NPropietario _instancia = null;

        private NPropietario()
        {

        }

        public static NPropietario GetInstance()
        {
            if (_instancia == null)
            {
                _instancia = new NPropietario();
            }
            return _instancia;
        }
        #endregion

        public Respuesta<bool> RegistrarPropietario(EPropietario oPropietario)
        {
            return DPropietario.GetInstance().RegistrarPropietario(oPropietario);
        }

        public Respuesta<bool> ActualizarPropietario(EPropietario oPropietario)
        {
            return DPropietario.GetInstance().ActualizarPropietario(oPropietario);
        }

        public Respuesta<List<EPropietario>> ObtenerPropietarios()
        {
            return DPropietario.GetInstance().ObtenerPropietarios();
        }

        public Respuesta<EPropietario> BuscarPropieta(string NroCi)
        {
            return DPropietario.GetInstance().BuscarPropieta(NroCi);
        }

    }
}
