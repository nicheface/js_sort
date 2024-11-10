import { bubbleSort, selectionSort, insertionSort, quickSort, mergeSort, heapSort } from './algorithms.js';

const algorithms = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  quick: quickSort,
  merge: mergeSort,
  heap: heapSort
};

const algorithmNames = {
  bubble: "Bubble Sort",
  selection: "Selection Sort",
  insertion: "Insertion Sort",
  quick: "Quick Sort",
  merge: "Merge Sort",
  heap: "Heap Sort"
};

const canvasContainer = document.getElementById('canvasContainer');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const speedSlider = document.getElementById('speedSlider');
const disorderSlider = document.getElementById('disorderSlider');
const leaderboardContainer = document.getElementById('leaderboardContainer');

let sortingInProgress = false;
let algorithmTimers = {};
let completedAlgorithms = 0;
let initialArray = [];

function createCanvas(algorithmName) {
  const algorithmDisplay = document.createElement('div');
  algorithmDisplay.className = 'algorithm-display';

  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  canvas.setAttribute('data-algorithm', algorithmName);
  
  const nameLabel = document.createElement('div');
  nameLabel.className = 'algorithm-name';
  nameLabel.textContent = algorithmNames[algorithmName];

  const timerLabel = document.createElement('div');
  timerLabel.className = 'algorithm-timer';
  timerLabel.textContent = '0.00s';
  timerLabel.id = `timer-${algorithmName}`;

  algorithmDisplay.appendChild(canvas);
  algorithmDisplay.appendChild(nameLabel);
  algorithmDisplay.appendChild(timerLabel);
  canvasContainer.appendChild(algorithmDisplay);
  
  return canvas;
}

function generateArray(size, disorderLevel) {
  const arr = Array.from({length: size}, (_, i) => i + 1);
  const shuffleCount = Math.floor(size * disorderLevel / 100);
  for (let i = 0; i < shuffleCount; i++) {
    const j = Math.floor(Math.random() * size);
    const k = Math.floor(Math.random() * size);
    [arr[j], arr[k]] = [arr[k], arr[j]];
  }
  return arr;
}

function drawArray(ctx, arr, highlightIndices = []) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const barWidth = width / arr.length;

  ctx.clearRect(0, 0, width, height);

  arr.forEach((value, index) => {
    const barHeight = (value / arr.length) * height;
    ctx.fillStyle = highlightIndices.includes(index) ? '#ff0000' : '#3498db';
    ctx.fillRect(index * barWidth, height - barHeight, barWidth, barHeight);
  });
}

async function runSortingAlgorithm(algorithmName, arr, canvas, speed) {
  const ctx = canvas.getContext('2d');
  const algorithm = algorithms[algorithmName];
  const generator = algorithm([...arr]);
  const startTime = performance.now();
  const timerLabel = document.getElementById(`timer-${algorithmName}`);

  function animate() {
    if (!sortingInProgress) return;

    const { value, done } = generator.next();
    if (done) {
      const endTime = performance.now();
      const totalTime = (endTime - startTime) / 1000;
      timerLabel.textContent = `${totalTime.toFixed(2)}s`;
      algorithmTimers[algorithmName] = totalTime;
      completedAlgorithms++;

      if (completedAlgorithms === Object.keys(algorithmTimers).length) {
        displayLeaderboard();
      }
      return;
    }

    drawArray(ctx, value.arr, value.highlight);
    const elapsedTime = (performance.now() - startTime) / 1000;
    timerLabel.textContent = `${elapsedTime.toFixed(2)}s`;

    setTimeout(() => requestAnimationFrame(animate), 101 - speed);
  }

  requestAnimationFrame(animate);
}

function displayLeaderboard() {
  const leaderboard = Object.entries(algorithmTimers)
    .sort(([, a], [, b]) => a - b)
    .map(([name, time], index) => `${index + 1}. ${algorithmNames[name]}: ${time.toFixed(2)}s`);

  leaderboardContainer.innerHTML = '<h2>Leaderboard</h2><ol>' + 
    leaderboard.map(entry => `<li>${entry}</li>`).join('') + 
    '</ol>';
  leaderboardContainer.style.display = 'block';
}

function initializeArrays() {
  const selectedAlgorithms = Array.from(document.querySelectorAll('input[name="algorithm"]:checked')).map(input => input.value);
  const arraySize = 50;
  const disorderLevel = parseInt(disorderSlider.value);

  initialArray = generateArray(arraySize, disorderLevel);

  canvasContainer.innerHTML = '';
  algorithmTimers = {};
  completedAlgorithms = 0;

  selectedAlgorithms.forEach(algorithmName => {
    const canvas = createCanvas(algorithmName);
    drawArray(canvas.getContext('2d'), initialArray);
  });
}

function startSorting() {
  if (sortingInProgress) return;

  sortingInProgress = true;
  startButton.disabled = true;
  stopButton.disabled = false;
  leaderboardContainer.style.display = 'none';

  const selectedAlgorithms = Array.from(document.querySelectorAll('input[name="algorithm"]:checked')).map(input => input.value);
  const speed = parseInt(speedSlider.value);

  selectedAlgorithms.forEach(algorithmName => {
    const canvas = document.querySelector(`canvas[data-algorithm="${algorithmName}"]`);
    runSortingAlgorithm(algorithmName, initialArray, canvas, speed);
  });
}

function stopSorting() {
  sortingInProgress = false;
  startButton.disabled = false;
  stopButton.disabled = true;
}

function resetVisualization() {
  stopSorting();
  initializeArrays();
  leaderboardContainer.style.display = 'none';
}

startButton.addEventListener('click', startSorting);
stopButton.addEventListener('click', stopSorting);
resetButton.addEventListener('click', resetVisualization);
disorderSlider.addEventListener('input', initializeArrays);

// Initialize arrays on page load
initializeArrays();

console.log("Sorting Algorithms Visualization initialized. Click 'Start Sorting' to begin.");