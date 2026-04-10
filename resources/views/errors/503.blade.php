<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Sistem Sedang Pemeliharaan - KalaStudio</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">

    <style>
        :root {
            --primary: #923D3D;
            --primary-light: #F8EDED;
            --text-dark: #2D3436;
            --text-muted: #636E72;
            --bg: #FFFFFF;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --bg: #0F172A;
                --text-dark: #F8FAFC;
                --text-muted: #94A3B8;
                --primary-light: #1E293B;
            }
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg);
            color: var(--text-dark);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            transition: background-color 0.3s ease;
        }

        .container {
            text-align: center;
            padding: 2rem;
            max-width: 600px;
            width: 100%;
            animation: fadeIn 0.8s ease-out;
        }

        .illustration-wrapper {
            margin-bottom: 2.5rem;
            position: relative;
        }

        .illustration {
            width: 100%;
            max-width: 400px;
            height: auto;
            filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.1));
            animation: float 6s ease-in-out infinite;
        }

        h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            letter-spacing: -0.025em;
            color: var(--text-dark);
        }

        p {
            font-size: 1.125rem;
            line-height: 1.6;
            color: var(--text-muted);
            margin-bottom: 2.5rem;
        }

        .actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.875rem 2rem;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 12px;
            text-decoration: none;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            border: none;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary) 0%, #B24F4F 100%);
            color: white;
            box-shadow: 0 10px 15px -3px rgba(146, 61, 61, 0.3);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 25px -5px rgba(146, 61, 61, 0.4);
            filter: brightness(110%);
        }

        .btn-secondary {
            background-color: var(--primary-light);
            color: var(--primary);
        }

        .btn-secondary:hover {
            background-color: var(--primary);
            color: white;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
        }

        .logo {
            margin-bottom: 2rem;
            height: 32px;
            opacity: 0.8;
        }

        .badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            background-color: var(--primary-light);
            color: var(--primary);
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Logo Text Fallback or Image if exists -->
        <div class="logo">
           <span style="font-weight: 800; font-size: 1.5rem; letter-spacing: -1px; color: var(--primary)">KALA<span style="color: var(--text-dark)">STUDIO</span></span>
        </div>

        <div class="badge">Pemeliharaan Sistem</div>

        <div class="illustration-wrapper">
            <img src="{{ asset('img/maintenance.png') }}" alt="Maintenance Illustration" class="illustration">
        </div>

        <h1>Sedang Beristirahat Sejenak</h1>
        <p>
            Kami sedang melakukan peningkatan sistem untuk memberikan pengalaman terbaik dalam mengelola keuangan bisnis Anda. Mohon tunggu sebentar, kami akan segera kembali.
        </p>

        <div class="actions">
            <a href="/" class="btn btn-primary">Coba Lagi</a>
            <a href="mailto:support@kalastudio.id" class="btn btn-secondary">Hubungi Support</a>
        </div>
    </div>
</body>

</html>
