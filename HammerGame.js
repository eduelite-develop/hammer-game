
import React, { useState, useEffect, useRef } from "react";

const HammerGame = ({data, gameState, gameOverEvent, triggerLearningEvent}) => {

    const [score, setScore] = useState(gameState && gameState.score? gameState.score: 0);
    const [hammersLeft, setHammersLeft] = useState(gameState && gameState.hammers? gameState.hammers: 3);
    const [circlePos, setCirclePos] = useState({ top: 100, left: 100 });
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameActive, setGameActive] = useState(false);
    const [hammerPos, setHammerPos] = useState({ x: 0, y: 0 });
    const [isSwinging, setIsSwinging] = useState(false);
    const [particles, setParticles] = useState([]);
    const [targetImage, setTargetImage] = useState("");   
    const [isPaused, setIsPaused] = useState(false);
  
    const timerRef = useRef(null);
  
    const targetImages = [
      "https://eduelite-develop.github.io/resouce/f95f24c8-7b74-4364-ae9c-4d9ad3293b2f/rabbit_svgrepo_com.svg",
      "https://eduelite-develop.github.io/resouce/f95f24c8-7b74-4364-ae9c-4d9ad3293b2f/elephant_8_svgrepo_com.svg",
      "https://eduelite-develop.github.io/resouce/f95f24c8-7b74-4364-ae9c-4d9ad3293b2f/dog_svgrepo_com.svg",
      "https://eduelite-develop.github.io/resouce/f95f24c8-7b74-4364-ae9c-4d9ad3293b2f/cat_5_svgrepo_com.svg"
    ];
  
    const hitSound = new Audio(
      "https://eduelite-develop.github.io/resouce/f95f24c8-7b74-4364-ae9c-4d9ad3293b2f/metal_slam_5_189786.mp3"
    );
  
    const getRandomImage = () =>
      targetImages[Math.floor(Math.random() * targetImages.length)];
  
    const moveCircle = () => {
      const top = Math.random() * 80 + 10;
      const left = Math.random() * 80 + 10;
      setCirclePos({ top, left });
      setTargetImage(getRandomImage());
    };
  
    // Timer effect
    useEffect(() => {
      if (!gameActive || timeLeft <= 0 || isPaused) return;
  
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
  
        if(t <= 1){
        
        //trigger GameOverEvent, then
        setGameActive (false);
        gameOverEvent({
            score: score,
            onCompleteCallback: (result)=>{
                console.log("game over");
            }
        })
        return 0;
        }
        return t - 1;
        
        });
            }, 1000);
  
      return () => clearInterval(timerRef.current);
    }, [gameActive, timeLeft, isPaused]);
  
    // Move target
    useEffect(() => {
      if (!gameActive) return;
      const interval = setInterval(() => {
        if (!isPaused) moveCircle();
      }, 1500);
      return () => clearInterval(interval);
    }, [gameActive, isPaused]);
  
    const startGame = () => {
  
  //GameLoadEvent trigger, the callback to set

        console.log(gameOverEvent);
        console.log(triggerLearningEvent);
   
      setScore(0);
      setTimeLeft(30);
      setGameActive(true);
      setParticles([]);
      setTargetImage(getRandomImage());
      setHammersLeft(5);
      setIsPaused(false);
    };
  
    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setHammerPos({ x, y });
    };
  
    const handleClick = (e) => {
      if (!gameActive) return;
      if (hammersLeft <= 0) return;
  
      setIsSwinging(true);
      setTimeout(() => setIsSwinging(false), 150);
  
      setHammersLeft((h) => h - 1);
  
      if (hammersLeft - 1 <= 0) {
        // Pause timer when hammer reaches 0
        setIsPaused(true);
      }
  
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
  
      const cx = (circlePos.left / 100) * rect.width;
      const cy = (circlePos.top / 100) * rect.height;
      const dist = Math.sqrt((clickX - cx) ** 2 + (clickY - cy) ** 2);
  
      if (dist < 40) {
        setScore((s) => s + 1);
        moveCircle();
  
        hitSound.currentTime = 0;
        hitSound.play().catch(() => {});
  
        const newParticles = Array.from({ length: 10 }).map((_, i) => ({
          id: Date.now() + i,
          x: cx,
          y: cy,
          dx: Math.random() * 4 - 2,
          dy: Math.random() * -4 - 1,
          color: ["#ff4b4b", "#ffb84b", "#fff34b", "#4bff66"][
            Math.floor(Math.random() * 4)
          ],
        }));
        setParticles((prev) => [...prev, ...newParticles]);
      }
    };
  
    useEffect(() => {
      if (particles.length === 0) return;
      const interval = setInterval(() => {
        setParticles((prev) =>
          prev
            .map((p) => ({ ...p, x: p.x + p.dx, y: p.y + p.dy, dy: p.dy + 0.3 }))
            .filter((p) => p.y < 600)
        );
      }, 30);
      return () => clearInterval(interval);
    }, [particles]);
  
    const refillHammers = () => {
   
      setIsPaused(false); // Resume timer
  
      //LearningEventTrigger, get the result{points:} to be transfered to hammers
      triggerLearningEvent({

        onCompleteCallback: (result)=>{
            if(result){
                setHammersLeft(result.points);
            }            
        }

      })  
   
    };
  
    return (
      <div
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{
          position: "relative",
          width: "800px",
          height: "600px",
          background: "#222",
          color: "#fff",
          overflow: "hidden",
          borderRadius: "10px",
          textAlign: "center",
          cursor: gameActive && timeLeft > 1
           && hammersLeft>0 ?"none": "pointer"
        }}
      >
        <h1>🎯 Hammer Click Game</h1>
        <p>
          Time Left: {timeLeft}s | Score: {score} | Hammers Left: {hammersLeft}
        </p>
  
        {!gameActive && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              startGame();
            }}
            style={{
              padding: "10px 20px",
              fontSize: "18px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Start Game
          </button>
        )}
  
        {/* Show message & refill button if no hammers */}
        {gameActive && hammersLeft === 0 && (
          <div style={{ marginTop: "20px", fontSize: "18px" }}>
            ⚠️ You have no hammers left! Please click the button to get hammers.
            <br />
            <button
              onClick={(e) => {
                e.stopPropagation();
                refillHammers();
              }}
              style={{
                padding: "8px 16px",
                marginTop: "10px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Get Hammer
            </button>
          </div>
        )}
  
        {/* Target */}
        {gameActive && timeLeft > 0 && targetImage && (
          <div
            style={{
              position: "absolute",
              top: `${circlePos.top}%`,
              left: `${circlePos.left}%`,
              transform: "translate(-50%, -50%)",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              overflow: "hidden",
              transition: "top 0.2s, left 0.2s",
              boxShadow: "0 0 10px #000",
              background: "#fff",
            }}
          >
            <img
              src={targetImage}
              alt="target"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "invert(39%) sepia(94%) saturate(2047%) hue-rotate(194deg) brightness(95%) contrast(101%)",
                  
              }}
            />
          </div>
        )}
  
        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: "6px",
              height: "6px",
              background: p.color,
              borderRadius: "50%",
            }}
          ></div>
        ))}
  
        {/* Hammer (only visible when game is active) */}
        { gameActive && hammersLeft > 0 && ( 
        <img
        src="https://eduelite-develop.github.io/resouce/f95f24c8-7b74-4364-ae9c-4d9ad3293b2f/hammer_svgrepo_com.svg"
            alt="hammer"
            style={{
            position: "absolute",
            left: hammerPos.x - 25,
            top: hammerPos.y - 25,
            width: "70px",
            height: "70px",
            transform: isSwinging
                ? "rotate(-60deg) scale(1.1)"
                : "rotate(-30deg) scale(1)",
            transformOrigin: "top right",
            transition: "transform 0.1s ease",
            pointerEvents: "none",
            filter: "invert(18%) sepia(95%) saturate(7485%) hue-rotate(357deg) brightness(90%) contrast(116%)",
            }}
        />
        )}
  
        {timeLeft <= 0 && (
          <div style={{ marginTop: "20px", fontSize: "20px" }}>
            ⏰ Time’s up and Game Over! Final Score: {score}
          </div>
        )}
      </div>
    );
  }
  
  export default HammerGame;
  