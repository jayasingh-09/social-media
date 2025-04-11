// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Home from "./pages/home";
import Login from "./pages/login";
import Post from "./pages/post";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home/:email" element={<Home />} />
        <Route path="/post/:email" element={<Post/>}/>
      </Routes>
    </Router>
  );
}

export default App;
