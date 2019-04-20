import '@polymer/polymer/polymer-element.js';
const $_documentContainer = document.createElement('template')

$_documentContainer.innerHTML = `<dom-module id="shared-styles">
  <template>
    <style>
      app-header {
        background-color: var(--app-primary-color);
        color: #fff;
        @apply --paper-material-elevation-3;
      }
      app-toolbar {
        --app-toolbar-font-size: 16px;
      }
      app-header paper-icon-button {
        --paper-icon-button-ink-color: white;
      }
      [main-title] {
        margin-left: 30px;
      }
    </style>
  </template>
</dom-module>`

document.head.appendChild($_documentContainer.content)

/* shared styles for all views */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
