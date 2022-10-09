import './App.css';
import Dropdown from './lib/components/Dropdown/Dropdown'
import { CSSTransition } from 'react-transition-group';

function App() {
  return (
    <div className="App">
      <Dropdown
        label={'Colors'}
        allOption={true}
        initialSelectedOptions={['Blue']}
        multiSelect={true}
        initialOptions={['White', 'Red', 'Blue', 'Brown', 'Black']} />
    </div>
  );
}

export default App;
