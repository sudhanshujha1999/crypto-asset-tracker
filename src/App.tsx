import { Header } from "./components/organism/Header";
import Dashboard from "./pages/Dashboard";

function App() {

  return (
    <div className="flex flex-col flex-shrink-0 items-start self-stretch max-x-[100vw] min-h-[100vh] bg-[#121a21]">
      <div className="flex flex-col items-start self-stretch">
        <Header />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
