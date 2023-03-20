const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");

      // Wymiary postaci
      const characterWidth = 100;
      const characterHeight = 100;

      // Współrzędne postaci
      let x = 0;
      let y = canvas.height - characterHeight;

      // Prędkość postaci
      let speed = 5;

      function drawCharacter() {
        ctx.fillStyle = "blue";
        ctx.fillRect(x, y, characterWidth, characterHeight);
      }

      function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      function jump() {
        // Zmniejszenie wysokości postaci podczas skoku
        y -= 50;
      }

      function update() {
        clearCanvas();

        // Rysowanie postaci
        drawCharacter();

        // Aktualizacja pozycji postaci
        y += speed;

        // Sprawdzenie czy postać dotarła do końca canvasa
        if (y >= canvas.height - characterHeight) {
          // Zatrzymanie postaci na dole canvasa
          y = canvas.height - characterHeight;
        }

        // Wywołanie funkcji aktualizującej
        window.requestAnimationFrame(update);
      }

      // Obsługa skoku za pomocą przycisku spacji
      document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
          jump();
        }
      });

      // Wywołanie funkcji aktualizującej
      update();