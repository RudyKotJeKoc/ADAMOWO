/**
 * Radio Adamowo Admin Panel - Main JavaScript
 * Modern admin interface with API integration
 */

class AdminApp {
    constructor() {
        this.apiUrl = '../api/v1';
        this.currentSection = 'dashboard';
        this.user = null;
        this.init();
    }

    async init() {
        this.showLoading();
        await this.checkAuth();
        this.bindEvents();
        this.hideLoading();
    }

    showLoading() {
        document.getElementById('loading-screen').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    }

    async checkAuth() {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            this.showLogin();
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.user = data.user;
                this.showDashboard();
            } else {
                localStorage.removeItem('admin_token');
                this.showLogin();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }

    showDashboard() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        this.loadDashboardData();
    }

    bindEvents() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').replace('#', '');
                this.navigateToSection(section);
            });
        });

        // Sidebar toggle
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        document.getElementById('sidebar-close').addEventListener('click', () => {
            this.closeSidebar();
        });

        document.getElementById('sidebar-overlay').addEventListener('click', () => {
            this.closeSidebar();
        });

        // User menu
        document.getElementById('user-menu-btn').addEventListener('click', () => {
            this.toggleUserMenu();
        });

        // Close menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#user-menu-btn') && !e.target.closest('#user-menu')) {
                document.getElementById('user-menu').classList.add('hidden');
            }
        });
    }

    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');
        const errorText = document.getElementById('login-error-text');

        try {
            // For demo purposes, use simple validation
            // In production, this should authenticate against the API
            if (username === 'admin' && password === 'admin123') {
                // Simulate API response
                const token = 'demo-admin-token-' + Date.now();
                localStorage.setItem('admin_token', token);
                
                this.user = {
                    id: 1,
                    username: 'admin',
                    role: 'admin',
                    display_name: 'Administrator'
                };

                this.showDashboard();
            } else {
                errorText.textContent = 'Nieprawidłowe dane logowania';
                errorDiv.classList.remove('hidden');
                setTimeout(() => {
                    errorDiv.classList.add('hidden');
                }, 5000);
            }
        } catch (error) {
            console.error('Login failed:', error);
            errorText.textContent = 'Wystąpił błąd podczas logowania';
            errorDiv.classList.remove('hidden');
        }
    }

    handleLogout() {
        localStorage.removeItem('admin_token');
        this.user = null;
        this.showLogin();
    }

    navigateToSection(section) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active', 'bg-red-600', 'text-white');
            link.classList.add('text-gray-300', 'hover:text-white', 'hover:bg-gray-800');
        });

        const activeLink = document.querySelector(`.nav-link[href="#${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active', 'bg-red-600', 'text-white');
            activeLink.classList.remove('text-gray-300', 'hover:text-white', 'hover:bg-gray-800');
        }

        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show selected section
        const targetSection = document.getElementById(`${section}-content`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('fade-in');
        }

        this.currentSection = section;
        this.loadSectionData(section);
    }

    async loadSectionData(section) {
        switch (section) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'stream':
                await this.loadStreamData();
                break;
            case 'comments':
                await this.loadCommentsData();
                break;
            case 'analytics':
                await this.loadAnalyticsData();
                break;
            // Add more cases as needed
        }
    }

    async loadDashboardData() {
        try {
            // Load various dashboard stats
            const [streamStats, commentStats] = await Promise.all([
                this.fetchStreamStats(),
                this.fetchCommentStats()
            ]);

            this.updateDashboardStats(streamStats, commentStats);
            this.updateRecentActivity();
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    async fetchStreamStats() {
        try {
            const response = await fetch(`${this.apiUrl}/stream/stats`);
            if (response.ok) {
                const data = await response.json();
                return data.data;
            }
        } catch (error) {
            console.error('Failed to fetch stream stats:', error);
        }
        
        // Return mock data if API fails
        return {
            realtime: {
                current_listeners: 127,
                peak_today: 247,
                uptime_seconds: 99.9
            },
            daily: {
                total_listening_hours: 1247
            }
        };
    }

    async fetchCommentStats() {
        try {
            const response = await fetch(`${this.apiUrl}/comments/stats`);
            if (response.ok) {
                const data = await response.json();
                return data.data;
            }
        } catch (error) {
            console.error('Failed to fetch comment stats:', error);
        }

        // Return mock data if API fails
        return {
            totals: {
                pending: 5,
                total: 23
            }
        };
    }

    updateDashboardStats(streamStats, commentStats) {
        // Update the dashboard stat cards
        const listeners = streamStats.realtime?.current_listeners || 127;
        const newComments = commentStats.totals?.pending || 5;
        const totalPlays = streamStats.daily?.total_listening_hours || 1247;
        const uptime = streamStats.realtime?.uptime_seconds || 99.9;

        // Update DOM elements
        document.querySelector('.bg-red-100').closest('.bg-white').querySelector('.text-2xl').textContent = listeners;
        document.querySelectorAll('.text-2xl')[1].textContent = newComments;
        document.querySelectorAll('.text-2xl')[2].textContent = totalPlays.toLocaleString();
        document.querySelectorAll('.text-2xl')[3].textContent = `${uptime}%`;
    }

    async updateRecentActivity() {
        try {
            const response = await fetch(`${this.apiUrl}/comments?limit=5&approved=1`);
            if (response.ok) {
                const data = await response.json();
                this.renderRecentComments(data.data.comments);
            }
        } catch (error) {
            console.error('Failed to load recent comments:', error);
        }
    }

    renderRecentComments(comments) {
        const container = document.querySelector('.space-y-4');
        if (!container) return;

        container.innerHTML = '';
        
        comments.slice(0, 3).forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'flex items-start space-x-3';
            commentEl.innerHTML = `
                <div class="w-8 h-8 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
                    ${comment.name.charAt(0).toUpperCase()}
                </div>
                <div class="flex-1">
                    <p class="font-medium text-gray-900">${this.escapeHtml(comment.name)}</p>
                    <p class="text-sm text-gray-600">${this.truncateText(this.escapeHtml(comment.text), 60)}</p>
                    <p class="text-xs text-gray-500 mt-1">${this.formatTime(comment.created_at)}</p>
                </div>
                <button class="text-gray-400 hover:text-gray-600" onclick="adminApp.viewComment(${comment.id})">
                    <i class="fas fa-eye"></i>
                </button>
            `;
            container.appendChild(commentEl);
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
        } else {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        }
    }

    closeSidebar() {
        document.getElementById('sidebar').classList.add('-translate-x-full');
        document.getElementById('sidebar-overlay').classList.add('hidden');
    }

    toggleUserMenu() {
        const menu = document.getElementById('user-menu');
        menu.classList.toggle('hidden');
    }

    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    truncateText(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'przed chwilą';
        if (diffMins < 60) return `${diffMins} minut temu`;
        if (diffHours < 24) return `${diffHours} godzin temu`;
        return `${diffDays} dni temu`;
    }

    async viewComment(commentId) {
        // Implementation for viewing individual comments
        console.log('Viewing comment:', commentId);
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 max-w-sm w-full bg-white border-l-4 p-4 shadow-lg rounded-lg slide-over ${
            type === 'success' ? 'border-green-500' :
            type === 'error' ? 'border-red-500' :
            type === 'warning' ? 'border-yellow-500' : 'border-blue-500'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <i class="fas ${
                        type === 'success' ? 'fa-check-circle text-green-500' :
                        type === 'error' ? 'fa-exclamation-circle text-red-500' :
                        type === 'warning' ? 'fa-exclamation-triangle text-yellow-500' : 'fa-info-circle text-blue-500'
                    }"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-gray-700">${message}</p>
                </div>
                <div class="ml-auto pl-3">
                    <button class="inline-flex text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize the admin app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminApp = new AdminApp();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Implement global search
    }
    
    // Escape to close modals/menus
    if (e.key === 'Escape') {
        document.getElementById('user-menu').classList.add('hidden');
        // Close other modals as needed
    }
});