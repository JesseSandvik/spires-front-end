import React from 'react';
import { Link } from 'react-router-dom';

const AppTitle = () => {
    return (
        <div className="appTitle">
            <Link to="/">
                <h1><i className="fas fa-grip-lines-vertical"></i> Spires.</h1>
                <small>Achieve new heights</small>
            </Link>
        </div>
    );
}

export default AppTitle;