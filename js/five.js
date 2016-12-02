$(function(){
	var canvas=$("#canvas").get(0);
	var ctx=canvas.getContext("2d");
	var audio=$("#audio").get(0);	
	var music=$("#music").get(0);	
	var sep=40;
	var sR=6;
	var bR=18;
	var qizi={};
	var flag=true;
	var time1;
	var time;
	var AI=false;
	var gameState="pause";
	var kongbai={};
	var de=0;
	var des=0;
	function l(x){
		return (x+0.5)*sep+0.5;
	}	
	function circle(x,y){
		ctx.save();
		ctx.beginPath();
		ctx.translate(l(x),l(y))
		ctx.arc(0,0,sR,0,Math.PI*2)
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
	
	
	
	
	function drawQipan(){
		ctx.clearRect(0,0,640,640)		
		ctx.save();
		ctx.beginPath();
		for(var i=0;i<15;i++){
			ctx.moveTo(l(i),l(0))
			ctx.lineTo(l(i),l(14))
			ctx.moveTo(l(0),l(i))
			ctx.lineTo(l(14),l(i))
		}
		
		ctx.closePath();
		ctx.stroke();
		ctx.restore();		
		circle(3,3)
		circle(3,11)
		circle(7,7)
		circle(11,3)
		circle(11,11)
		for(var j=0;j<15;j++){
			for(var k=0;k<15;k++){
				kongbai[j+"_"+k]=true;
				console.log(kongbai[j+"_"+k])
			}
		}
		
		
	}
	drawQipan();
	
	
	
	function luozi(x,y,color){		
		ctx.save();
		ctx.translate(l(x),l(y))
		ctx.beginPath();
		var g=ctx.createRadialGradient(-4,-4,0,0,0,18);
		if(color=='black'){			
			g.addColorStop(0.2,'#ddd');
			g.addColorStop(0.3,'#ccc');
			g.addColorStop(1,'black');
			clearInterval(time1)
			des=0;
			second();
			time=setInterval(seconds,1000);
			
		}else{
			g.addColorStop(0.2,'#fff');
			g.addColorStop(1,'#ddd');
			clearInterval(time)	
			de=0;
			seconds();
			time1=setInterval(second,1000);
		}
		ctx.fillStyle=g;
		ctx.arc(0,0,bR,0,Math.PI*2);
		ctx.shadowOffsetX=2;
		ctx.shadowOffsetY=3;
		ctx.shadowColor='#666';
		ctx.shadowBlur=5;
		ctx.closePath();
		ctx.fill();
		ctx.restore();
		qizi[x+'_'+y]=color;
		gameState="play";
		delete kongbai[x+'_'+y];
		
	}
	
	
	function handleclick(e){
		var x=Math.floor(e.offsetX/sep);
		var y=Math.floor(e.offsetY/sep);		
		if(qizi[x+'_'+y]){			
			return;	
		}
//		人机
		if(AI){
			luozi(x,y,"black")
			if(panduan(x,y,"black")===5){
				console.log("黑棋赢")
				$(canvas).off("click")
				chessMinual();				
				$(".win").addClass("again")	;						
				$(".alert").find("li").eq(0).html("黑棋赢")
			}
			var p=intel();
			luozi(p.x,p.y,"white")
			if(panduan(p.x,p.y,"white")===5){
				console.log("白棋赢");
				$(".false").addClass("again");
				$(".alert").find("li").eq(0).html("白棋赢")				
				$(canvas).off("click");
				chessMinual();
			}
			return false;
		}	
//		人人
		if(flag){
			luozi(x,y,"black")
			panduan(x,y,"black");
			if(panduan(x,y,"black")===5){
				console.log("黑棋赢")
				$(canvas).off("click")
				chessMinual();				
				$(".alert").addClass("again")
				$(".alert").find("ul").addClass("ulll")
				$(".alert").find("li").eq(0).html("黑棋赢")
			}
			
		}else{				
			luozi(x,y,"white");
			panduan(x,y,"white");
			if(panduan(x,y,"white")===5){
				console.log("白棋赢");
				$(".alert").addClass("again");
				$(".alert").find("li").eq(0).html("白棋赢")	
				$(".alert").find("ul").addClass("ulll")
				$(canvas).off("click");
				chessMinual();
			}
		}
		flag=!flag;
		audio.play();
	}
	
	$(canvas).on("click",handleclick)
	
//	人机

	function intel(){
		var max=-Infinity;
		var pos={};
		for(var k in kongbai){
			var x=parseInt(k.split("_")[0]);
			var y=parseInt(k.split("_")[1]);
			var m=panduan(x,y,"black")
			if(m>max){
				max=m;
				pos={x:x,y:y};
			}
		}
		var max1=-Infinity;
		var pos1={};
		for(var k in kongbai){
			var x=parseInt(k.split('_')[0]);
			var y=parseInt(k.split('_')[1]);
			var m1=panduan(x,y,"white");
			if(m1>max1){
				max1=m1;
				pos1={x:x,y:y};
			}
			
		}
		if(max>max1){
			return pos;
		}else{
			return pos1;
			
		}

		
	}
	
	var can=$("#can").get(0);
	var ctx1=can.getContext("2d");

	
	chessMinual=function(){
		var i=1;
		if(qizi[i]==="white"){
				ctx.fillStyle="black";			
		}else if(qizi[i]==="black"){
				ctx.fillStyle="white";			
		}
		ctx.save();		
		ctx.font='16px/1    微软雅黑'
		ctx.textAlign="center"
		ctx.textBaseline="middle";
		for(var j in qizi){			
			var arr=j.split("_");			
			ctx.fillText(i,l(parseInt(arr[0])),l(parseInt(arr[1])));
			i++;
		}		
		if($(".box").find("img").length){		
			$(".box").find("img").attr('src',canvas.toDataURL());	
		}else{
			$("<img>").attr('src',canvas.toDataURL()).appendTo(".box")		
		}
		if($(".box").find("a").length){
			$("<a>").attr('href',canvas.toDataURL()).attr('download','qipu.png')			
		}else{
			$("<a>").attr('href',canvas.toDataURL()).attr('download','qipu.png').appendTo(".box");				
		}

		ctx.restore();
		
	}
	
//	开始界面
	var start=$(".start");
	var bg=$("#bg")
	var game=$(".sg");
	game.on("click",function(){
		start.animate({top:"-100%"},600)
		bg.show();	
		againnew()
	})	
	function m(x,y){
		return x + '_' +y;
	}
	
//	判断
	function panduan(x,y,color){
//		行
		var row=1;
		var i=1;while(qizi[m(x+i,y)]===color){row++;i++;}
		var i=1;while(qizi[m(x-i,y)]===color){row++;i++;}	
		
//		列
		var lie=1;
		var i=1;while(qizi[m(x,y+i)]===color){lie++;i++}
		var i=1;while(qizi[m(x,y-i)]===color){lie++;i++}
		
//		斜
		var zX=1;
		var i=1;while(qizi[m(x+i,y+i)]===color){zX++;i++}
		var i=1;while(qizi[m(x+i,y-i)]===color){zX++;i++}
		
		var yX=1;
		var i=1;while(qizi[m(x-i,y+i)]===color){yX++;i++}
		var i=1;while(qizi[m(x-i,y-i)]===color){yX++;i++}
		
		return Math.max(row,lie,zX,yX);	
	}
	
//	棋谱显示和消失
	$(".chess").on("click",function(){
		$(".box").addClass("qipu");		
		chessMinual();
		$(canvas).off("click")
		for(var k in qizi){
			var x=parseInt(k.split("_")[0])
			var y=parseInt(k.split("_")[1])
			luozi(x,y,qizi[k])
			
		}
	})
	
	
	$(".close").on("click",function(){
		$(".box").hide();
		$(canvas).on("click",handleclick)
	})
	
//	再来一次、重新开始
	function againnew(){
		drawQipan();
		de=0;
		des=0;
		clearInterval(time);
		clearInterval(time1);
		seconds();
		second();
		$(canvas).on("click",handleclick)
		flag=true;
		qizi={};		
		gameState="pause"
		$(canvas).on("click",handleclick)
		$(".alert").removeClass("again")
		$(".againone").removeClass("again1");		
	}
	
	
	
	
	$(".alert").find("li").eq(1).on("click",againnew)
	$(".robot").find("li").eq(3).on("click",againnew)
	$(".hidden").find("span").eq(0).on("click",againnew)
	$(".false").on("click",function(){
		$(".againone .hidden").find("span").eq(0).html("您输了，再来一局试试？");
		$(".againone").addClass("again1");
		$(".false").removeClass("again");
	})
	
	
	$(".win").on("click",function(){
		$(".againone").addClass("again1");
		$(".againone .hidden").find("span").eq(0).html("恭喜您，再来一局试试");
		$(".win").removeClass("again");
	})
//	模式切换

//	人机
	$(".robot").find("li").eq(0).on("click",function(){		
		if(gameState==="play"){
			return;
		}
		$(".robot").find("li").removeClass("p-r");			
		$(".robot").find("li").eq(0).addClass("p-r")
		AI=true;
	})
//	人人
	$(".robot").find("li").eq(1).on("click",function(){
		
		if(gameState==="play"){
			return;
		}
		$(".robot").find("li").removeClass("p-r");			
		$(".robot").find("li").eq(1).addClass("p-r");
		AI=false;
		
	})
	//	时间
	function format(v){
		v=Math.floor (v);
		var s = v % 60;
		s=(s<10)?("0"+s):s;
		var m=Math.floor(v/60);
		return m + ":" + s;
	}
//	第一个表
	
	function seconds(){
		ctx1.clearRect(0,0,200,200);
		ctx1.save();		
		ctx1.translate(100,100)		
		ctx1.rotate(Math.PI/180 * 6 * de);		
		ctx1.beginPath();		
		ctx1.lineWidth=2;					
		ctx1.lineCap="round";		
		ctx1.moveTo(0,0)
		ctx1.lineTo(0,-60)		
		ctx1.closePath();
		ctx1.stroke();
		console.log(de)		
		ctx1.restore();		
		$("#time").html(format(de))
		de+=1;
	}	
	seconds();
	
	var can=$("#can1").get(0);
//	第二个表
	
	var ctx2=can.getContext("2d");
	function second(){
		ctx2.clearRect(0,0,200,200);
		ctx2.save();
		ctx2.translate(100,100)		
		ctx2.rotate(Math.PI/180 * 6 *des);	
		ctx2.beginPath();		
		ctx2.lineWidth=2;					
		ctx2.lineCap="round";		
		ctx2.moveTo(0,0)
		ctx2.lineTo(0,-60)		
		ctx2.closePath();
		ctx2.stroke();		
		ctx2.restore();
		$("#time1").html(format(des))
		des+=1;
	}		  
	second();
	
//	退出
function tui(){
	start.animate({top:"0"},600)
	bg.hide();
	againnew();
	clearInterval(time);
	clearInterval(time1);
}
	$(".robot").find("li").eq(4).on("click",tui)
	$(".alert").find("li").eq(2).on("click",tui)
	$(".hidden").find("span").eq(1).on("click",tui)
	
	
	
	
	
	
})

