function* bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          yield { arr: [...arr], highlight: [j, j + 1] };
        }
      }
    }
  }
  
  function* selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
        yield { arr: [...arr], highlight: [i, j, minIdx] };
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        yield { arr: [...arr], highlight: [i, minIdx] };
      }
    }
  }
  
  function* insertionSort(arr) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
        yield { arr: [...arr], highlight: [i, j + 1] };
      }
      arr[j + 1] = key;
      yield { arr: [...arr], highlight: [i, j + 1] };
    }
  }
  
  function* quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
      const pivotIndex = yield* partition(arr, low, high);
      yield* quickSort(arr, low, pivotIndex - 1);
      yield* quickSort(arr, pivotIndex + 1, high);
    }
  }
  
  function* partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield { arr: [...arr], highlight: [i, j, high] };
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    yield { arr: [...arr], highlight: [i + 1, high] };
    return i + 1;
  }
  
  function* mergeSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      yield* mergeSort(arr, left, mid);
      yield* mergeSort(arr, mid + 1, right);
      yield* merge(arr, left, mid, right);
    }
  }
  
  function* merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
  
    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      k++;
      yield { arr: [...arr], highlight: [k - 1, left + i - 1, mid + 1 + j - 1] };
    }
  
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      i++;
      k++;
      yield { arr: [...arr], highlight: [k - 1] };
    }
  
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      j++;
      k++;
      yield { arr: [...arr], highlight: [k - 1] };
    }
  }
  
  function* heapSort(arr) {
    const n = arr.length;
  
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      yield* heapify(arr, n, i);
    }
  
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      yield { arr: [...arr], highlight: [0, i] };
      yield* heapify(arr, i, 0);
    }
  }
  
  function* heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
  
    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
  
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }
  
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      yield { arr: [...arr], highlight: [i, largest] };
      yield* heapify(arr, n, largest);
    }
  }
  
  export { bubbleSort, selectionSort, insertionSort, quickSort, mergeSort, heapSort };