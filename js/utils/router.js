/**
 * Client-Side Router
 * Simple SPA routing system
 */

class Router {
    constructor() {
        this.routes = [];
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Listen for popstate (back/forward buttons)
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Handle initial route
        this.handleRoute();
    }

    /**
     * Register a route
     */
    route(path, handler) {
        this.routes.push({ path, handler });
        return this;
    }

    /**
     * Handle current route
     */
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const route = this.routes.find(r => {
            if (r.path === hash) return true;
            // Support for dynamic routes
            if (r.path.includes(':')) {
                const regex = new RegExp('^' + r.path.replace(/:\w+/g, '([^/]+)') + '$');
                return regex.test(hash);
            }
            return false;
        });

        if (route) {
            this.currentRoute = hash;
            route.handler();
        } else {
            // Default route
            this.navigate('/');
        }
    }

    /**
     * Navigate to a route
     */
    navigate(path) {
        window.location.hash = path;
    }

    /**
     * Get current route
     */
    getCurrentRoute() {
        return this.currentRoute || '/';
    }
}

// Export singleton instance
export const router = new Router();
