type F = (...args: any[]) => void;

export function debounce(fn: F, t: number): F {
  let timerID: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args) {
    if (timerID !== null) {
      clearTimeout(timerID);
    }

    timerID = setTimeout(() => fn.apply(this, args), t);
  };
}
