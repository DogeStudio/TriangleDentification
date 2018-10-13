var markPos=[];
for (var x=0;x<picture.length;x++) {
	for (var y=0;y<picture[x].length;y++) {
		if(picture[x][y]===1)
			markPos.push({x:x,y:y}); //假设图片通过opencv读取，xy要单独提取
	}
}

function posEquals(pos1,pos2) {return pos1.x===pos2.x&&pos1.y===pos2.y;}
function findLine(startPos,father,grather) {
	var LEP=[];
	//Σ(i=0,k,L[i])=a-1
	findAllLine:
	for(var pos in markPos) {
		if(posEquals(startPos,pos)) //不判断和自己能否产生直线
			continue;

		var linear=calculationEquation(startPos,pos);
        //如果这条线和父线或者爷线平行，则不可能是扩展出的第二条边，舍弃
		if(father!==null) {
			if(linear.equation.k===father.equation.k)
				continue;
		}
        if(grather!==null) {
            if(linear.equation.k===grather.k)
                continue;
        }
        //确定这条线不和本次迭代找到的其它的线相同
		for(var aLEP in LEP) {
			if(aLEP.equals(linear))
				continue findAllLine;
		}
		linear.getInLine(markPos);
		linear.findEndpos();
		if(linear.isLine())
			LEP.push(linear);
	}
	return LEP; //注意，LEP为经过该点的所有直线的Lline List
}
var SLEP=findLine(markPos[0],null,null); //选择一个点，验证是否在三角形上的第一步，这里选择第一个标记点

function getSonLine(LEP,grather) { //更新一个LEP的LLEP字段，里面有经过经过这个点的直线上的点的直线
	var LLLEP=[];
	for(var Lline in LEP) { //LEP解包产生Lline
		markPos=Lline.residualPoint; //置待检查点为除这条线（以及其父线）上点之外的点
		for(var pos in Lline.inLinePos) {
			var newLEP=findLine(pos,Lline,grather);
			if(newLEP.length!==0)
				Lline.LLEP.push(newLEP);
		}
		if(Lline.LLEP!==0)
			LLLEP.push(Lline); //注意，这里是重构建列表。列表结构与原来相同，只是添加了儿子
	}
	return LLLEP; //LLLEP只是一个每个元素都有儿子的LEP
}
SLEP=getSonLine(SLEP,null);

function getGrandsonLine(SLEP) {
    var SLEP=[];
    for (var Lline in SLEP) { //解包产生第一条边
        //解包产生从该条边上可能产生的所有第二条边的LEP，做完遍历之后所有第二条边上点的LLEP字段被更新，为第三条边
        for(var LEP in Lline.LLEP)
            Lline.LLEP=getSonLine(LEP,Lline); //原来已经有值了，更新一下即可
        SLEP.push(Lline);
    }
    return SLEP;
}
SLEP=getGrandsonLine(SLEP);

function isPosIn(pos,endPos) {
	if((pos.y>=endPos[0].y&&pos<=endPos[1].y)||(pos.y>=endPos[1].y&&pos<=endPos[0].y)) {
		if((pos.x>=endPos[0].x&&pos<=endPos[1].x)||(pos.x>=endPos[1].x&&pos<=endPos[0].x))
			return true;
	}
	return false;
}
function judgeTriangle(line1,line2,line3) {
	var pos1=line1.intersection(line2);
	var pos2=line1.intersection(line3);
	var pos3=line2.intersection(line3);
	if(isPosIn(pos1,line1.endPos)&&isPosIn(pos1,line2.endPos)&&
		isPosIn(pos2,line1.endPos)&&isPosIn(pos2,line3.endPos)&&
		isPosIn(pos3,line2.endPos)&&isPosIn(pos3,line3.endPos)) {
		//检查三线闭锁，待会写
		return true;
	}
	return false;
}
var triangleList=[];
function isInTriangleList(line,list) {
	var newlist=[];
	for(var triangle in list) {
		if(line.equals(triangle[0])||line.equals(triangle[1])||line.equals(triangle[2]))
			newlist.push(triangle);
	}
	return newlist;
}
for(var Lline in SLEP) {
	for(var Lline2 in Lline.LLEP) {
		for(var Lline3 in Lline2.LLEP) {
			var sameTriangle=isInTriangleList(Lline,isInTriangleList(Lline2,isInTriangleList(Lline3,triangleList)));
			if(sameTriangle.length===0){
				if(judgeTriangle(Lline,Lline2,Lline3)) 
					triangleList.push([Lline,Lline2,Lline3]);
			}
		}
	}
}
