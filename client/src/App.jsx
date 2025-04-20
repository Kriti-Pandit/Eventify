import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage'
import RegisterPage from './pages/RegisterPage'
import Layout from './Layout'
import LoginPage from './pages/LoginPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import UserAccountPage from './pages/UserAccountPage'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AddEvent from './pages/AddEvent'
import EventPage from './pages/EventPage'
import CalendarView from './pages/CalendarView'
import OrderSummary from './pages/OrderSummary'
import PaymentSummary from './pages/PaymentSummary'
import TicketPage from './pages/TicketPage'
import CreateEvent from './pages/CreateEvent'
import BookingConfirmation from './pages/BookingConfirmation'

axios.defaults.baseURL = 'http://localhost:4000/'
axios.defaults.withCredentials = true

function App() {
  return (
    <UserContextProvider> 
      <Routes>
        {/* Layout wrapper for all main pages */}
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path='events' element={<EventPage />} /> 
          <Route path='useraccount' element={<UserAccountPage />} />
          <Route path='createEvent' element={<CreateEvent />} />
          <Route path='calendar' element={<CalendarView />} />
          <Route path='wallet' element={<TicketPage />} />
          <Route path='tickets' element={<TicketPage />} />
          <Route path='booking-confirmation/:id' element={<BookingConfirmation />} />

          {/* Event Details + Nested Pages */}
          <Route path='event/:id' element={<EventPage />} />
          <Route path='event/:id/ordersummary' element={<OrderSummary />} />
          <Route path='event/:id/ordersummary/paymentsummary' element={<PaymentSummary />} />
        </Route>

        {/* Authentication routes (outside Layout) */}
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
      </Routes>
    </UserContextProvider>
  )
}

export default App
