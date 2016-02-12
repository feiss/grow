ENGINE={};

Branch= function(x,y,l,a,d){
		this.x= x;
		this.y= y;
		this.a= a;
		this.len= l;
		this.depth= d || 1;
		this.life= 1;
		this.width= this.depth==1? 1: l/2;
}

ENGINE.Game = {
	
	create: function() {
		var self= this;
		this.params={
			heightFactor: 0.007,
			width: 3,
			maxdepth: 4,
			branchProb: 0.13,
			minaperture: 0.2,
			maxaperture: 0.6,
			leafMinDepth: 2,
			leafProb: 0.4,
			leafSize: 2,
			leafSeparation: 3,
			animated: true
		};
		this.gui= new dat.GUI();
		var f= this.gui.addFolder('GENERAL');
		f.closed= false;
		f.color= "#aa8"		
		f.add(this.params, 'heightFactor', 0.001,0.025);
		f.add(this.params, 'width', 1,30);

		f= this.gui.addFolder('BRANCHES');
		f.closed= false;
		f.add(this.params, 'maxdepth', 1,10).step(1);
		f.add(this.params, 'branchProb', 0,0.5);
		f.add(this.params, 'minaperture', 0,1);
		f.add(this.params, 'maxaperture', 0,2);
		
		f= this.gui.addFolder('LEAVES');
		f.closed= false;
		f.add(this.params, 'leafMinDepth', 0, this.params.maxdepth).step(1);
		f.add(this.params, 'leafProb', 0,1);
		f.add(this.params, 'leafSize', 0,10);
		f.add(this.params, 'leafSeparation', 0,50);

		this.gui.add(this.params, 'animated');
		this.gui.domElement.addEventListener('mousedown', function(ev){ev.stopPropagation()})
		this.fb= cq(this.app.width/1, this.app.height/1);
		this.refresh();
	},

	refresh: function(){
		this.fb.clear('#222');
		this.fb.fillStyle('#fff');		
		this.arbol=[];
		this.arbol.push( new Branch(this.app.width/2, this.app.height/1, 3, Math.PI/2));
		this.grow();
	},


	grow: function(animated){
		var alive= true;
		while(alive){
			alive= false;
			for (var i=0; i< this.arbol.length; i++){
				var a= this.arbol[i];
				if (a.life<=0) continue;
				if (!this.params.animated) alive= true;
				a.a+= Math.random()*0.1-0.05;
				a.x+= Math.cos(a.a);
				a.y-= Math.sin(a.a);
				//this.fb.a((this.MAXDEPTH-a.depth+1)/this.MAXDEPTH);
				if (Math.random() > 0.1+a.life && Math.random()<this.params.branchProb && a.depth < this.params.maxdepth) {
					this.arbol.push( new Branch(a.x, a.y, a.life*a.len*(0.5+Math.random()*0.5), a.a+(Math.random()<0.5?-1:1)*(this.params.minaperture+Math.random()*this.params.maxaperture), a.depth+1 ));
				}
				if (a.depth>this.params.leafMinDepth && Math.random() > 1-this.params.leafProb){
					this.fb.fillCircle(a.x+Math.random()*this.params.leafSeparation*2-this.params.leafSeparation, a.y+Math.random()*this.params.leafSeparation*2-this.params.leafSeparation, this.params.leafSize*Math.random());
				}
	
				this.fb.fillCircle(this.arbol[i].x, this.arbol[i].y, this.params.width*this.arbol[i].len/2*this.arbol[i].life);

				a.life-= this.params.heightFactor/a.len;
			}
		}

	},

	step: function(dt) {
		if (this.params.animated) this.grow();
	},

	render: function() {
		this.app.layer.save().scale(1,1).drawImage(this.fb.canvas, 0, 0).restore();
	},

	mousedown: function(){
		this.refresh();
	}

};
