'use strict'


window.onload = function () {
 
  /* Variables
  */

  /**
  * Config du jeu
  * moveSpeedX: vitesse de déplacement latéral du requin
  * moveSpeedY: vitesse de déplacement vertical du requin
  * maxFishes: nombre maximum de poissons rendus simultanément dans le canvas
  * fishedPopSpeed: vitesse d'apparition des poissons
  * life: nombre de vies du requin
  */
  var moveSpeedX = 6;
  var moveSpeedY = 2;
  var maxFishes = 3;
  var speedFishes = {
    min: 0.5,
    max: 1
  };
  var fishedPopSpeed = 1000;
  var life = 3;

  /* Canvas */
  var canvas = document.getElementById('canvas');
  canvas.height = 764;
  canvas.width = 1300;

  var context = canvas.getContext('2d');

  /* Informations */
  var displayLife = document.getElementById('life');

  /* Chargement des images pour les sprites */
  var backgroundSprite = new Image();
  backgroundSprite.src = './src/img/background.png';

  var sharkSprite = new Image();
  sharkSprite.src = './src/img/shark.png';

  var fishSprite = new Image();
  fishSprite.src = './src/img/ennemy01.png';

  /* Etat des touches du clavier */
  var keysDown = {
    left: false,
    up: false,
    right: false,
    down: false
  };

  /* Etat des collisions */
  var collisions = {
    left: false,
    up: false,
    right: false,
    down: false,
  };
  /* constantes pour les directions coté serveur */
  var LEFT = "37"
  var UP = "38"
  var RIGHT = "39"
  var DOWN = "40"

  var keyCode = null;

  /** Variables de calcul
  * makeItRain: le setInterval servant à générer les poissons
  * fishes: Les poissons générés
  */
  var makeItRain;
  var fishes = [];
  var score = 0;


  /**
  * Fonctions utilitaires
  */
  /* Générateur d'un nombre entier aléatoire */
  function random (min, max) {
    return Math.random() * max + min;
  };


  /**
  * Commandes du jeu
  * keyCode: Le code de la touche pressée
  * requiredKeys: les codes des touches servant à jouer
  * On met une condition au preventDefault afin de garder les autres touches
  * fonctionnelles, comme la touche F5 servant à rafraichir la page
  *
  * keyCode 37: touche flèche gauche
  * keyCode 38: touche flèche haut
  * keyCode 39: touche flèche droite
  * keyCode 40: touche flèche bas
  */
  
  /*Pour faire au plus simple on récupère purement le résultat*/
  window.document.onkeydown = function (event) {
    var requiredKeys = [37, 38, 39, 40];
    if (requiredKeys.indexOf(event.keyCode) !== -1) {
      event.preventDefault();
    }
    
    if (keyCode !== event.keyCode){
      keyCode = event.keyCode;
      $.ajax({
        method: "POST",
        url: "http://88.187.112.10:3000/session/inputs",
        data: { "input" : keyCode },
      }).done(function(){
      }).fail(function( jqXHR, textStatus ) {
        console.log( "Request failed: " + jqXHR);
      })
    }
    
  };

  window.document.onkeyup = function (event) {
    var requiredKeys = [37, 38, 39, 40];
    if (requiredKeys.indexOf(event.keyCode) !== -1) {
      event.preventDefault();
    }
    keyCode = null;
    $.ajax({
      method: "POST",
      url: "http://88.187.112.10:3000/session/inputs",
      data: { "input" :null },
    }).done(function(){
    }).fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + jqXHR);
    })
  };


  /**
  * Rendu des sprites
  *
  * this.context: Contexte du canvas dans lequel on dessine
  * this.frames: Nombre total de frames dans l'animation
  * this.currentFrame: Index de la frame affichée
  * this.ticksPerFrame: Délai entre le passage d'un frame vers la suivante
  * this.tickCounter: Compteur de ticks
  * this.image: Image source
  * this.sx: Abscisse du sprite
  * this.sy: Ordonnée du sprite
  * this.width: Largeur du sprite qui sera affiché dans le canvas
  * this.height: Hauteur du sprite qui sera affiché dans le canvas
  * this.dx: Abscisse du sprite dans le canvas
  * this.dy: Ordonnée du sprite dans le canvas
  * this.speed: Vitesse de chute des poissons
  *
  * this.renderBackground: Dessine le background
  * this.renderShark: Dessine le requin
  * this.updateShark: Rafraichit le rendu du requin dans le canvas
  * this.renderFishes: Dessine les poissons
  * this.updateFishes: Rafraichit le rendu des poissons dans le canvas
  */

  function Sprite (props) {
        this.context = props.context;
        this.frames = props.frames;
        this.currentFrame = 0;
        this.ticksPerFrame = props.ticksPerFrame;
        this.tickCounter = 0;
        this.image = props.image;
        this.sx = props.sx;
        this.sy = props.sy;
        this.width = props.width;
        this.height = props.height;
        this.dx = props.dx;
        this.dy = props.dy;
    /**
    * On met une condition afin d'éviter d'éxécuter la fonction random pour rien
    */
    if (props.fish) {
      this.speed = random(speedFishes.min, speedFishes.max);
    };

    this.renderBackground = function () {
         this.context.drawImage(
        this.image,
  			this.sx,
  			this.sy,
  			this.width,
  			this.height,
  			this.dx,
  			this.dy,
  			this.width,
  			this.height
      );
    };

    /*
    * Méthode permettant la récupération de la direction via le serveur
    * il est recommandé de séparer les actions et donc d'avoir 
    * 
    */
    this.serverInputs = async function (){  
        var serverResponse = await $.ajax({
          method: "get",
          url: "http://88.187.112.10:3000/session/inputs",
        }).done(function(result){
         
          this.serverResponse = result
        }).fail(function( jqXHR, textStatus ) {
         console.log( "Request failed: " + jqXHR);
        })
        console.log("response:",serverResponse.input)
        console.log("debut");
        if (serverResponse.input === LEFT && !collisions.left) {
          console.log("changes");
          this.sy = 150;
          this.dx -= moveSpeedX;
        }
  
        if (serverResponse.input === UP && !collisions.up) {
          console.log("changes");
          this.dy -= moveSpeedY;
        }
  
        if (serverResponse.input === RIGHT && !collisions.right ) {
          console.log("changes");
          this.sy = 0;
          this.dx += moveSpeedX;
        }
  
        if (serverResponse.input === DOWN && !collisions.down) {
          console.log("changes");
          this.dy += moveSpeedY;
        }
        console.log("fin");
    }

    /* cette méthode ne concernen maintenant que l'affichage du requin*/
    this.renderShark = function () {
      this.context.drawImage(
        this.image,
        (this.currentFrame * this.width),
        this.sy,
        this.width,
        this.height,
        this.dx,
        this.dy,
        this.width,
        this.height
      );
    };

    /**
    * On incrémente le compteur de ticks.
    * Si le compteur arrive à la limité fixée (ticksPerFrame),
    * on remet le compteur à 0 afin de recommencer le cycle.
    * On passe alors à la frame suivante. Dès que l'index de la frame actuelle
    * est égale à l'index de la dernière frame, on reprend la première frame
    * afin de recommencer le cycle.
    */
    this.updateShark = function () {
      this.tickCounter++;
      if (this.tickCounter == this.ticksPerFrame) {
        this.tickCounter = 0;
        if (this.currentFrame < this.frames - 1) {
          this.currentFrame++;
        } else {
          this.currentFrame = 0;
        };
      };
    };

    this.renderFishes = function () {
      this.context.drawImage(
        this.image,
  			this.sx,
  			this.sy,
  			this.width,
  			this.height,
  			this.dx,
  			this.dy,
  			this.width,
  			this.height
      );
    };

    /**
    * Si le poisson arrive en bas du canvas, on le retire du tableau `fishes`
    * et on met à jour le nombre de vies restantes. Si life == 0, le joueur à
    * perdu. On remet les vies à 3 et on reset les poissons
    */
    this.updateFishes = function () {
      this.dy += this.speed;
      if (this.dy > canvas.height - 50) {
        for (var i = 0; i < fishes.length; i++) {
          var fish = fishes[i]
          if (this == fish) {
            fishes.splice(i, 1);
            life -= 1;
            displayLife.innerHTML = life;
      
            if (life == 0) {
              // Gestion de la partie perdue 
              alert('PERDU !');
              life = 3;
              fishes = [];
              displayLife.innerHTML = life;
             
              keysDown = {
                left: false,
                up: false,
                right: false,
                down: false
              };
            };
          };
        };
      };
    };
  };


  /**
  * Sprites
  */

  var background = new Sprite({
    context: context,
    image: backgroundSprite,
    sx: 0,
    sy: 0,
    width: 1300,
    height: 764,
    dx: 0,
    dy: 0
  });

  var shark = new Sprite({
    context: context,
    image: sharkSprite,
    sy: 0,
    width: 237,
    height: 150,
    dx: 100,
    dy: 500,
    frames: 8,
    ticksPerFrame: 10
  })

  makeItRain = setInterval(function () {
    var fish = new Sprite({
      context: context,
      image: fishSprite,
      sx: 0,
      sy: 0,
      width: 67,
      height: 50,
      dx: random(0, (canvas.width - 67)),
      dy: 250,
      fish: true
    });
    if (fishes.length < maxFishes) {
      fishes.push(fish);
    };
  }, fishedPopSpeed);


  /**
  * Collisions
  */
  var checkCollisions = function () {
    collisions = {
      right: false,
      left: false
    };
    /* Collision bord gauche du canvas */
    if (shark.dx <= 10) {
      collisions.left = true;
      
    };

    /* Collision surface de l'eau */
    if (shark.dy <= 245) {
      collisions.up = true;
      
    };

    /* Collision bord droite du canvas */
    if (shark.dx >= canvas.width - 240) {
      collisions.right = true;
   
    };

    /* Collision bord droite du canvas */
    if (shark.dy >= canvas.height - 150) {
      collisions.down = true;
      
    };

    /* Collision avec les poissons */
    for (var i = 0; i < fishes.length; i++) {
      var fish = fishes[i];
      if (
        shark.dy <= fish.dy + 20 &&
        shark.dx <= fish.dx + 67 &&
        shark.dx + 237 >= fish.dx &&
        shark.dy + 120 >= fish.dy
      ) {
        fishes.splice(i, 1);
        score += 1;
        // Gestion de la fin de partie gagnée ici
             
        // compétences à afficher
        
        
      };
    };
  };

  /**
  * Exécution du jeu
  */
  /* Compatibilité avec les différents navigateurs web */
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  (function gameRender() {
    window.requestAnimationFrame(gameRender);
    background.renderBackground();
    /*on récupère les données avant d'afficher le requin*/
    shark.serverInputs();
    shark.renderShark();
    shark.updateShark();
    checkCollisions();
    for (var i = 0; i < fishes.length; i++) {
      var fish = fishes[i];
      fish.renderFishes();
      fish.updateFishes();
    };
  })();
}