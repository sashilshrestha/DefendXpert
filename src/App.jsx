import './App.css';
import FileUploaderWithSteps from './components/FileUploaderWithSteps';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <>
      <div className="shadow-md bg-dxprimary">
        <div className="mx-auto max-w-7xl">
          <Navbar />
        </div>
      </div>
      <div className="mx-auto max-w-7xl">
        <FileUploaderWithSteps />
      </div>
    </>
  );
};

export default App;
