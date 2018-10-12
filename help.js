function LinearEquation(k,b) {
	this.k=k;
	this.b=b;
	this.fun=function(x) {return Math.round(k*x+b);}; //注意，这里返回的是整数化的值
	this.invfun=function(y) {return Math.round((y-b)/k);};
	this.intersection=function(line) { //注意，这里返回的是整数化的值
		var left=this.k-line.k;
		var right=line.b-this.b;
		var x=right/left;
        return {x:Math.round(x),y:Math.round(this.fun(x))};
	};
	this.measuringPoint=function(pos) { //测点法，三线闭锁检查使用，待会再写

	};
}

function Line(equation) {
    //私有
    var X=function(pos) {return pos.x;};
    var Y=function(pos) {return pos.y;};
    this.isParallel=function(XorY) {
        var px=XorY(this.inLinePos[0]);
        for(var i=1;i<this.inLinePos.length;i++) {
            if(XorY(this.inLinePos[i])!==px)
                return false;
        }
        return true;
    };
    this.isParallelY=function() {return this.isParallel(X)};
    this.isParallelX=function() {return this.isParallel(Y)};
    //私有结束
	this.equation=equation;
	this.inLinePos=[];
	this.residualPoint=[];
	this.endPos=[];
	this.LLEP=[]; //这条线上的点派生出的线，也就是可能的下一条边
	this.getInLine=function(markPos) {
		for(var i=0;i<markPos.length;i++) {
			if(markPos[i].y==this.equation.fun(markPos[i].x)) {
                this.inLinePos.push({x:x,y:y});
				markPos.splice(i,1);
			}
		}
        this.residualPoint=markPos;
	};
	this.findEndpos=function() {
		var sortfun;
		if(this.isParallelY())  //与y轴平行
			sortfun=function(pos1,pos2) {return pos1.y>pos2.y;}; //以y为基准排序
		else
		    sortfun=function(pos1,pos2){return pos1.x>pos2.x;}
		this.inLinePos=sort(this.inLinePos,sortfun);this.endPos=[this.inLinePos[0],this.inLinePos[this.inLinePos.length-1]];
	};
	this.isLine=function() { //目前判断全连通，如果要支持虚线，需要重写
		var calufun,indAxis;
		if(this.isParallelY()) { //以y为基准排序，y小的一定在前面，则用y索引
			calufun=this.equation.invfun;
			indAxis=Y;
		}
		else {
			calufun=this.equation.fun;
			indAxis=X;
		}
		var i=indAxis(this.endPos[0]); //i是索引轴，检查的是i对应的那个
		for(var pos in this.inLinePos) {
			if(calufun(i)!==calufun(indAxis(pos)))
				return false;
			i++;
		}
        return true;
    };
	this.equals=function(line) {return line.equation.k==this.equation.k&&line.equation.b==this.equation.b};
}

function calculationEquation(pos1,pos2) {
	var left=pos1.y-pos2.y;
	var right=pos1.x-pos2.x;
	var k=left/right;
	return new Line(new LinearEquation(k,pos1.y-(pos1.x*k)));
}
