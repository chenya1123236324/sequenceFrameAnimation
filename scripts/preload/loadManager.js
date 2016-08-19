
var LoadManager_LH = function(data,base) {
	this.isComplete = false;

	this.texData = data;
	this.resultData = {};
	this.loader = null;

	this.onLoadProgress = null;
	this.onLoadComplete = null;
	this.onFileComplete = null;

	this.init(base);
}

LoadManager_LH.prototype = {
	init: function(base){
		this.isComplete = false;

		this.loader = new createjs.LoadQueue(false, base || '');
		this.loader.on("fileload", this.handleFileLoad, this);
		this.loader.on("complete", this.handleComplete, this);
		this.loader.on("progress", this.handleProgress, this);
		this.loader.on("error", this.handleError, this);

		this.initData();
	},

	initData: function(){
		var texData = this.texData;
		if(texData){
			for (var i in texData){
				var data = texData[i];
				if(typeof(data)=="object"){
					//console.log( "--"+ i +", "+ typeof(data));
					//console.log( data );

					this.analyzeData(i,data);
				}
			}
		}
	},

	load: function(){
		this.loader.load();
	},

	analyzeData: function(id,data){
		var type = data.type;
		if(type == "img"){
			this.addSrc(id, data.src);
			this.resultData[id] = null;
		}else if(type == "ani"){
			this.analyzeAni(id,data);
			this.resultData[id] = [];
		}
	},

	analyzeAni: function(id,data){
		var start = data.start;
		var end = data.end;
		var cid = 0;
		var idx = start;
		var total = end;
		var v = 1;
		var digit = Math.max(end,start).toString().length;

		// console.log(digit);

		if(start>=0 && end>=0){
			if(start>end){
				idx = start;
				total = end;
				v = -1;
			}
			this.loadAniImg(id,idx,cid,data.prefix,data.suffix,digit);

			// console.log(idx,total,v);
			while(true){
				idx += v;
				cid ++;
				this.loadAniImg(id,idx,cid,data.prefix,data.suffix,digit);
				if(idx==total) return;
			}
		}
	},

	loadAniImg: function(id,idx,cid,prefix,suffix,digit){
		var zero ="";
		var dig = idx.toString().length;
		if(dig < digit){
			for(var i=0;i<dig;i++){
				zero += "0";
			}
		}
		var src = prefix + zero + idx + suffix;
		var srcId = "ani#"+id+"#"+cid;

		// console.log(srcId,src);
		this.addSrc(srcId,src);
	},

	addSrc: function(id,src){
		// console.log(id,src);
		this.loader.loadFile({id:id, src:src});
	},

	analyzeSrc: function(item){
		if(item){
			var name = item.id;
			var nameArr = name.split('#');

			if(nameArr.length>=3){
				if(nameArr[0]=='ani'){
					var id = parseInt(nameArr[2]);
					var srcid = nameArr[1];

					this.resultData[srcid][id] = item.result;
					//console.log(nameArr[2]);
				}
			}else{
				this.resultData[name] = item.result;
			}
		}
	},

	handleFileLoad: function(event){
		var item = event.item;
		item.result = event.result;
		//console.log(item);
		this.analyzeSrc(item);

		if(this.onFileComplete){
			this.onFileComplete(event);
		}
	},

	handleProgress: function(event){
		//console.log(loader.progress);

		if(this.onLoadProgress){
			this.onLoadProgress(event.progress);
		}
	},

	handleComplete: function(event){
		//console.log(this.resultData);
		this.isComplete = true;

		if(this.onLoadComplete){
			this.onLoadComplete(this.resultData);
		}
	},

	handleError: function(loader, res){
		console.log("Error_LoadManager_LH----------------------");
		console.log(loader);
	}
}
