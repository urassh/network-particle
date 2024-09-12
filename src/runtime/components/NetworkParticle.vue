<template>
  <canvas ref="networkCanvas" />
</template>

<script>
import config from '../particle.config.json'

export default {
  name: 'NetworkCanvas',
  mounted() {
    this.initCanvas()
    window.addEventListener('resize', this.resizeCanvas)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeCanvas)
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.networkCanvas
      const ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      let particlesArray

      const hexToRGBA = (hex, alpha) => {
        const r = Number.parseInt(hex.slice(1, 3), 16)
        const g = Number.parseInt(hex.slice(3, 5), 16)
        const b = Number.parseInt(hex.slice(5, 7), 16)
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
      }

      class Particle {
        constructor(x, y, directionX, directionY, size, color) {
          this.x = x
          this.y = y
          this.directionX = directionX
          this.directionY = directionY
          this.size = size
          this.color = color
        }

        draw() {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false)
          ctx.fillStyle = this.color
          ctx.fill()
        }

        update() {
          if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX
          if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY
          this.x += this.directionX
          this.y += this.directionY
          this.draw()
        }
      }

      const init = () => {
        particlesArray = []
        const numberOfParticles = (canvas.height * canvas.width) / config.particleDensity
        for (let i = 0; i < numberOfParticles / 2; i++) {
          const size = (Math.random() * config.sizeVariation) + config.minSize
          const x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2)
          const y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2)
          const directionX = (Math.random() * config.speedVariation) - (config.speedVariation / 2)
          const directionY = (Math.random() * config.speedVariation) - (config.speedVariation / 2)
          particlesArray.push(new Particle(x, y, directionX, directionY, size, config.particleColor))
        }
      }

      const connect = () => {
        let opacityValue = 1
        for (let a = 0; a < particlesArray.length; a++) {
          for (let b = a; b < particlesArray.length; b++) {
            const distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
              + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y))
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
              opacityValue = 1 - (distance / config.connectionDistanceFactor)
              ctx.strokeStyle = hexToRGBA(config.lineColor, opacityValue)
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
              ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
              ctx.stroke()
            }
          }
        }
      }

      const animate = () => {
        requestAnimationFrame(animate)
        ctx.clearRect(0, 0, innerWidth, innerHeight)
        for (let i = 0; i < particlesArray.length; i++) particlesArray[i].update()
        connect()
      }

      this.resizeCanvas = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        init()
      }

      init()
      animate()
    },
  },
}
</script>

<style>
  canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #0a0a0a;
  }
</style>
