/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
const CricleItem = ({
  item,
  x,
  y,
  text,
  color = 'white',
  onClickRemove,
  countdown = null,
  isDisappearing = null
}) => {
  return (
    <svg
      style={{
        cursor: 'pointer',
        opacity: isDisappearing ? 0 : 1,
        transition: 'opacity 3s ease-in-out'
      }}
      onClick={() => {
        onClickRemove && onClickRemove(item)
      }}
    >
      <circle r="25" cx={x} cy={y} fill={color} stroke="#FD802F" />
      <text
        x={x - 5}
        y={countdown === null ? y + 5 : y - 5}
        textAnchor="middle"
        fontSize="12px"
        dominantBaseline="middle"
        dy="-4px"
        dx="4px"
      >
        {text}
      </text>
      {countdown !== null ? (
        <text
          x={x}
          y={y + 8}
          stroke="white"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12px"
          color="white"
          style={{ border: '1px solid black' }}
        >
          {countdown}s
        </text>
      ) : (
        ''
      )}
    </svg>
  )
}

export default CricleItem
