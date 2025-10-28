import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IGallery } from "../../types";

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.catalogElement = ensureElement(".gallery");
  }

  set catalog(items: HTMLElement[]) {
    if (items.length === 0) {
      this.catalogElement.innerHTML = "";
      return;
    }
    this.catalogElement.replaceChildren(...items);
  }
}
