import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Layout } from './components/Layout';

// Pages
import { Home } from './pages/Home';
import { ProcessGuide } from './pages/ProcessGuide';
import { IdeaInput } from './pages/IdeaInput';
import { Analysis } from './pages/Analysis';
import { SelfFiling } from './pages/SelfFiling';
import { NonStopFiling } from './pages/NonStopFiling';
import { AttorneyList } from './pages/AttorneyList';
import { Chat } from './pages/Chat';
import { PricingAndQnA } from './pages/PricingAndQnA';
import { Admin } from './pages/Admin';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/process" element={<ProcessGuide />} />
            <Route path="/input" element={<IdeaInput />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/self-filing" element={<SelfFiling />} />
            <Route path="/nonstop-filing" element={<NonStopFiling />} />
            <Route path="/attorneys" element={<AttorneyList />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/pricing" element={<PricingAndQnA />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
      <Analytics />
    </>
  );
};

export default App;