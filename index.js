const NUM_CLOCKS = 52
const SCREEN_SIZE_X = 1200
const SCREEN_SIZE_Y = 800
const BASE_CLOCK_SIZE = 500
const MAX_SCALE = 0.5
const MIN_SCALE = 0.05

const body = document.getElementsByTagName("body")[0]

const applyStyle = function (node, styles) {
    for (let style in styles) {
        node.style[style] = styles[style]
    }
}

const getClockContainer = function (dialColor, borderColor, indicatorColor, scale) {
    const clockContainer = document.createElement("div")
    const fontSize = BASE_CLOCK_SIZE / 10

    applyStyle(clockContainer, {
        "position": "absolute",
        "width": `${BASE_CLOCK_SIZE}px`,
        "height": `${BASE_CLOCK_SIZE}px`,
        "padding": "10px,0,0,10px",
        "border-radius": `${BASE_CLOCK_SIZE / 2}px`,
        "background-color": dialColor,
        "border": `1px solid ${borderColor}`,
        "transform": `scale(${scale})`
    })

    const centerDot = document.createElement("div")
    applyStyle(centerDot, {
        "position": "absolute",
        "top": `${BASE_CLOCK_SIZE / 2 - fontSize / 2}px`,
        "left": `${BASE_CLOCK_SIZE / 2 - fontSize / 2}px`,
        "width": `${fontSize}px`,
        "height": `${fontSize}px`,
        "border-radius": `${fontSize / 2}px`,
        "background-color": indicatorColor,
        "z-index": 100
    })
    clockContainer.appendChild(centerDot)

    for (let i = 1; i < 13; i++) {
        const r = (i - 1) * 30 - 90 + 30
        const x = Math.sin(r / 57.296) * (BASE_CLOCK_SIZE / 2 - fontSize)
        const y = Math.cos(r / 57.296) * (BASE_CLOCK_SIZE / 2 - fontSize)
        const number = document.createElement("div")
        applyStyle(number, {
            "height": `${fontSize}px`,
            "width": `${fontSize}px`,
            "text-align": "center",
            "position": "absolute",
            "top": `${BASE_CLOCK_SIZE / 2 + x - fontSize / 2}px`,
            "left": `${BASE_CLOCK_SIZE / 2 + y - fontSize / 2}px`,
            "font-size": `${fontSize}px`,
            "font-family": "serif",
            "font-weight": "bold",
            "color": indicatorColor
        })
        number.innerHTML = i
        clockContainer.appendChild(number)
    }

    for (let i = 0; i < 60; i++) {
        const x = Math.sin(i * 6 / 57.296) * (BASE_CLOCK_SIZE / 2 - 2 * fontSize)
        const y = Math.cos(i * 6 / 57.296) * (BASE_CLOCK_SIZE / 2 - 2 * fontSize)
        const tick = document.createElement("div")
        applyStyle(tick, {
            "width": `${fontSize / 3}`,
            "height": "1px",
            "position": "absolute",
            "top": `${BASE_CLOCK_SIZE / 2 + x}px`,
            "left": `${BASE_CLOCK_SIZE / 2 + y - fontSize / 6}px`,
            "transform": `rotate(${i * 6}deg)`,
            "background-color": indicatorColor
        })
        if (i % 5 !== 0) {
            clockContainer.appendChild(tick)
        }
    }
    return clockContainer
}

const getClockHand = function (handColor, handScale) {
    const handLength = BASE_CLOCK_SIZE / 2 * handScale
    const handContainer = document.createElement("div")
    applyStyle(handContainer, {
        "width": `${handLength}px`,
        "padding": `0 0 0 ${handLength}px`,
        "position": "absolute",
        "top": `${BASE_CLOCK_SIZE / 2}px`,
        "left": `${BASE_CLOCK_SIZE / 2 - handLength}px`
    })

    const hand = document.createElement("div")
    applyStyle(hand, {
        "width": `${handLength}px`,
        "height": "4px",
        "background-color": handColor
    })

    handContainer.appendChild(hand)
    return handContainer
}

