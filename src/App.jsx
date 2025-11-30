import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { GroupProvider } from './contexts/GroupContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ErrorProvider } from './contexts/ErrorContext'
import Toast from './components/Toast'
import Login from './pages/Login'
import Register from './pages/Register'
import GroupSetup from './pages/GroupSetup'
import Dashboard from './pages/Dashboard'
import Goals from './pages/Goals'
import Debts from './pages/Debts'
import Budgets from './pages/Budgets'
import Accounts from './pages/Accounts'
import Settings from './pages/Settings'
import PrivateRoute from './components/PrivateRoute'

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ErrorProvider>
                    <GroupProvider>
                        <Router>
                            <Routes>
                                {/* Public routes */}
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                {/* Protected routes */}
                                <Route path="/group-setup" element={
                                    <PrivateRoute requireGroup={false}>
                                        <GroupSetup />
                                    </PrivateRoute>
                                } />

                                <Route path="/dashboard" element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                } />

                                <Route path="/goals" element={
                                    <PrivateRoute>
                                        <Goals />
                                    </PrivateRoute>
                                } />

                                <Route path="/debts" element={
                                    <PrivateRoute>
                                        <Debts />
                                    </PrivateRoute>
                                } />

                                <Route path="/budgets" element={
                                    <PrivateRoute>
                                        <Budgets />
                                    </PrivateRoute>
                                } />

                                <Route path="/accounts" element={
                                    <PrivateRoute>
                                        <Accounts />
                                    </PrivateRoute>
                                } />

                                <Route path="/settings" element={
                                    <PrivateRoute>
                                        <Settings />
                                    </PrivateRoute>
                                } />

                                {/* Default redirect */}
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                            </Routes>
                            <Toast />
                        </Router>
                    </GroupProvider>
                </ErrorProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
