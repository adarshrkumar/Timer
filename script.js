var dTitle = document.title
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
let bypassWait = !!urlParams.get('bypassWait')
let cWaitTime = Number(urlParams.get('cWaitTime'))
let theLValue = 360
let degValue = false

let timeH = ''
let timeM = ''
let timeS = ''
let totalSecs = 1

if (!!urlParams.get('hrs')) timeH = urlParams.get('hrs')
else timeH = '00'
if (timeH.split('').length < 2)`0${timeS}`

if (!!urlParams.get('min')) timeM = urlParams.get('min')
else timeM = '00'
if (timeM.split('').length < 2)`0${timeS}`

if (!!urlParams.get('sec')) timeS = urlParams.get('sec')
else timeS = '00'
if (timeS.split('').length < 2)`0${timeS}`

var tElement = document.querySelector('#time')
let cElement = tElement.querySelector('.circle.outer')
tElement = tElement.querySelector('.inputs')
var hElement = tElement.querySelector('#hrs')
var mElement = tElement.querySelector('#min')
var sElement = tElement.querySelector('#sec')
if (
  timeH === 0 && 
  timeM === 0 && 
  timeS === 0
) {
  let sTIME = 10
  if (bypassWait) sTIME = 0
  if ((!!cWaitTime || cWaitTime === 0)) sTIME = cWaitTime
  var interval = ''
  function sTime() {
    tElement.querySelectorAll('input').forEach(function(e) {
      e.setAttribute('disabled', '')
    })
    tElement.value = `Starting in ${sTIME} seconds.`
    if (sTIME <= 0 && sTIME !== 0) {
      tElement.querySelectorAll('input').forEach(function(e) {
        e.removeAttribute('style')
        e.removeAttribute('disabled')
      })
      hElement.value = timeH
      mElement.value = timeM
      sElement.value = timeS
      go()
    }
    else {
      sTIME--
      interval = setTimeout(sTime, 1000)
    }
  }
  interval = setTimeout(sTime, 1000)
}

var startStopButton = document.getElementById('startstop')
var lastTime = false
var interval = setTimeout(function() { }, 999999999999)
var startingValue = false
document.getElementById('reset').addEventListener('click', function() {
  degValue = false
  theLValue = 360
  cElement.style.setProperty('--t-left', `${theLValue}deg`)
  reset()
})

function setTime() {
  var amt = `${hElement.value}:${mElement.value}:${sElement.value}`
  document.title = `${amt} | ${dTitle}`
  var hrs = hElement.value
  hrs = String(hrs)
  var min = mElement.value
  min = String(min)
  var sec = sElement.value
  let allSecs = Number(hrs*3600) + Number(min*60) + Number(sec)
  if (!!degValue === false) {
    degValue = (360/allSecs)
  }
  theLValue = theLValue - degValue
  cElement.style.setProperty('--t-left', `${theLValue}deg`)
  sec--
  if (sec < 0) {
    sec = 59
    min--
  }
  if (min < 0) {
    min = 59
    hrs--
  }
  if (String(hrs).split('').length === 1) {
    hrs = `0${hrs}`
  }
  if (String(min).split('').length === 1) {
    min = `0${min}`
  }
  if (String(sec).split('').length === 1) {
    sec = `0${sec}`
  }
  amt = `${hrs}:${min}:${sec}`
  document.title = `${amt} | ${dTitle}`
  hElement.value = hrs
  mElement.value = min
  sElement.value = sec
  if (`${hrs}:${min}:${sec}` === '00:00:00') {
    stop()
  }
  lastTime = `${hrs}:${min}:${sec}`
}

function go() {
  let timeEle = tElement.parentNode.querySelector('.new-time')
  timeEle.removeAttribute('hidden')
  timeEle.style.display = ''
  let btnsElement = tElement.parentNode.querySelector('.btns')
  btnsElement.style.setProperty('--width', 'unset')
  btnsElement.style.justifyContent = 'left'
  btnsElement.style.left = 'unset'

  let hrs = hElement.value
  let min = mElement.value
  let sec = sElement.value
  
  var amt = `${hrs}:${min}:${sec}`
  totalSecs = Number(hrs)*3600 + Number(min)*60 + Number(sec)

  let currentTime = getCurrentTime()
  currentTime = currentTime.split(' ')[0]
  currentTime = currentTime.split(':')
  currentTime[0] = Number(currentTime[0])
  currentTime[1] = Number(currentTime[1])+(totalSecs/60)
  while (currentTime[1] > 59) {
    currentTime[0]++
    currentTime[1]-=60
  }
  if (String(currentTime[1]).includes('.')) {
    currentTime[1] = String(currentTime[1]).split('.')[0]
  }
  if (String(currentTime[1]).split('').length === 1) {
    currentTime[1] = `0${currentTime[1]}`
  }
  currentTime = `${currentTime[0]}:${currentTime[1]}`
  timeEle.querySelector('.time > .show-time').innerHTML = currentTime
  
  if (amt !== lastTime) {
    startingValue = amt
  }
  if (amt !== '::' && amt.endsWith(':00:00') === false) {
    tElement.querySelectorAll('input').forEach(function(e) {
      e.setAttribute('disabled', '')
    })
    cElement.style.setProperty('--t-left', `${theLValue}deg`)
    interval = setInterval(setTime, 1000)
    document.querySelectorAll('button')[0].querySelector('b').innerHTML = 'Pause'
    startStopButton.setAttribute('onclick', 'stop()')
    
  }

}

function stop() {
  document.title = dTitle
  let timeEle = tElement.parentNode.querySelector('.new-time')
  timeEle.setAttribute('hidden', '')
  timeEle.style.display = 'none'
  let btnsElement = tElement.parentNode.querySelector('.btns')
  btnsElement.style.setProperty('--width', 'calc(100% - 37.5px*2)')
  btnsElement.style.justifyContent = 'center'
  btnsElement.style.left = '37.5px'
  btnsElement.style.right = '37.5px'
  timeEle.querySelector('.time > .show-time').innerHTML = `00:00`

  clearInterval(interval)
    tElement.querySelectorAll('input').forEach(function(e) {
      e.removeAttribute('disabled')
    })
  startStopButton.setAttribute('onclick', 'go()')
  document.querySelectorAll('button')[0].querySelector('b').innerHTML = 'Start'
}

function reset() {
  stop()
  hElement.value = startingValue.split(':')[0]
  mElement.value = startingValue.split(':')[1]
  sElement.value = startingValue.split(':')[2]
  document.title = `${startingValue} | ${dTitle}`
  startStopButton.setAttribute('onclick', 'go()')
}

function getCurrentTime() {
  const d = new Date();
  return d.toLocaleTimeString();
}