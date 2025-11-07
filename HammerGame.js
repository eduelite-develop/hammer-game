
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
    const hitSound = useRef(null);
  
    const targetImages = [
      "https://eduelite-develop.github.io/resouce/f95f24c8-7b74-4364-ae9c-4d9ad3293b2f/rabbit_svgrepo_com.svg",
      "https://eduelite-develop.github.io/resouce/f95f24c8-7b74-4364-ae9c-4d9ad3293b2f/elephant_8_svgrepo_com.svg",
      "https://eduelite-develop.github.io/resouce/f95f24c8-7b74-4364-ae9c-4d9ad3293b2f/dog_svgrepo_com.svg",
      "https://eduelite-develop.github.io/resouce/f95f24c8-7b74-4364-ae9c-4d9ad3293b2f/cat_5_svgrepo_com.svg"
    ];
  
    const getRandomImage = () =>
      targetImages[Math.floor(Math.random() * targetImages.length)];
  
    const moveCircle = () => {
      const top = Math.random() * 80 + 10;
      const left = Math.random() * 80 + 10;
      setCirclePos({ top, left });
      setTargetImage(getRandomImage());
    };

    useEffect(() => {
        hitSound.current = new Audio(
          "https://eduelite-develop.github.io/resouce/f95f24c8-7b74-4364-ae9c-4d9ad3293b2f/metal_slam_5_189786.mp3"
        );
        hitSound.current.volume = 0.7; // optional volume control
    }, []);
  
    useEffect(() => {
        if (!gameActive || isPaused) return;
      
        let lastTick = performance.now();
        let accumulated = 0;
        let rafId;
        const timeRef = { current: timeLeft }; // local cache
      
        // keep the ref in sync with React state
        // (important so the loop always sees latest value)
        const updateRef = () => (timeRef.current = timeLeft);
        updateRef();
      
        const tick = (now) => {
          const delta = now - lastTick;
          lastTick = now;
          accumulated += delta;
      
          while (accumulated >= 1000) {
            accumulated -= 1000;
            setTimeLeft((t) => {
              const newTime = Math.max(0, t - 1);
              timeRef.current = newTime;
              return newTime;
            });
          }
      
          if (gameActive && !isPaused && timeRef.current > 0) {
            rafId = requestAnimationFrame(tick);
          } else if (timeRef.current <= 0) {
            console.log("game over");
            setGameActive(false);
            gameOverEvent({ score });
          }
        };
      
        rafId = requestAnimationFrame(tick);
      
        return () => cancelAnimationFrame(rafId);
      }, [gameActive, isPaused, score, timeLeft]);
  
    // Move target
    useEffect(() => {
        if (!gameActive) return;
      
        let lastMove = performance.now();
        let rafId;
      
        const loop = (now) => {
          // Only move the circle every 1500ms
          if (!isPaused && now - lastMove >= 1500) {
            moveCircle();
            lastMove = now;
          }
      
          // Keep looping as long as game is active
          rafId = requestAnimationFrame(loop);
        };
      
        rafId = requestAnimationFrame(loop);
      
        return () => cancelAnimationFrame(rafId);
      }, [gameActive, isPaused]);
      
  
    const startGame = () => {
  
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
  
        // ✅ Play hit sound safely
      if (hitSound.current) {
        hitSound.current.currentTime = 0;
        hitSound.current.play().catch(() => {});
      }
  
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
      
        let rafId;
        let lastTime = performance.now();
      
        const animate = (now) => {
          const delta = now - lastTime;
          lastTime = now;
      
          // Update particle positions
          setParticles((prev) =>
            prev
              .map((p) => ({
                ...p,
                x: p.x + p.dx,
                y: p.y + p.dy,
                dy: p.dy + 0.3, // gravity
              }))
              .filter((p) => p.y < 600) // remove off-screen particles
          );
      
          rafId = requestAnimationFrame(animate);
        };
      
        rafId = requestAnimationFrame(animate);
      
        return () => cancelAnimationFrame(rafId);
      }, [particles.length]);
      
      
    const refillHammers = () => {
      
      //LearningEventTrigger, get the result{points:} to be transfered to hammers
      triggerLearningEvent({

        onCompleteCallback: (result)=>{

            if(result){
                setHammersLeft(result.points);
            }            
            
            setIsPaused(false); // Resume t
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
  