import Spinner from 'react-bootstrap/Spinner';
import './Loading.css';

function Loading({state}:{state:boolean}) {
    return state && (
    <div className="loading-overlay">
        <Spinner animation="border" variant="dark"/>
    </div>)
  }
  
  export default Loading;