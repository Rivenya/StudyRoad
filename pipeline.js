function Pipeline(props) {
  const { canvasId, color, move } = props;
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const width = 60;
  const n = Math.floor(canvas.width / (width + 30)) + 1;
  const lineargradient = ctx.createLinearGradient(0, 0, 0, 40);
  lineargradient.addColorStop(0, 'gray');
  lineargradient.addColorStop(0.5, 'white');
  lineargradient.addColorStop(1, 'gray');
  const water = {
    n: 0,
    x: canvas.width - width,
    orginX: canvas.width - width,
    y: 0,
    width: width,
    moveX: move,
    color: color,
    draw: async () => {
      const self = water;
      self.n = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = lineargradient;
      ctx.fillRect(0, self.y, canvas.width, 40);
      const flag = await self.drawWater();
      if (flag) {
        if (self.x > canvas.width + 60 - self.moveX) {
          self.x = self.orginX;
        }
        self.x += self.moveX;
        window.requestAnimationFrame(self.draw);
      }
    },
    drawWater: () => {
      const self = water;
      ctx.beginPath();
      ctx.fillStyle = self.color;
      ctx.moveTo(self.x - (self.n * self.width + self.n * 60), self.y + 10);
      ctx.lineTo(self.x - (self.n * self.width + self.n * 60) + self.width, self.y + 10);
      ctx.arc(self.x - (self.n * self.width + self.n * 60) + self.width, self.y + 10 + 10, 10, Math.PI / 180 * 270, Math.PI / 180 * 90, false);
      ctx.lineTo(self.x - (self.n * self.width + self.n * 60), self.y + 10 + 20);
      ctx.arc(self.x - (self.n * self.width + self.n * 60), self.y + 10 + 10, 10, Math.PI / 180 * 90, Math.PI / 180 * 270, false);
      ctx.fill();
      ctx.closePath();
      self.n += 1;
      if (self.n < n) {
        return self.drawWater();
      } else {
        return true;
      }
    }
  }
  water.draw();
}
export default Pipeline;
