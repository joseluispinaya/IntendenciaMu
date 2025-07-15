using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidad;

namespace CapaNegocio
{
    public class NNegocio
    {
        #region "PATRON SINGLETON"
        private static NNegocio daoEmpleado = null;
        private NNegocio() { }
        public static NNegocio GetInstance()
        {
            if (daoEmpleado == null)
            {
                daoEmpleado = new NNegocio();
            }
            return daoEmpleado;
        }
        #endregion

        public Respuesta<bool> RegistrarNegocio(ENegocio oNegocio)
        {
            return DNegocio.GetInstance().RegistrarNegocio(oNegocio);
        }

        public Respuesta<bool> ActualizarNegocio(ENegocio oNegocio)
        {
            return DNegocio.GetInstance().ActualizarNegocio(oNegocio);
        }

        public Respuesta<List<ENegocio>> ObtenerNegociosIdPropi(int Idpropietario)
        {
            return DNegocio.GetInstance().ObtenerNegociosIdPropi(Idpropietario);
        }
    }
}
