import '@/reset.css';
import '@/global.css';
import '@/temps/fonts/process/firacode-regular-400/index.css';
import '@/temps/fonts/process/lxgwwenkai-bold-700/index.css';
import '@/temps/fonts/process/lxgwwenkai-regular-400/index.css';
import '@/temps/fonts/process/lxgwwenkaimono-regular-400/index.css';
import Blog from '@/pages/Blog';
import { Home } from '@/pages/home';
import { render } from 'solid-js/web';
import { Route, Router, Routes } from '@solidjs/router';

const root = document.getElementById('root');
const code = () => (
    <Router>
        <Routes>
            <Route path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/blog/*path" component={Blog} />
        </Routes>
    </Router>
);

render(code, root!);
