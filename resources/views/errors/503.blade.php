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
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow-x: hidden;
            overflow-y: auto;
            transition: background-color 0.3s ease;
            padding: 2rem 1rem;
        }

        .container {
            text-align: center;
            max-width: 600px;
            width: 100%;
            animation: fadeIn 0.8s ease-out;
            margin: auto;
        }

        .illustration-wrapper {
            margin-bottom: 3rem;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .icon-container {
            width: 160px;
            height: 160px;
            background: linear-gradient(135deg, var(--primary-light) 0%, #FFFFFF 100%);
            border-radius: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 
                0 20px 40px -10px rgba(146, 61, 61, 0.15),
                inset 0 0 0 2px rgba(146, 61, 61, 0.05);
            animation: float 6s ease-in-out infinite;
            color: var(--primary);
        }

        .icon-container svg {
            width: 80px;
            height: 80px;
            filter: drop-shadow(0 10px 15px rgba(146, 61, 61, 0.2));
        }

        .icon-decoration {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 40px;
            border: 2px dashed rgba(146, 61, 61, 0.2);
            animation: rotate 20s linear infinite;
            z-index: -1;
            scale: 1.2;
        }

        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            letter-spacing: -0.025em;
            color: var(--text-dark);
            line-height: 1.2;
        }

        p {
            font-size: 1.125rem;
            line-height: 1.6;
            color: var(--text-muted);
            margin-bottom: 2.5rem;
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
        }

        .actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
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
            width: auto;
            min-width: 180px;
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
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }

        .logo {
            margin-bottom: 2.5rem;
            height: 32px;
            opacity: 0.9;
        }

        .badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            background-color: var(--primary-light);
            color: var(--primary);
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 700;
            margin-bottom: 2rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        /* Responsive Breakpoints */
        @media (max-width: 640px) {
            h1 {
                font-size: 1.875rem;
            }
            
            p {
                font-size: 1rem;
            }

            .icon-container {
                width: 120px;
                height: 120px;
                border-radius: 30px;
            }

            .icon-container svg {
                width: 60px;
                height: 60px;
            }

            .actions {
                flex-direction: column;
                align-items: stretch;
                padding: 0 1rem;
            }

            .btn {
                width: 100%;
            }
        }

        @media (max-height: 700px) and (min-width: 641px) {
            body {
                padding: 4rem 2rem;
            }
            
            .icon-container {
                width: 120px;
                height: 120px;
            }
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
            <div class="icon-container">
                <div class="icon-decoration"></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"/>
                </svg>
            </div>
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
