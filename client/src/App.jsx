// src/App.jsx
import { BrowserRouter } from 'react-router-dom'
import AppRoute from './routes'
import { ServerContextProvider, ToastContextProvider, ThemeContextProvider, AuthContextProvider } from './contexts'

function App() {

  return (
    <ThemeContextProvider>
      <ToastContextProvider>
        <ServerContextProvider>
          <AuthContextProvider>
            <BrowserRouter>
              <AppRoute />
            </BrowserRouter>
          </AuthContextProvider>
        </ServerContextProvider>
      </ToastContextProvider>
    </ThemeContextProvider>
  )
}

export default App