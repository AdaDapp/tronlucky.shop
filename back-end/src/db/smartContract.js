var mysql = require('mysql');
var connection=mysql.createConnection({
     //Options
    host:'localhost',
    port: '3306',
    user:'root',
    password:'luckyshop@18',
    database:'smart'
});

function handleDisconnect(){
    connection.connect(function (err) {
        // callback(err,result);
        if(err){
            console.log(err);
            console.log("try to connect");
            setTimeout(handleDisconnect,1000);  //经过1秒后尝试重新连接
            return;
        }
        console.log("Success");
    });
}
handleDisconnect();


class dbClass {

	// 插入投注明细表
	async insertBetDetailInfo(array){
		return await new Promise((resolve, reject) => {
			var  addSql = "INSERT INTO smart.bet_detail_info(player, amount, round, create_date, creator, modify_date, modifier) VALUES(?,?,?,now(),'admin',now(),'admin')";
			connection.query(addSql, array, function(err, rsp) {
				if(err){
					reject(err);
				}else{
					let data = '';
					resolve(rsp);
				}
			});
		});
	}

	// 插入中奖结果信息表
	async insertWinDetailInfo(array){
		return await new Promise((resolve, reject) => {
			var  addSql = "INSERT INTO smart.win_detail_info(player, round, bonus, create_date, creator, modify_date, modifier) VALUES(?,?,?,now(),'admin',now(),'admin')";
			connection.query(addSql, array, function(err, rsp) {
				if(err){
					reject(err);
				}else{
					let data = '';
					resolve(rsp);
				}
			});
		});
	}

	// 查询所有投注
	async getAllBetList(){
		return await new Promise((resolve, reject) => {
			connection.query('select * from smart.bet_detail_info order by id desc', function(err, rsp) {
				if(err){
					reject(err);
				}else{
					let data = '';
					resolve(rsp);
				}
			});
		});
	}

	// 查询当天投注
	async getTodayBetList(){
		return await new Promise((resolve, reject) => {
			connection.query('select * from smart.bet_detail_info where to_days(create_date) = to_days(now()) order by id desc', function(err, rsp) {
				if(err){
					reject(err);
				}else{
					let data = '';
					resolve(rsp);
				}
			});
		});
	}


	// 查询我的投注
	async getMineBetList(player){
		return await new Promise((resolve, reject) => {
			var sql = 'select * from smart.bet_detail_info where player = ?'
			connection.query(sql, player, function(err, rsp) {
				if(err){
					reject(err);
				}else{
					let data = '';
					resolve(rsp);
				}
			});
		});
	}
}

var dbUtils = new dbClass();
export default dbUtils;
