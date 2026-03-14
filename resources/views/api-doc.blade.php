<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation - Payment Gateway</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0f172a;
            --sidebar-bg: #1e293b;
            --accent-color: #38bdf8;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --card-bg: rgba(30, 41, 59, 0.7);
            --border-color: rgba(255, 255, 255, 0.1);
            --code-bg: #000000;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Layout */
        .admin-container {
            display: flex;
            min-height: 100vh;
        }

        aside {
            width: 300px;
            background-color: var(--sidebar-bg);
            padding: 2rem;
            position: fixed;
            height: 100vh;
            border-right: 1px solid var(--border-color);
            overflow-y: auto;
        }

        main {
            flex: 1;
            margin-left: 300px;
            padding: 3rem;
            max-width: 1000px;
        }

        /* Sidebar Navigation */
        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 2rem;
            color: var(--accent-color);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .nav-group {
            margin-bottom: 2rem;
        }

        .nav-title {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-secondary);
            margin-bottom: 1rem;
            font-weight: 600;
        }

        .nav-link {
            display: block;
            color: var(--text-primary);
            text-decoration: none;
            padding: 0.5rem 0;
            font-size: 0.9rem;
            transition: color 0.2s;
        }

        .nav-link:hover {
            color: var(--accent-color);
        }

        /* Content Styles */
        h1 { font-size: 2.5rem; margin-bottom: 1rem; font-weight: 800; }
        p { color: var(--text-secondary); margin-bottom: 2rem; }

        .section {
            margin-bottom: 4rem;
            scroll-margin-top: 3rem;
        }

        .endpoint-card {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            margin-bottom: 2rem;
        }

        .endpoint-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .method {
            padding: 0.25rem 0.75rem;
            border-radius: 6px;
            font-weight: 700;
            font-size: 0.8rem;
            text-transform: uppercase;
        }

        .method.post { background-color: #10b981; color: white; }
        .method.get { background-color: #3b82f6; color: white; }

        .url {
            font-family: 'Fira Code', monospace;
            font-size: 1rem;
            color: var(--accent-color);
        }

        h3 { margin-bottom: 1rem; font-size: 1.25rem; color: var(--text-primary); }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1.5rem;
        }

        th, td {
            text-align: left;
            padding: 0.75rem;
            border-bottom: 1px solid var(--border-color);
        }

        th {
            font-size: 0.85rem;
            color: var(--text-secondary);
            text-transform: uppercase;
        }

        td {
            font-size: 0.95rem;
        }

        .required { color: #ef4444; font-weight: 600; }

        pre {
            background-color: var(--code-bg);
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            border: 1px solid var(--border-color);
        }

        code {
            font-family: 'Fira Code', monospace;
            font-size: 0.9rem;
            color: #d1d5db;
        }

        .badge {
            background: rgba(56, 189, 248, 0.1);
            color: var(--accent-color);
            padding: 0.2rem 0.6rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .endpoint-card {
            animation: fadeIn 0.5s ease forwards;
        }

        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: var(--bg-color);
        }
        ::-webkit-scrollbar-thumb {
            background: #334155;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #475569;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <aside>
            <div class="logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                API Docs
            </div>
            
            <div class="nav-group">
                <div class="nav-title">Introduction</div>
                <a href="#welcome" class="nav-link">Getting Started</a>
                <a href="#auth" class="nav-link">Authentication</a>
            </div>

            <div class="nav-group">
                <div class="nav-title">Auth Endpoints</div>
                <a href="#register" class="nav-link">Register</a>
                <a href="#login" class="nav-link">Login</a>
                <a href="#user" class="nav-link">Get Profile</a>
            </div>

            <div class="nav-group">
                <div class="nav-title">Commerce</div>
                <a href="#packages" class="nav-link">List Packages</a>
                <a href="#checkout" class="nav-link">Create Checkout</a>
            </div>
        </aside>

        <main>
            <div id="welcome" class="section">
                <h1>API Documentation</h1>
                <p>Selamat datang di dokumentasi API Payment Gateway. Gunakan API ini untuk mengintegrasikan layanan pembayaran ke aplikasi Anda.</p>
                
                <div class="endpoint-card">
                    <h3>Base URL</h3>
                    <pre><code>{{ url('/api') }}</code></pre>
                </div>
            </div>

            <div id="auth" class="section">
                <h2>Authentication</h2>
                <p>Beberapa endpoint memerlukan autentikasi menggunakan Bearer Token (Laravel Sanctum). Kirimkan token di header pada setiap request yang dilindungi.</p>
                <div class="endpoint-card">
                    <h3>Header</h3>
                    <pre><code>Authorization: Bearer {your_token_here}
Accept: application/json</code></pre>
                </div>
            </div>

            <div id="register" class="section">
                <div class="endpoint-card">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="url">/register</span>
                    </div>
                    <h3>Register Account</h3>
                    <p>Membuat akun baru beserta detail profilnya.</p>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Type</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>name <span class="required">*</span></td>
                                <td>string</td>
                                <td>Nama lengkap user</td>
                            </tr>
                            <tr>
                                <td>email <span class="required">*</span></td>
                                <td>string</td>
                                <td>Alamat email unik</td>
                            </tr>
                            <tr>
                                <td>password <span class="required">*</span></td>
                                <td>string</td>
                                <td>Min 8 karakter</td>
                            </tr>
                            <tr>
                                <td>password_confirmation <span class="required">*</span></td>
                                <td>string</td>
                                <td>Konfirmasi password</td>
                            </tr>
                            <tr>
                                <td>phone <span class="required">*</span></td>
                                <td>string</td>
                                <td>Nomor telepon (Contoh: 628123...)</td>
                            </tr>
                            <tr>
                                <td>address <span class="required">*</span></td>
                                <td>string</td>
                                <td>Alamat lengkap</td>
                            </tr>
                            <tr>
                                <td>business_name <span class="required">*</span></td>
                                <td>string</td>
                                <td>Nama bisnis/usaha</td>
                            </tr>
                            <tr>
                                <td>business_type <span class="required">*</span></td>
                                <td>string</td>
                                <td>Tipe/bidang bisnis</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Response Example</h3>
                    <pre><code>{
    "success": true,
    "message": "User registered successfully.",
    "data": {
        "user": { ... },
        "access_token": "...",
        "token_type": "Bearer"
    }
}</code></pre>
                </div>
            </div>

            <div id="login" class="section">
                <div class="endpoint-card">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="url">/login</span>
                    </div>
                    <h3>Login</h3>
                    <p>Autentikasi user dan mendapatkan akses token.</p>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Type</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>email <span class="required">*</span></td>
                                <td>string</td>
                                <td>Email terdaftar</td>
                            </tr>
                            <tr>
                                <td>password <span class="required">*</span></td>
                                <td>string</td>
                                <td>Password user</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="user" class="section">
                <div class="endpoint-card">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/user</span>
                        <span class="badge">Auth Required</span>
                    </div>
                    <h3>Get User Profile</h3>
                    <p>Mengambil data user yang sedang login.</p>
                </div>
            </div>

            <div id="packages" class="section">
                <div class="endpoint-card">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/packages</span>
                        <span class="badge">Auth Required</span>
                    </div>
                    <h3>List Packages</h3>
                    <p>Mengambil semua paket yang aktif beserta harganya.</p>
                </div>
            </div>

            <div id="checkout" class="section">
                <div class="endpoint-card">
                    <div class="endpoint-header">
                        <span class="method post">POST</span>
                        <span class="url">/checkout</span>
                        <span class="badge">Auth Required</span>
                    </div>
                    <h3>Create Checkout</h3>
                    <p>Membuat invoice pembayaran via Xendit.</p>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Type</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>package_price_id <span class="required">*</span></td>
                                <td>integer</td>
                                <td>ID dari harga paket yang dipilih</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Response Example</h3>
                    <pre><code>{
    "status": "success",
    "message": "Invoice berhasil dibuat",
    "data": {
        "checkout_url": "https://checkout.xendit.co/web/..."
    }
}</code></pre>
                </div>
            </div>

            <footer style="margin-top: 5rem; padding-bottom: 3rem; text-align: center; color: var(--text-secondary); font-size: 0.8rem;">
                &copy; {{ date('Y') }} Services Payment Gateway. Built with Laravel.
            </footer>
        </main>
    </div>

    <script>
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>
