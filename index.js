addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    canvas.width = 700;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    ctx.font = "30px Helvatica";

    class InputHandler {
        constructor(game) {
            this.game = game;
            addEventListener('keydown', (e) => {
                if (
                    ((e.key === 'ArrowUp') || (e.key === 'ArrowDown'))
                    && this.game.keys.indexOf(e.key) === -1
                ) {
                    this.game.keys.push(e.key);
                } else if (e.key === ' ') {
                    this.game.player.shootTop();
                } else if (e.key === 'd') {
                    this.game.debug = !this.game.debug;
                }
            });
            addEventListener('keyup', (e) => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1)
                }
            });
        }
    }

    class Projectile {
        constructor(game, x, y) {
            this.game = game;
            this.spriteImage = new Image();
            this.spriteImage.src = './img/projectile.png';
            this.position = {
                x: x,
                y: y
            };
            this.sprite = {
                width: 10,
                height: 3
            };
            this.speed = {
                maxSpeed: 3
            };
            this.markedForDeletion = false;
        }
        update() {
            this.position.x += this.speed.maxSpeed;
            if (this.position.x > this.game.width * 0.8) this.markedForDeletion = true;
        }
        draw(context) {
            context.drawImage(this.spriteImage, this.position.x, this.position.y);
        }
    }

    class Particle {

    }

    class Player {
        constructor(game) {
            this.game = game;
            this.spriteImage = new Image();
            this.spriteImage.src = './img/player.png';
            this.position = {
                x: 20,
                y: 20
            }
            this.speed = {
                x: 0,
                y: 0,
                maxSpeed: 5
            }
            this.sprite = {
                image: this.spriteImage,
                width: 120,
                height: 190,
                frame: {
                    x: 0,
                    y: 0,
                    maxFrames: 38
                }
            }
            this.powerUp = false;
            this.powerUpTimer = 0;
            this.projectiles = [];
        }
        update() {
            // Sprite aniamtion
            (this.sprite.frame.x < this.sprite.frame.maxFrames) ? this.sprite.frame.x++ : this.sprite.frame.x = 0;

            // Player Movement
            if (this.game.keys.includes('ArrowUp')) {
                this.speed.y = -this.speed.maxSpeed;
                if (this.position.y - 20 <= 0) this.speed.y = 0;
            } else if (this.game.keys.includes('ArrowDown')) {
                this.speed.y = this.speed.maxSpeed;
                if (this.position.y + this.sprite.height >= this.game.height) this.speed.y = 0;
            } else {
                this.speed.y = 0;
            }
            this.position.y += this.speed.y;

            // Handle projectiles
            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        }
        draw(context) {
            if (this.game.debug) {
                context.fillStyle = "black";
                context.strokeRect(this.position.x, this.position.y, this.sprite.width, this.sprite.height);
            }

            context.drawImage(
                this.sprite.image,
                this.sprite.frame.x * this.sprite.width,
                this.sprite.frame.y * this.sprite.height,
                this.sprite.width,
                this.sprite.height,
                this.position.x,
                this.position.y,
                this.sprite.width,
                this.sprite.height
            )

            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
        }
        shootTop() {
            if (this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.position.x + this.sprite.width - 23, this.position.y + 30));
                this.game.ammo--;
            }
        }
    }

    class Enemey {
        constructor(game) {
            this.game = game;
            this.spriteImage = new Image();
            this.position = {
                x: this.game.width,
            };
            this.speed = {
                x: Math.random() * -1.5 - 0.5
            }
            this.sprite = {
                image: this.spriteImage,
                frame: {
                    x: 0,
                    y: 0,
                    maxFrames: 38
                }
            };
            this.markedForDeletion = false;
        }
        update() {
            // Sprite aniamtion
            (this.sprite.frame.x < this.sprite.frame.maxFrames) ? this.sprite.frame.x++ : this.sprite.frame.x = 0;
            // Enemy Movment
            this.position.x += this.speed.x - this.game.speed;
            if (this.position.x < 0 - this.sprite.width) this.markedForDeletion = true;
        }

        draw(context) {
            context.drawImage(
                this.sprite.image,
                this.sprite.frame.x * this.sprite.width,
                this.sprite.frame.y * this.sprite.height,
                this.sprite.width,
                this.sprite.height,
                this.position.x,
                this.position.y,
                this.sprite.width,
                this.sprite.height
            )
            if (this.game.debug) {
                context.fillStyle = "red";
                context.strokeRect(this.position.x, this.position.y, this.sprite.width, this.sprite.height);
                context.fillStyle = "black";
                context.fillText(this.lives, this.position.x, this.position.y - 5);
            }

        }
    }

    class Angler1 extends Enemey {
        constructor(game) {
            super(game)
            this.spriteImage.src = './img/angler1.png';
            this.bottomMagin = this.game.player.sprite.height * 0.25;
            this.sprite.width = 228;
            this.sprite.height = 169;
            this.position.y = Math.floor(Math.random() * (this.game.height - this.sprite.height - this.bottomMagin));
            this.sprite.frame.y = Math.floor(Math.random() * 3);
            this.lives = 2;
            this.score = this.lives;
        }
    }

    class Angler2 extends Enemey {
        constructor(game) {
            super(game)
            this.spriteImage.src = './img/angler2.png';
            this.bottomMagin = this.game.player.sprite.height * 0.25;
            this.sprite.width = 213;
            this.sprite.height = 165;
            this.position.y = Math.floor(Math.random() * (this.game.height - this.sprite.height - this.bottomMagin));
            this.sprite.frame.y = Math.floor(Math.random() * 2);
            this.lives = 3;
            this.score = this.lives;
        }
    }

    class Lucky extends Enemey {
        constructor(game) {
            super(game)
            this.spriteImage.src = './img/lucky.png';
            this.bottomMagin = this.game.player.sprite.height * 0.25;
            this.sprite.width = 99;
            this.sprite.height = 95;
            this.position.y = Math.floor(Math.random() * (this.game.height - this.sprite.height - this.bottomMagin));
            this.sprite.frame.y = Math.floor(Math.random() * 2);
            this.lives = 3;
            this.score = 15;
            this.type = 'lucky';
        }
    }

    class Layer {
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }
        update() {
            if (this.x <= -this.width) this.x = 0
            this.x -= this.game.speed + this.speedModifier;
        }
        draw(context) {
            context.drawImage(
                this.image,
                this.x,
                this.y
            );
            context.drawImage(
                this.image,
                this.x + this.width,
                this.y
            );
        }
    }

    class Background {
        constructor(game) {
            this.game = game;
            // Create Layers
            this.image1 = new Image();
            this.image1.src = './img/layer1.png';
            this.layer1 = new Layer(this.game, this.image1, 0.02);

            this.image2 = new Image();
            this.image2.src = './img/layer2.png';
            this.layer2 = new Layer(this.game, this.image2, 0.04);

            this.image3 = new Image();
            this.image3.src = './img/layer3.png';
            this.layer3 = new Layer(this.game, this.image3, 0.1);

            this.image4 = new Image();
            this.image4.src = './img/layer4.png';
            this.layer4 = new Layer(this.game, this.image4, 0.14);

            this.layers = [this.layer1, this.layer2, this.layer3];
        }
        update() {
            this.layers.forEach(layer => layer.update());
        }
        draw(context) {
            this.layers.forEach(layer => layer.draw(context));
        }
    }

    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = "Helvatica";
            this.color = "white";
        }
        draw(context) {
            context.save();
            context.fillStyle = this.color;
            context.font = `${this.fontSize}px ${this.fontFamily}`;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            // Timer
            let formateTime = ((this.game.timeLimit - this.game.gameTime) * 0.001).toFixed(0);
            if(formateTime <= -0) formateTime = 0;
            context.fillText(formateTime, this.game.width * 0.5, 25);
            // Score
            context.fillText(`Score: ${this.game.score}`, 20, 25);
            context.fillStyle = this.color;
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(10 + 5 * i, this.game.height - 25, 3, 20);
            }
            // Game Over
            if (this.game.gameOrver) {
                context.textAlign = 'center';
                let message1;
                let message2;
                if (this.game.score >= this.game.winningScore) {
                    message1 = "You Win!";
                    message2 = "Great Job!";
                } else {
                    message1 = "You Lost!";
                    message2 = "Try again next time!";
                }
                context.font = '50px ' + this.fontFamily;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5);
                context.font = '25px ' + this.fontFamily;
                context.fillText(message2, this.game.width * 0.5, (this.game.height * 0.5) + 30);

            }
            context.restore();
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.bg = new Background(this);
            this.score = 0;
            this.winningScore = 100;
            this.keys = [];
            this.enemeis = [];
            this.enemeyTimer = 0;
            this.enemeyInterval = 3000;
            this.ammo = 20;
            this.maxAmmo = 50;
            this.ammoTimer = 0;
            this.ammoInterval = 500;
            this.gameOrver = false;
            this.gameTime = 0;
            this.timeLimit = 60000;
            this.speed = 1;
            this.debug = false;
        }
        update(deltaTime) {
            this.bg.update();
            this.player.update();
            this.bg.layer4.update();
            if (!this.gameOrver) this.gameTime += deltaTime;
            if (this.gameTime >= this.timeLimit) this.gameOrver = true;
            if (this.ammoTimer > this.ammoInterval) {
                if (this.ammo < this.maxAmmo) this.ammo++;
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }

            this.enemeis.forEach(enemey => {
                enemey.update();
                if (this.checkCollision(this.player, enemey)) {
                    enemey.markedForDeletion = true;
                }

                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemey)) {
                        projectile.markedForDeletion = true;
                        enemey.lives--;
                        if (enemey.lives <= 0) {
                            enemey.markedForDeletion = true;
                            if (!this.gameOrver) this.score += enemey.score;

                            if (this.score >= this.winningScore) this.gameOrver = true;
                            console.log(this.gameOrver);
                        }
                    }
                });
            });
            this.enemeis = this.enemeis.filter(enemey => !enemey.markedForDeletion);
            if (this.enemeyTimer > this.enemeyInterval && !this.gameOrver) {
                this.addEnemy();
                this.enemeyTimer = 0;
            } else {
                this.enemeyTimer += deltaTime;
            }
        }
        draw(context) {
            this.bg.draw(context);
            this.player.draw(context);
            this.bg.layer4.draw(context);
            this.enemeis.forEach(enemey => {
                enemey.draw(context);
            });
            this.ui.draw(context);
        }
        addEnemy() {
            const randomized = Math.random();
            if(randomized < 0.3) this.enemeis.push(new Angler1(this));
            if(randomized < 0.6) this.enemeis.push(new Angler2(this));
            else this.enemeis.push(new Lucky(this));
        }
        checkCollision(rec1, rec2) {
            return (
                rec1.position.x < rec2.position.x + rec2.sprite.width &&
                rec1.position.x + rec1.sprite.width > rec2.position.x &&
                rec1.position.y < rec2.position.y + rec2.sprite.height &&
                rec1.position.y + rec1.sprite.height > rec2.position.y
            );
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});