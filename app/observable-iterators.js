import Observable from "zen-observable";

class ObserverForAsyncIterator {
  _done = false;

  constructor() {
    this.setupPromise();
  }

  setupPromise() {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  next(value) {
    this._resolve(value);
    this.setupPromise();
  }

  error(err) {
    this._reject(err);
  }

  complete(value) {
    this._resolve(value);
    this._done = true;
  }

  get promise() {
    return this._promise;
  }

  get done() {
    return this._done;
  }
}

Observable.prototype[Symbol.asyncIterator] = async function*() {
  const observer = new ObserverForAsyncIterator();
  const subscription = this.subscribe(observer);

  try {
    while (true) {
      let value = await observer.promise;
      if (observer.done) return value;
      yield value;
    }
  } finally {
    subscription.unsubscribe();
  }
};
