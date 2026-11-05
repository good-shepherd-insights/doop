import React from 'react'
import ReactDOM from 'react-dom/client'
import './lib/posthog'
import { App } from './App'
import { initDesktopShell } from './lib/desktop'
import { TooltipProvider } from './components/ui/tooltip'
import { initTheme } from './lib/theme'
import { initLocale } from './lib/i18n'
import { initBranding } from './lib/branding'
import { installTranslateGuard } from './lib/translateGuard'
import './styles.css'

installTranslateGuard()
initDesktopShell()
initTheme()

/* the language and the brand are settled first, so the first paint already
   speaks both — a failed branding fetch resolves too and keeps the default */
void Promise.all([initLocale(), initBranding()]).then(() =>
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </React.StrictMode>,
  ),
)
