var html = require('nanohtml')
var css = require('sheetify')

var aspectStyle = css`
:host {
  position: relative;
  height: 0;
  overflow: hidden;
  div, iframe, img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  img {
    object-fit: cover;
  }
}
:host.aspect-16x9 {
  padding-bottom: 56.25%;
}
:host.aspect-3x2 {
  padding-bottom: 66.67%;
}

@media only screen and (max-width: 600px) {
  :host {
    width: 100vw;
    left: -10px;
  }
  :host.aspect-16x9 {
    padding-bottom: calc(56.25% + 11.25px);
  }
  :host.aspect-3x2 {
    padding-bottom: calc(66.67% + 11.25px);
  }
}
`

const fixedAspect = (aspect, el) => html`
<div class="${aspectStyle} aspect-${aspect}">
  ${el}
</div>`

module.exports = fixedAspect
