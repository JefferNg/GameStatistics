import { Auth, define } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { PageHeaderElement } from "./components/page-header";
import { HomeViewElement } from "./views/home-view";

class AppElement extends LitElement {
  static uses = define({
    "home-view": HomeViewElement,
  });

  protected render() {
    return html` <home-view></home-view> `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    PageHeaderElement.initializeOnce();
  }
}

define({
  "mu-auth": Auth.Provider,
  "stats-app": AppElement,
  "page-header": PageHeaderElement,
});
