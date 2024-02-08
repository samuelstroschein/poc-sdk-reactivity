import { useState } from 'react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { loadProject } from './sdk';

const project = await loadProject()

function App() {

  return (
    <>
      <hr></hr>
      <h3>Settings</h3>
      <h4>modules</h4>
      {project.settings.modules.map((value) => <p>{value}</p>)}
      <hr></hr>
      <h3>actions</h3>
      
      <button onClick={() => {
        const settings = project.settings
        settings.modules.push("module-c@0.6.3")
        project.setSettings(settings)
      }}>
        add module-c
      </button>
      
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
