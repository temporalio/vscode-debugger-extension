import App from "../views/app.svelte"
import { 
  provideVSCodeDesignSystem, 
  vsCodeButton, 
  vsCodePanels, 
  vsCodePanelTab, 
  vsCodePanelView, 
  vsCodeProgressRing,
  vsCodeTextField,
  vsCodeCheckbox,
  vsCodeDivider,
} from "@vscode/webview-ui-toolkit"

const app = new App({
  target: document.body,
})

provideVSCodeDesignSystem().register(
  vsCodeButton(), 
  vsCodePanels(), 
  vsCodePanelTab(), 
  vsCodePanelView(), 
  vsCodeProgressRing(),
  vsCodeTextField(),
  vsCodeCheckbox(),
  vsCodeDivider()
);

export default app