const getClock = function (scale) {
    const colors = [
        "#89AEB2", "#97F2F3", "#F1E0B0", "#F1CDB0", "#E7CfC8", "#D2A3A9", "#C1CD97"
    ]
    const clockContainer = getClockContainer(colors[Math.floor(Math.random() * colors.length)], "gray", "black", scale)

    const secondHand = getClockHand("red", 0.8)
    const minuteHand = getClockHand("black", 0.8)
    const hourHand = getClockHand("black", 0.8 * 0.75)
    clockContainer.appendChild(secondHand)
    clockContainer.appendChild(minuteHand)
    clockContainer.appendChild(hourHand)

    setInterval(() => {
        const date = new Date()
        secondHand.style.transform = `rotate(${(date.getSeconds() * 6) - 90}deg)`
        minuteHand.style.transform = `rotate(${(date.getMinutes() * 6) - 90}deg)`
        hourHand.style.transform = `rotate(${(date.getHours() * 30) + (date.getMinutes() * 0.5) - 90}deg)`
    }, 1000)
    return clockContainer
}

const createClocks = function () {
    const clocks = []
    for (let i = 0; i < NUM_CLOCKS; i++) {
        const scale = MIN_SCALE + Math.random() * (MAX_SCALE - MIN_SCALE)
        clocks.push({
            xOffset: BASE_CLOCK_SIZE * (scale - 1) / 2 - scale * BASE_CLOCK_SIZE / 2,
            yOffset: BASE_CLOCK_SIZE * (scale - 1) / 2 - scale * BASE_CLOCK_SIZE / 2,
            x: Math.random() * SCREEN_SIZE_X,
            y: Math.random() * SCREEN_SIZE_Y,
            size: scale * BASE_CLOCK_SIZE,
            clock: getClock(scale)
        })
        body.appendChild(clocks[i].clock)
    }
    clocks.sort((a, b) => {
        return a.size - b.size
    })
    return clocks
}

const updateClocks = function (clocks) {
    for (let i = 0; i < clocks.length; i++) {
        clocks[i].clock.style.left = `${clocks[i].x + clocks[i].xOffset}px`
        clocks[i].clock.style.top = `${clocks[i].y + clocks[i].yOffset}px`
    }
}

const clocks = createClocks()
let isDone = false
let cycleCounter = 0

const cycler = setInterval(() => {
    if (!isDone) {
        isDone = true
        const g = 0.1
        for (let i = 0; i < clocks.length; i++) {
            for (let j = i + 1; j < clocks.length; j++) {
                let dx = clocks[i].x - clocks[j].x
                let dy = clocks[i].y - clocks[j].y
                let d = Math.sqrt(dx * dx + dy * dy)
                let a = Math.atan2(dx, dy)
                let err = d - (clocks[i].size / 2 + clocks[j].size / 2 + 6)
                if (err < 0) {
                    clocks[i].x += 4 * Math.sin(a)
                    clocks[i].y += 4 * Math.cos(a)
                    clocks[i].y -= g

                    clocks[j].x -= 4 * Math.sin(a)
                    clocks[j].y -= 4 * Math.cos(a)
                    clocks[j].y -= g

                    isDone = false
                }
            }
            clocks[i].x = clocks[i].x < clocks[i].size / 2 ? clocks[i].size / 2 : clocks[i].x
            clocks[i].y = clocks[i].y < clocks[i].size / 2 ? clocks[i].size / 2 : clocks[i].y

            clocks[i].x = clocks[i].x > SCREEN_SIZE_X ? SCREEN_SIZE_X : clocks[i].x
            clocks[i].y = clocks[i].y > SCREEN_SIZE_Y ? SCREEN_SIZE_Y : clocks[i].y
        }
        // Start removing clocks if we are stuck - remove the biggest one
        if (cycleCounter++ > 500) {
            let clock = clocks.pop()
            clock.clock.remove()
            console.log(`Can't stabilize - removing a clock with size = ${clock.size}`)
            cycleCounter = 0
        }
        updateClocks(clocks)
    } else {
        clearInterval(cycler)
        console.log("cycler has been stopped")
    }
}, 1)
