using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GoBangAI
{
    class Program
    {
        static void Main(string[] args)
        {
            //接收api
            Api Api = new Api();
            Console.WriteLine("接收API中");
            string Chess_Get = Api.API_Get();
            Console.WriteLine("接收API完畢");

            //判斷落子
            Console.WriteLine("開始AI判斷");
            string Coordinate = JudgeAI.Judge(Chess_Get);
            Console.WriteLine("AI判斷完畢");

            //回傳落子位置
            Console.WriteLine("開始回傳位置");
            Api.API_Set(Coordinate);
            Console.WriteLine("AI判斷完畢");

        }
    }
}
