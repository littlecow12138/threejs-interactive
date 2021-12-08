import "./App.css";
import { useState } from "react";
import InteractDemo from "./components/InteractDemo";
import PathDemo from "./components/PathDemo"

function App() {
  const [page, setPage] = useState("interact");
  return (
    <div className="App">
      <div className="Header">
        <div className="Header_item" onClick={() => setPage("interact")}>
          threejs交互
        </div>
        <div className="Header_item" onClick={() => setPage("pathAnimate")}>
          threejs路径动画
        </div>
      </div>
      <div className="Main">
        {(() => {
          console.log(page);
          switch (page) {
            case "interact":
              return <InteractDemo />;
            case "pathAnimate":
              return <PathDemo />;
            default:
              return <div>default</div>;
          }
        })()}
      </div>
    </div>
  );
}

export default App;
