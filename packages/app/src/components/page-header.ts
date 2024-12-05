import { Events } from "@calpoly/mustang";
import { LitElement, css, html } from "lit";

export class PageHeaderElement extends LitElement {
  render() {
    return html`
      <header>
        <h1>Steam Games Essentials</h1>
        <div>
          <a href="./ratings"> Games Rated </a>
          <svg class="icon"><use href="./icons/game.svg#icon-rate" /></svg>
        </div>
        <div>
          <a href="./recommendations"> Recommended Games </a>
          <svg class="icon"><use href="./icons/game.svg#icon-rec" /></svg>
        </div>
        <label @change=${toggleDarkMode}>
          <input type="checkbox" autocomplete="off" />
          Dark mode
        </label>
        <h3>
          <a href="/accounts/1">
            <svg class="icon">
              <use href="./icons/game.svg#icon-user" />
            </svg>
            Account
          </a>
        </h3>
      </header>
    `;
  }

  static styles = css`
    header {
      color: var(--color-header);
      background-color: var(--color-background-header);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--padding-normal);
    }
    header h3,
    header div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    h1 {
      font-family: var(--font-family-san-serif);
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    svg.icon {
      display: inline;
      height: var(--svg-icon-size-small);
      width: var(--svg-icon-size-small);
      vertical-align: top;
      fill: currentColor;
    }
    a {
      color: var(--color-link);
    }
  `;

  static initializeOnce() {
    function toggleDarkMode(page: HTMLElement, checked: boolean) {
      page.classList.toggle("dark-mode", checked);
    }

    document.body.addEventListener("dark-mode", (event) =>
      toggleDarkMode(
        event.currentTarget as HTMLElement,
        (event as CustomEvent).detail?.checked
      )
    );
  }
}

function toggleDarkMode(ev: InputEvent) {
  const target = ev.target as HTMLInputElement;
  const checked = target.checked;

  Events.relay(ev, "dark-mode", { checked });
}
