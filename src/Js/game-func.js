'use strict'
var debug = true;
var clog = function (toLog) {
  debug && console.log(toLog);
};


window.onload = function () {

//Déclaration des poissons

//var canvas = document.getElementById('canvas');
var canvasWidth =1200; 
var canvasHeight = 700;

			canvas.width = canvasWidth;
			canvas.height = canvasHeight; 
			
			var spriteWidth = 1892; 
			var spriteHeight = 301; 
			
			var ctx = canvas.getContext("2d");
			
			var character = new Image(); 
			character.src = "./src/img/shark.png";
			
			var rows = 2; 
			var cols = 8; 
			
			var trackRight = 0; 
			var trackLeft = 1; 
			
			var width = spriteWidth/cols; 
			var height = spriteHeight/rows; 
			
			var curFrame = 0; 
			var frameCount = 8; 
			
			var x=100;
			var y=500; 
			
			var srcX; 
			var srcY; 
			
			var left = true; 
			var right = false;
			
			var speed = 6; 

			var collisionFish = false;

			// function Shark(option) {
			// 	this.x = option.x;
			// 	this.y = option.y;
			// 	this.curFrame = option.curFrame; 
			// 	this.frameCount = option.frameCount;
			// }

			// Shark.prototype.updateFrame = function(){
			// 	this.curFrame = ++this.curFrame % this.frameCount; 				
			// 	srcX = this.curFrame * width; 
			// 	ctx.clearRect(0,0,canvas.width,canvas.height);
				
			// 	if(left && x>0){
			// 		srcY = trackLeft * height; 
			// 		this.x-=speed; 
			// 	}
			// 	if(right &&  x < canvasWidth - width){
			// 		srcY = trackRight * height; 
			// 		this.x+=speed; 
			// 	}
			// }
			

			// Shark.prototype.draw = function(){
			// 	// this.updateFrame();
			// 	ctx.drawImage(character,srcX,srcY,width,height,x,y,width,height);
			// }

			// var shark = new Shark({
			// 	x: 100,
			// 	y: 500,
			// 	curFrame: 0,
			// 	frameCount: 8
			// });

			// console.log(shark)

			// }
			
			function updateFrame(){
				curFrame = ++curFrame % frameCount; 				
				srcX = curFrame * width; 
				ctx.clearRect(0,0,canvas.width,canvas.height);
				
				if(left && x>0){
					srcY = trackLeft * height; 
					x-=speed; 
				}
				if(right &&  x < canvasWidth - width){
					srcY = trackRight * height; 
					x+=speed; 
				}
			}
			

			function draw(){
				updateFrame();
				ctx.drawImage(character,srcX,srcY,width,height,x,y,width,height);
			}
			
			//// Mouvements requins 
			
			function moveLeft(){
				left = true; 
				right = false; 
			
			}
			
			function moveRight(){
				left = false;
				right = true; 
		
				
			// setInterval(draw,100);
			
		}

////// creation des poissons mechants 


//////// creations des poissons mechants 



var maxF = 3; // Nombre maximum d'ennemis sur le canvas
var fishes = []; // Tableau à remplir avec les ennemis créés

 // Fonction permettant d'obtenir un nombre random entre un min et un max //
 function random(min, max) {
	return Math.random() * max + min;
}

// Fonction constructeur de Fish //
var FishFactory = function () {
	this.x = random(0, (canvas.width - 67));
	this.y = 250;
	this.width = 67;
	this.height = 50;
	this.speed = random(0.5, 1); // Donne une vitesse à la chute des fish
	this.image = new Image();
	this.image.src = 'src/img/ennemy01.png';
};

FishFactory.prototype.draw = function (ctx) { // Permettra de dessiner le Fish sur le canvas
	ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
};

FishFactory.prototype.update = function () {
	// This correspond au Fish ayant appelé cette méthode
	this.y += this.speed;
	// Si le Fish dépasse le bas de l'écran
	if (this.y > canvas.height - 50) {
		// Retrouver le Fish dans le tableau de fish
		for (var i = 0; i < fishes.length; i++) {
			var fish = fishes[i]
			// Retirer le Fish du tableau avec .splice()
			if (this == fish) {
				fishes.splice(i, 1);
				// Quand character loupe un Fish il perd une vie
			}
		}
	}
	
};

// Créer un nouveau Fish et l'ajoute au tableau de fish //
var intervalT = setInterval(function () {
	var fish = new FishFactory();
	if (fishes.length < maxF) {
		fishes.push(fish);
	}
}, 200)

// Fonction Fish à mettre dans le gameLoop
var renderFish = function () {
		for (var i = 0; i < fishes.length; i++) {
			var fish = fishes[i];
			fish.draw(canvas.getContext("2d"));
			fish.update();
		}
}


// Collisions entre character et les fish //
var collisionF = function () {
    for (var i = 0; i < fishes.length; i++) {
      var fish = fishes[i];
      if (character.x < fish.srcX + fish.width / 5 && character.x + character.width > fish.srcX && character.y < fish.srcY + fish.height / 5 && character.y + character.height > fish.srcY) {
        collisionFish = true;
        fishes.splice(i, 1);
      };
    };
  };

  // Va tester en boucle si il y a collision (à mettre dans le gameLoop) //
  var collisionTest = function () {
    collisionFish = false;
	collisionF();
  };



		window.document.onkeydown = function (event) {
			var code = event.keyCode; // On récupère ici le code de la touche
			var keys = [37, 39]
			
			switch (code) {
			  case 39: // Droite
				moveRight();
				break;

			  case 37: // Gauche
				moveLeft();
				break;
			}
		}


		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		(function Gloop(){
			
			window.requestAnimationFrame(Gloop);
			draw();
			renderFish();
			collisionTest();
		
		})();
	}
			

					
			
		



				