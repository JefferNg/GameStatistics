import { css } from "@calpoly/mustang";

const styles = css`
body {
  background-color: var(--color-background-page);
  color: var(--color-text);
  font-family: Bitter, Palatino, Georgia, "Times New Roman", serif;
  font-weight: var(--font-weight-normal);
}
header {
  color: var(--color-header);
  background-color: var(--color-background-header);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--padding-normal);
}
h1 {
  font-family: Prompt, Verdana, Tahoma, Arial, sans-serif;
  font-weight: var(--font-weight-strong);
  font-size: x-large;
}
a {
  color: var(--color-link);
}
li {
  display: flex;
  align-items: center;
}
.review {
  display: flex;
  justify-content: center;
  margin: 1vh auto;
}
.review-text {
  width: 90vw;
  height: 50vh;
}
.rating {
  margin: 1vh auto;
}
svg.icon {
  display: inline;
  height: var(--svg-icon-size-small);
  width: var(--svg-icon-size-small);
  vertical-align: top;
  fill: currentColor;
}
p {
  padding: var(--padding-normal);
}
.game-layout {
  --page-grids: 6;
  display: grid;
  grid-template-columns: repeat(var(--page-grids), 1fr);
  row-gap: 5em;
  width: 100%;
}
.game-layout a {
  text-decoration: none;
}
@media screen and (max-width: 50rem) {
  .game-layout {
    --page-grids: 4;
    display: grid;
    grid-template-columns: repeat(var(--page-grids), 1fr);
    row-gap: 5em;
    width: 100%;
  }
}
@media screen and (max-width: 30rem) {
  .game-layout {
    --page-grids: 3;
    display: grid;
    grid-template-columns: repeat(var(--page-grids), 1fr);
    row-gap: 5em;
    width: 100%;
  }
}
@media screen and (min-width: 100rem) {
  .game-layout {
    --page-grids: 12;
    display: grid;
    grid-template-columns: repeat(var(--page-grids), 1fr);
    row-gap: 5em;
    width: 100%;
  }
}
`

export default { styles };