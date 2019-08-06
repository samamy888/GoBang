var app = angular.module('TestApp', []);
app.controller('App', function ($scope, $http) {
	var ctx = document.getElementById("canvas").getContext("2d");
	var WindowCenter;
	var TitleHeight;
	var White_Image;
	var Black_Image;
	var Turn = false;
	$scope.GoBangSize = 10;
	$scope.WindowClear = function () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	$scope.DrawTheCenter = function (WindowCenter) {
		//中間畫XX
		ctx.strokeStyle = "black";
		var CenterSize = 10;
		ctx.beginPath();
		ctx.moveTo(WindowCenter.x + CenterSize, WindowCenter.y - CenterSize);
		ctx.lineTo(WindowCenter.x - CenterSize, WindowCenter.y + CenterSize);
		ctx.moveTo(WindowCenter.x - CenterSize, WindowCenter.y - CenterSize);
		ctx.lineTo(WindowCenter.x + CenterSize, WindowCenter.y + CenterSize);
		ctx.closePath();
		ctx.stroke();
	}
	$scope.DrawBg = function (size) {

		if (size % 2 != 0) {
			alert("請輸入2的倍數");
			return;
		}
		$scope.Size = size;
		$scope.WindowClear();

		var WindowHeight = document.body.clientHeight;
		var WindowWidth = document.body.clientWidth;
		TitleHeight = 100;
		WindowCenter = { x: WindowWidth / 2, y: WindowHeight / 2 - TitleHeight }; //網頁中心
		$scope.WindowCenter = WindowCenter;
		var MaxGap = 50;
		$scope.BoardGap = MaxGap - (size / 2 - 5) * 5;  //棋盤間隔
		ctx.strokeStyle = "#FF0000"; //線條顏色
		for (tmp = 0; tmp <= size / 2; tmp++) {

			//畫直線
			ctx.beginPath();
			ctx.moveTo(WindowCenter.x + tmp * $scope.BoardGap, WindowCenter.y - size / 2 * $scope.BoardGap);
			ctx.lineTo(WindowCenter.x + tmp * $scope.BoardGap, WindowCenter.y + size / 2 * $scope.BoardGap);
			ctx.moveTo(WindowCenter.x - tmp * $scope.BoardGap, WindowCenter.y - size / 2 * $scope.BoardGap);
			ctx.lineTo(WindowCenter.x - tmp * $scope.BoardGap, WindowCenter.y + size / 2 * $scope.BoardGap);
			ctx.closePath();
			ctx.stroke();

			//畫橫線
			ctx.beginPath();
			ctx.moveTo(WindowCenter.x - size / 2 * $scope.BoardGap, WindowCenter.y + tmp * $scope.BoardGap);
			ctx.lineTo(WindowCenter.x + size / 2 * $scope.BoardGap, WindowCenter.y + tmp * $scope.BoardGap);
			ctx.moveTo(WindowCenter.x - size / 2 * $scope.BoardGap, WindowCenter.y - tmp * $scope.BoardGap);
			ctx.lineTo(WindowCenter.x + size / 2 * $scope.BoardGap, WindowCenter.y - tmp * $scope.BoardGap);
			ctx.closePath();
			ctx.stroke();

		}

		$scope.DrawTheCenter(WindowCenter);


	}
	$scope.InitImage = function () {
		White_Image = new Image();
		Black_Image = new Image();
		White_Image.src = "~/../Content/Image/White.png";
		Black_Image.src = "~/../Content/Image/black.png";
	}
	$scope.InitArray = function () {
		$scope.Data = new Array($scope.Size + 1);
		$scope.Winner = "";
		for (var i = 0; i < ($scope.Size + 1) ; i++) {
			$scope.Data[i] = new Array($scope.Size + 1);
		}
		for (var i = 0; i < ($scope.Size + 1) ; i++) {
			for (var j = 0; j < ($scope.Size + 1) ; j++) {
				$scope.Data[i][j] = 0;
			}
		}
	}
	$scope.MouseMove = function ($event) {
		var MouseRange = 10;
		var MouseFix = { x: -15, y: -15 };
		$scope.X = $event.x + MouseFix.x;   // Get the horizontal coordinate
		$scope.Y = $event.y + MouseFix.y - TitleHeight;  // Get the vertical coordinate
		$scope.Click = { x: Math.round((WindowCenter.x - $scope.X) / $scope.BoardGap), y: Math.round((WindowCenter.y - $scope.Y) / $scope.BoardGap) };
		var Distance = { x: Math.abs(WindowCenter.x - $scope.X) % ($scope.BoardGap), y: Math.abs(WindowCenter.y - $scope.Y) % ($scope.BoardGap) };
		if ($scope.BoardGap - Distance.x < MouseRange) {
			Distance.x = $scope.BoardGap - Distance.x;
		}

		if ($scope.BoardGap - Distance.y < MouseRange) {
			Distance.y = $scope.BoardGap - Distance.y;

		}

		//console.log((Distance.x).toString() + "  " + (Distance.y).toString());
		if (Distance.x < MouseRange && Distance.y < MouseRange) {
			$scope.MouseStyle = {
				"cursor": 'pointer'
			};

		} else {
			$scope.MouseStyle = {
				"cursor": 'auto'
			};
			$scope.Click.x = 0;
			$scope.Click.y = 0;
		}

	}
	$scope.Victory = function (X, Y) {
		//判斷勝負
		//檢查左右
		var Set = $scope.Data[X][Y];
		var Count = { I: 1, L: 0, R: 0, U: 0, D: 0 , P: 0, N: 0};
		for (var TmpY = (Y - 1) ; TmpY > 0; TmpY--) {
			if ($scope.Data[X][TmpY] == Set)
				Count.L++;
			else
				break;
		}
		for (var TmpY = (Y + 1) ; TmpY < $scope.Size; TmpY++) {
			if ($scope.Data[X][TmpY] == Set)
				Count.R++;
			else
				break;
		}
		var SumLR = Count.I + Count.L + Count.R;
		//console.log("TotalLR: Get: " + SumLR);
		//檢查上下
		for (var TmpX = (X - 1) ; TmpX > 0; TmpX--) {
			if ($scope.Data[TmpX][Y] == Set)
				Count.U++;
			else
				break;
		}
		for (var TmpX = (X + 1) ; TmpX < $scope.Size; TmpX++) {
			if ($scope.Data[TmpX][Y] == Set)
				Count.D++;
			else
				break;
		}
		var SumUD = Count.I + Count.U + Count.D;
		//console.log("TotalUD: Get: " + SumUD);
		//檢查正斜線	Slash
		for (var Tmp = 1 ; Tmp < 5; Tmp++) {
			if ($scope.Data[X-Tmp][Y+Tmp] == Set)
				Count.P++;
			else
				break;
		}
		for (var Tmp = 1 ; Tmp < 5; Tmp++) {
			if ($scope.Data[X + Tmp][Y - Tmp] == Set)
				Count.P++;
			else
				break;
		}
		var SumP = Count.I + Count.P;
		//console.log("TotalP: Get: " + SumP);

		//檢查副斜線 Slash

		for (var Tmp = 1 ; Tmp < 5; Tmp++) {
			if ($scope.Data[X - Tmp][Y - Tmp] == Set)
				Count.N++;
			else
				break;
		}
		for (var Tmp = 1 ; Tmp < 5; Tmp++) {
			if ($scope.Data[X + Tmp][Y + Tmp] == Set)
				Count.N++;
			else
				break;
		}
		var SumN = Count.I + Count.N;
		//console.log("TotalN: Get: " + SumN);

		//計算加總

		if (SumLR == 5 || SumUD == 5 || SumP == 5 || SumN == 5) {
			if (Set == 1)
				$scope.Winner = "白";
			else
				$scope.Winner = "黑";
		}

	}
	$scope.MouseClick = function () {
		if ($scope.MouseStyle.cursor == 'auto') {
			return;
		}
		var Image;
		var Set = 0;
		var DrawPositionFix = { x: -30, y: -25 };
		if (Turn) {
			Image = White_Image;
			Set = 1;
		}

		else {
			Image = Black_Image;
			Set = 2;
		}

		var DrawImagePosition = { x: WindowCenter.x - $scope.Click.x * 50 + DrawPositionFix.x, y: WindowCenter.y - $scope.Click.y * 50 + DrawPositionFix.y };
		ctx.drawImage(Image, DrawImagePosition.x, DrawImagePosition.y, $scope.BoardGap * 1.2, $scope.BoardGap);
		Turn = !Turn;
		$scope.Data[Math.abs($scope.Click.y - $scope.Size / 2)][Math.abs($scope.Click.x - $scope.Size / 2)] = Set;
		console.log($scope.Data);
		$scope.Victory(Math.abs($scope.Click.y - $scope.Size / 2), Math.abs($scope.Click.x - $scope.Size / 2));
	}
	$scope.VictoryShow = function () {
		if ($scope.Winner != "")
			return true;
		else
			return false;
	}
})
