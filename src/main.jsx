import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// #region debug-point D:main-module-load
fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"react-runtime-error",runId:"post-fix",hypothesisId:"D",location:"src/main.jsx:6",msg:"[DEBUG] main module loaded",data:{url:import.meta.url},ts:Date.now()})}).catch(()=>{});
// #endregion

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
