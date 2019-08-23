export const impetus = ({
  update = () => {},
  sourceElement,
  multiplier = 1,
  friction = 0.92,
  initialValues = [1, 2],
  boundX = [],
  boundY = [],
  bounce = true
}) => {
  let targetElement = sourceElement
  let boundXMin = boundX.length ? boundX[0] : 0
  let boundXMax = boundX.length ? boundX[1] : 0
  let boundYMin = boundY.length ? boundY[0] : 0
  let boundYMax = boundY.length ? boundY[1] : 0

  const pause = () => {}
  const resume = () => {}
  const setMultiplier = number => {

  }
  const setValues = (numberX, numberY) => {

  }
  const setBoundX = ([minX, maxX]) => {

  }
  const setBoundY = ([minY, maxY]) => {

  }
  const destroy = () => {

  }

  return {
    pause,
    resume,
    setMultiplier,
    setValues,
    setBoundX,
    setBoundY,
    destroy
  }
}
