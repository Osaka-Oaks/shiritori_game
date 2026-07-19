import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

interface Game2DProps {
  onWordCollected?: (word: string) => void;
  onGameOver?: (score: number) => void;
}

class ShiritoriGameScene extends Phaser.Scene {
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private words?: Phaser.Physics.Arcade.Group;
  private score = 0;
  private scoreText?: Phaser.GameObjects.Text;
  private onWordCollected?: (word: string) => void;
  private wordList = [
    "いぬ",
    "ねこ",
    "さかな",
    "やま",
    "うみ",
    "そら",
    "ピカチュウ",
    "カメ",
    "レオナルド",
    "ラーメン",
  ];

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  init(data: { onWordCollected?: (word: string) => void }) {
    this.onWordCollected = data.onWordCollected;
  }

  preload() {
    // Load assets (using colored rectangles as placeholders)
    this.load.setBaseURL("https://labs.phaser.io");

    // Load a simple sprite sheet or use shapes
    this.load.image("sky", "assets/skies/space3.png");
    this.load.image("star", "assets/particles/star.png");
  }

  create() {
    // Add background
    this.add.image(400, 300, "sky");

    // Create player character (Pikachu-like)
    this.player = this.physics.add.sprite(100, 450, "star").setScale(2).setTint(0xffff00);

    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    // Create word group
    this.words = this.physics.add.group({
      key: "star",
      repeat: 3,
      setXY: { x: 100, y: 0, stepX: 200 },
    });

    this.words.children.iterate(child => {
      const wordSprite = child as Phaser.Physics.Arcade.Sprite;
      wordSprite.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      wordSprite.setTint(Phaser.Math.Between(0xff0000, 0x00ffff));
      wordSprite.setScale(1.5);

      // Add word text on top
      const randomWord = Phaser.Utils.Array.GetRandom(this.wordList);
      const text = this.add.text(wordSprite.x, wordSprite.y, randomWord, {
        fontSize: "16px",
        color: "#fff",
        backgroundColor: "#000",
        padding: { x: 5, y: 5 },
      });
      text.setOrigin(0.5);

      // Store word data
      wordSprite.setData("word", randomWord);
      wordSprite.setData("text", text);

      return true;
    });

    // Add collision detection
    if (this.player && this.words) {
      this.physics.add.collider(
        this.player,
        this.words,
        this.collectWord as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this
      );
    }

    // Input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Score text
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      color: "#fff",
      backgroundColor: "#000",
      padding: { x: 10, y: 5 },
    });

    // Instructions
    this.add
      .text(400, 550, "Use Arrow Keys to collect Japanese words!", {
        fontSize: "18px",
        color: "#fff",
        backgroundColor: "#000",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5);

    // Spawn new words periodically
    this.time.addEvent({
      delay: 3000,
      callback: this.spawnWord,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (!this.player || !this.cursors) return;

    // Player movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body?.touching.down) {
      this.player.setVelocityY(-400);
    }

    // Update word text positions
    this.words?.children.iterate(child => {
      const wordSprite = child as Phaser.Physics.Arcade.Sprite;
      const text = wordSprite.getData("text") as Phaser.GameObjects.Text;
      if (text) {
        text.setPosition(wordSprite.x, wordSprite.y - 30);
      }
      return true;
    });
  }

  collectWord(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    word: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const wordSprite = word as Phaser.Physics.Arcade.Sprite;
    const wordText = wordSprite.getData("word") as string;
    const textObj = wordSprite.getData("text") as Phaser.GameObjects.Text;

    // Remove word
    textObj?.destroy();
    wordSprite.disableBody(true, true);

    // Update score
    this.score += 10;
    this.scoreText?.setText("Score: " + this.score);

    // Callback
    if (this.onWordCollected) {
      this.onWordCollected(wordText);
    }

    // Create particle effect
    const particles = this.add.particles(wordSprite.x, wordSprite.y, "star", {
      speed: 100,
      scale: { start: 0.5, end: 0 },
      lifespan: 600,
      quantity: 10,
      tint: 0xffd700,
    });

    this.time.delayedCall(600, () => {
      particles.destroy();
    });
  }

  spawnWord() {
    if (!this.words) return;

    const x = Phaser.Math.Between(50, 750);
    const word = this.words.create(x, 0, "star") as Phaser.Physics.Arcade.Sprite;

    word.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    word.setTint(Phaser.Math.Between(0xff0000, 0x00ffff));
    word.setScale(1.5);
    word.setVelocityY(100);

    const randomWord = Phaser.Utils.Array.GetRandom(this.wordList);
    const text = this.add.text(x, 0, randomWord, {
      fontSize: "16px",
      color: "#fff",
      backgroundColor: "#000",
      padding: { x: 5, y: 5 },
    });
    text.setOrigin(0.5);

    word.setData("word", randomWord);
    word.setData("text", text);
  }
}

export default function Game2D({ onWordCollected, onGameOver }: Game2DProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current || gameInstanceRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 300 },
          debug: false,
        },
      },
      scene: ShiritoriGameScene,
      backgroundColor: "#1a1a2e",
    };

    const game = new Phaser.Game(config);
    gameInstanceRef.current = game;

    // Pass callback to scene
    game.scene.start("default", { onWordCollected });

    return () => {
      game.destroy(true);
      gameInstanceRef.current = null;
    };
  }, [onWordCollected]);

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-on-surface">🎮 Shiritori 2D Game</h2>
        <p className="text-on-surface-variant">
          Collect Japanese words as they fall! Use arrow keys to move.
        </p>
      </div>

      <div
        ref={gameRef}
        className="border-4 border-primary rounded-lg shadow-2xl overflow-hidden"
        style={{ width: "800px", height: "600px" }}
      />

      <div className="flex gap-4 text-sm text-on-surface-variant">
        <div>⬅️ ➡️ Move</div>
        <div>⬆️ Jump</div>
        <div>🎯 Collect words to score points!</div>
      </div>
    </div>
  );
}
