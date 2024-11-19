import { useEffect, useRef, useState } from 'react'
import CricleItem from './components/CricleItem'
import { getRandomCoordinate } from './common/handleCommon'
const App = () => {
  const [arrayItem, setArrayItem] = useState([])
  const [numberItem, setNumberItem] = useState(0)
  const [prevNumber, setPrevNumber] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [time, setTime] = useState(0)
  const [restart, setRestart] = useState(false)
  const [hasGameStarted, setHasGameStarted] = useState(false)
  const [isAutoPlayOn, setIsAutoPlayOn] = useState(false)

  const timerRef = useRef(null) //interval
  const intervalRef = useRef(null) //interval

  const handleOnChange = (e) => {
    const value = Number(e.target.value)
    setNumberItem(value)
  }

  const handleClickPlay = () => {
    if (numberItem === 0) return
    // đồng hồ đếm thời gian trò chơi bắt đầu theo miligiay
    timerRef.current = setInterval(() => {
      setTime((prevTime) => parseFloat((prevTime + 0.1).toFixed(1)))
    }, 100)

    // khởi tạo 1 mảng chứa các hình tròn
    const newArrayItem = Array.from({ length: numberItem }, (item, index) => {
      const { x, y } = getRandomCoordinate()
      return {
        id: (index + 1).toString(),
        x,
        y,
        text: (index + 1).toString(),
        color: 'white',
        countdown: null,
        isDisappearing: null
        // highlight: null
      }
    })

    setArrayItem(newArrayItem)
    setTime(0)
    setRestart(true)
    setGameOver(false)
    setPrevNumber(0)
    setGameWon(false)
    setHasGameStarted(true)
  }

  const handleRemove = (itemPrev) => {
    if (gameOver || isAutoPlayOn) return

    const isCorrectOrder = Number(itemPrev.text) === Number(prevNumber) + 1

    const updateArrayItem = arrayItem.map((item) => {
      if (item.id === itemPrev.id) {
        return {
          ...item,
          color: '#FD802F',
          countdown: isCorrectOrder ? 3 : 3,
          isDisappearing: isCorrectOrder,
          highlight: true
        }
      }
      return item
    })
    setArrayItem(updateArrayItem)

    //itemPrev : số đang đc chọn
    // prevNumber : số trước đó

    if (Number(itemPrev.text) === Number(prevNumber) + 1) {
      if (Number(itemPrev.text) === Number(numberItem)) {
        setGameWon(true)
        clearInterval(timerRef.current)
      }
      //hàm chay count down
      const intervalId = setInterval(() => {
        setArrayItem((prevItems) => {
          const updatedItems = prevItems.map((item) => {
            if (item.id === itemPrev.id && item.countdown !== null) {
              return { ...item, countdown: Number(item.countdown - 0.1).toFixed(1) } // Giảm thời gian đếm ngược
            }
            return item
          })

          const targetButton = updatedItems.find((item) => item.id === itemPrev.id)

          // Kiểm tra nếu countdown đã xuống 0 thì xóa item khỏi list
          if (targetButton && Number(targetButton.countdown) === 0) {
            clearInterval(intervalId) // Dừng interval khi countdown là 0
            return updatedItems.filter((item) => item.id !== itemPrev.id) // Xoá phần tử khỏi danh sách
          }
          setPrevNumber(Number(itemPrev.text))
          setArrayItem(updatedItems)
          return updatedItems
        })
      }, 100)
    } else {
      setGameOver(true)
      clearInterval(timerRef.current)
    }
  }
  //handle play ON
  const handleAutoPlayOn = () => {
    if (arrayItem.length === 0 || gameOver) return
    setIsAutoPlayOn(true)
    // Hàm để xóa phần tử với countdown và các trạng thái cần thiết
    const deleteItemSequentially = (index) => {
      setArrayItem((prev) => {
        const updatedItems = prev.map((item, idx) => {
          if (idx === index) {
            return {
              ...item,
              color: '#FD802F',
              countdown: 3,
              isDisappearing: true
            }
          }
          return item
        })
        const targetButton = updatedItems[index]
        // Kiểm tra nếu countdown đã xuống 0 thì xóa item khỏi danh sách
        if (targetButton && targetButton.countdown === 0) {
          updatedItems.filter((item) => item.id !== index)
        }
        setPrevNumber(Number(targetButton?.text))
        setArrayItem(updatedItems) // Cập nhật lại trạng thái
        return updatedItems
      })
    }

    let index = 0
    intervalRef.current = setInterval(() => {
      if (index < arrayItem.length) {
        deleteItemSequentially(index) // Gọi hàm xóa phần tử hiện tại
        index++ // Chuyển sang phần tử tiếp theo sau mỗi lần xóa
      } else {
        clearInterval(intervalRef.current) // Dừng khi đã xóa hết các phần tử
        setGameWon(true) // Đặt trạng thái game thắng
        setIsAutoPlayOn(false) // Tắt chế độ autoplay
      }
    }, 1500) // Chờ 1,5 giây giữa mỗi lần xóa
  }

  // handle play OFF
  const handleAutoPlayOff = () => {
    setIsAutoPlayOn(false)
    setGameOver(false)
    clearInterval(intervalRef.current)
    intervalRef.current = null
    // if (arrayItem.length > 0) {
    //   setPrevNumber(Number(arrayItem[0].text) - 1)
    // }
  }
  const toggleAutoPlay = () => {
    if (isAutoPlayOn) {
      handleAutoPlayOff()
    } else {
      handleAutoPlayOn()
    }
  }
  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])
  useEffect(() => {
    if (gameOver || gameWon) {
      if (timerRef.current) {
        clearInterval(timerRef.current) // Hủy bỏ bộ đếm thời gian
      }
    }
  }, [gameOver, gameWon])
  const styleColor = !gameWon && !gameOver ? 'black' : gameOver ? 'red' : 'green'

  return (
    <>
      <div className="container-game w-[600px] h-[660px] px-[20px] py-[10px] border-[1px] border-black mx-auto my-[0px]">
        <h2 style={{ color: styleColor }} className="font-bold">
          {gameWon ? 'ALL CLEARED' : ''}
          {gameOver ? 'GAME OVER' : ''}
          {!gameOver && !gameWon ? `LET'S IS PLAY` : ''}
        </h2>
        <div className="mt-[5px] flex items-center gap-[50px] ">
          <span>Points: </span>
          <span>
            <input
              onChange={handleOnChange}
              type="text"
              value={numberItem}
              className=" border-[1px] rounded-sm border-black ml-[2px]"
            />
          </span>
        </div>
        <div className="mt-[5px] flex items-center gap-[60px] ">
          <span>Time: </span>
          <span>{time.toFixed(1)}s</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="mt-[5px]  p-[2px] ">
            {restart === true ? (
              <button
                onClick={handleClickPlay}
                type="button"
                className="border-[1px] border-[#3b3535] px-[20px] py-[1px] rounded-sm bg-[#d3cece]"
              >
                Restart
              </button>
            ) : (
              <button
                onClick={handleClickPlay}
                type="button"
                className="border-[1px] border-[#3b3535] px-[20px] py-[1px] rounded-sm bg-[#d3cece]"
              >
                Play
              </button>
            )}
          </div>
          <div className="mt-[5px]  p-[2px]">
            {hasGameStarted && (
              <button
                onClick={toggleAutoPlay}
                type="button"
                className="border-[1px] border-[#3b3535] px-[20px] py-[1px] rounded-sm bg-[#d3cece]"
                disabled={gameOver}
              >
                {isAutoPlayOn ? 'Auto Play OFF' : 'Auto Play ON'}
              </button>
            )}
          </div>
        </div>
        <div className="mt-[5px] border-[1px] h-[500px]  border-black ">
          <svg width="100%" height="100%" stroke="black" xmlns="http://www.w3.org/2000/svg">
            {arrayItem.map((item) => (
              <>
                <CricleItem
                  disabled={isAutoPlayOn}
                  countdown={item?.countdown}
                  isDisappearing={item?.isDisappearing}
                  highlight={item?.highlight}
                  key={item.id}
                  item={item}
                  x={item.x}
                  y={item.y}
                  text={item.text}
                  color={item.color}
                  onClickRemove={handleRemove}
                />
              </>
            ))}
          </svg>
        </div>
      </div>
    </>
  )
}

export default App
