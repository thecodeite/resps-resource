const numberRange = require('./number-range')

const toRange = numberRange.toRange
const toArray = numberRange.toArray

testToRange('Empty array becomes empty string', [], '')
testToRange('Single element', [1], '1')
testToRange('Two consecutive elements', [1, 2], '1_2')
testToRange('Two non-consecutive elements', [1, 3], '1,3')
testToRange('Many consecutive elements', [1, 2, 3, 4, 5], '1_5')
testToRange('Many non-consecutive elements', [1, 3, 5, 7, 9], '1,3,5,7,9')
testToRange('Two groups of con sec', [1,2,3, 5,6,7], '1_3,5_7')
testToRange('Discard duplicates', [1,1,2,3,3,4,5,5], '1_5', [1,2,3,4,5])
testToRange('Can handle string numbers', [1,2,'3'], '1_3', [1,2,3])
testToRange('Can start at zero', [0,1,2,3], '0_3')
testToRange('Can start end at zero', [-2,-1,0], '-2_0')
testToRange('Can go through zero', [-2,-1,0,1,2], '-2_2')

testToArray('Can handle null input', null, [])
testToArray('Can handle array input', [1,2,3], [1,2,3])

function testToArray(name, strIn, expectedArr) {
  console.log(name+':')
  const actualArr = toArray(strIn)

  const actualArrStr = JSON.stringify(actualArr)
  const expectedArrStr = JSON.stringify(expectedArr)

  if (actualArrStr != expectedArrStr) {
    return console.log('  FAILED', 'Expected:', expectedArrStr, 'Got:', actualArrStr)
  }
}

function testToRange(name, arrIn, expectedString, expectedArr) {
  console.log(name+':')
  const actualString = toRange(arrIn)

  if (actualString != expectedString) {
     console.log('  FAILED', 'Expected:', expectedString, 'Got:', actualString)
  } else {
    //console.log(name, 'PASS', 'Got:', expectedString)
  }

  const actualArr = toArray(actualString)

  const actualArrStr = JSON.stringify(actualArr)
  const expectedArrStr = JSON.stringify(expectedArr || arrIn)

  if (actualArrStr != expectedArrStr) {
    return console.log('  FAILED', 'Expected:', expectedArrStr, 'Got:', actualArrStr)
  }
}