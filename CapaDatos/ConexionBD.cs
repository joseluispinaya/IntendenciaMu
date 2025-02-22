using System.Data.SqlClient;

namespace CapaDatos
{
    public class ConexionBD
    {
        #region "PATRON SINGLETON"
        public static ConexionBD conexion = null;

        public ConexionBD() { }

        public static ConexionBD GetInstance()
        {
            if (conexion == null)
            {
                conexion = new ConexionBD();
            }
            return conexion;
        }
        #endregion

        public SqlConnection ConexionDB()
        {
            SqlConnection conexion = new SqlConnection
            {
                //ConnectionString = @"Data Source=SQL8001.site4now.net;Initial Catalog=db_aad627_greentfor;User Id=db_aad627_greentfor_admin;Password=Ortiz20242024@"
                ConnectionString = "Data Source=.;Initial Catalog=IntendenciaDb;Integrated Security=True"
            };

            return conexion;
        }
    }
}
