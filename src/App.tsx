import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogDescription from "./pages/BlogDescription";
import Registration from "./pages/Registration";
import AIRecommendation from "./pages/AIRecommendation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDescription />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/ai-recommendation" element={<AIRecommendation />} />
      </Routes>
    </Router>
  );
}

export default App;
