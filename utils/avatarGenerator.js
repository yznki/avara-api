import {createCanvas} from "@napi-rs/canvas"

export function generateInitialsAvatar(name = "A", size = 128) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = randomColor(name)
  ctx.fillRect(0, 0, size, size)

  const initials = name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .slice(0, 2)
    .join("")

  ctx.font = `${size * 0.5}px sans-serif`
  ctx.fillStyle = "#fff"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(initials, size / 2, size / 2)

  return canvas.toBuffer("image/png")
}

function randomColor(seed) {
  const hash = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const hue = hash % 360
  return `hsl(${hue}, 70%, 50%)`
}
