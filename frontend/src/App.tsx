import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import RoutesWithNav from "./components/RoutesWithNav";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <RoutesWithNav/>
        </BrowserRouter>
    );
};

export default App;


