'use strict'

			canvas.width = canvasWidth;
			canvas.height = canvasHeight; 
			
			var spriteWidth = 864; 
			var spriteHeight = 280; 
			
			var ctx = canvas.getContext("2d");
			
			var character = new Image(); 
			character.src = "./src/img/EnnemyOne.png";
			
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
			
			function updateFrame(){
				curFrame = ++curFrame % frameCount; 				
				srcX = curFrame * width; 
				ctx.clearRect(x,y,width,height);	
				
				if(left && x>0){
					srcY = trackLeft * height; 
					x-=speed; 
				}
				if(right && x<canvasWidth-width){
					srcY = trackRight * height; 
					x+=speed; 
				}
			}
			
			function draw(){
				updateFrame();
				ctx.drawImage(character,srcX,srcY,width,height,x,y,width,height);
			}
			
			
			function moveLeft(){
				left = true; 
				right = false; 
			
			}
			
			function moveRight(){
				left = false;
				right = true; 
		
				
			// setInterval(draw,100);
			
		}
	
