import { debounce } from "./debounce"; // adjust path

describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("executes a single call after delay", () => {
    const fn = jest.fn();
    const d = debounce(fn, 50);

    d(1);

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);
  });

  it("cancels previous calls and executes only the last one", () => {
    const fn = jest.fn();
    const d = debounce(fn, 50);

    d(1);
    d(2);
    d(3);

    jest.advanceTimersByTime(50);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(3);
  });

  it("calls spaced outside debounce window all execute", () => {
    const fn = jest.fn();
    const d = debounce(fn, 50);

    d(1);
    jest.advanceTimersByTime(60);

    d(2);
    jest.advanceTimersByTime(60);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, 1);
    expect(fn).toHaveBeenNthCalledWith(2, 2);
  });

  it("passes multiple arguments correctly", () => {
    const fn = jest.fn();
    const d = debounce(fn, 30);

    d(1, 2, 3);

    jest.advanceTimersByTime(30);

    expect(fn).toHaveBeenCalledWith(1, 2, 3);
  });

  it("preserves this context", () => {
    const fn = jest.fn(function (this: any) {
      return this.value;
    });

    const obj = {
      value: 42,
      d: debounce(fn, 20),
    };

    obj.d();

    jest.advanceTimersByTime(20);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.instances[0].value).toBe(42);
  });

  it("t = 0 still debounces (last call wins)", () => {
    const fn = jest.fn();
    const d = debounce(fn, 0);

    d(1);
    d(2);
    d(3);

    jest.advanceTimersByTime(0);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(3);
  });

  it("handles rapid calls with interleaved timing", () => {
    const fn = jest.fn();
    const d = debounce(fn, 50);

    d(1);
    jest.advanceTimersByTime(20);

    d(2);
    jest.advanceTimersByTime(20);

    d(3);
    jest.advanceTimersByTime(50);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(3);
  });

  it("same timestamp calls → last call wins", () => {
    const fn = jest.fn();
    const d = debounce(fn, 100);

    d(1, 2);

    jest.advanceTimersByTime(200);
    d(3, 4);
    d(5, 6);

    jest.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, 1, 2);
    expect(fn).toHaveBeenNthCalledWith(2, 5, 6);
  });
});
