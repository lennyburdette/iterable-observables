import Component from "@ember/component";
import Observable from "zen-observable";

let i = 0;
let observable = new Observable(observer => {
  observer.next(`value ${i++}`);

  let timer = setInterval(() => {
    observer.next(`value ${i++}`);
  }, 200);

  return () => clearInterval(timer);
});

export default class Bar extends Component {
  value = null;

  async didInsertElement() {
    for await (const value of observable) {
      if (!this.isDestroyed) {
        this.set("value", value);
      } else {
        break;
      }
    }
  }
}
