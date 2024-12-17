import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import LoginPage from '../Pages/LoginPage/LoginPage';
import SpotifyCallbackLandingPage from '../Pages/SpotifyCallbackLandingPage/SpotifyCallbackLandingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <LoginPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'spotifyAuth/success', element: <SpotifyCallbackLandingPage /> },
      // {
      //   path: "search",
      //   element: (
      //     <ProtectedRoute>
      //       <StationsListPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // { path: "design-guide", element: <DesignGuide /> },
      // {
      //   path: 'stations',
      //   element: (
      //     <ProtectedRoute>
      //       <StationsListPage />
      //     </ProtectedRoute>
      //   ),
      //   // children: [
      //   //   { path: "company-profile", element: <CompanyProfile /> },
      //   //   { path: "income-statement", element: <IncomeStatement /> },
      //   //   { path: "balance-sheet", element: <BalanceSheet /> },
      //   //   { path: "cashflow-statement", element: <CashflowStatement /> },
      //   //   { path: "historical-dividend", element: <HistoricalDividend /> },
      //   // ],
      // },
    ],
  },
]);
