import React, { createContext, useEffect } from 'react';
import { createBrowserHistory } from 'history';
import { Route, Routes } from 'react-router-dom';

import { defaultSelectedContext } from "./components/FileBrowser";
import { defaultEditorState } from "./components/Editor";
import { isLoggedIn, LoadingScreen, LoginPrompt, Logout } from "./services/auth";
import { defaultGithubContext, processCode } from "./services/github";
import { EditorScreen } from "./screens/EditorScreen";
import { HistoryRouter } from './components/HistoryRouter';


export const AppContext = createContext({
    selection: defaultSelectedContext,
    editor: defaultEditorState,
    github: defaultGithubContext,
});

export const browserHistory = createBrowserHistory();

function RedirectTo({path}: {path: string}) {
    useEffect(() => {
        const dest = new URL(window.location.href);
        dest.pathname = path;
        window.location.replace(dest);
    });
    return <LoadingScreen message="Beginning editing..." />;
}

function App() {
    const loggedIn = isLoggedIn();

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    useEffect(() => {
        processCode(code);
    }, [code]);

    return code ? <LoadingScreen/> : <HistoryRouter history={browserHistory}>
        <Routes>
            <Route path="/logout" element={<Logout />} />
            {!loggedIn && <Route path="*" element={<LoginPrompt />} />}
            {loggedIn && <>
                <Route path="edit/:branch/*" element={<EditorScreen />} />
                <Route path="edit/:branch" element={<EditorScreen />} />
                <Route path="*" element={<RedirectTo path="edit/master" />} />
            </>}
        </Routes>
    </HistoryRouter>;
}

export default App;
