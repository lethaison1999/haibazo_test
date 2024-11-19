export const getRandomCoordinate = () => {
  const width = 480
  const height = 430
  const x = Math.random() * width
  const y = Math.random() * height
  return {
    x: x + 30,
    y: y + 30
  }
}
