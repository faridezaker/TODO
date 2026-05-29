<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=playfair-display:400,700,900i&family=dm-sans:300,400,500,600" rel="stylesheet" />

    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @endif

    <style>
        /* ── Custom Properties ── */
        :root {
            --clr-bg: #07050f;
            --clr-surface: rgba(255,255,255,0.045);
            --clr-border: rgba(255,255,255,0.11);
            --clr-text: #eeeaf8;
            --clr-muted: rgba(238,234,248,0.55);
            --clr-card: rgba(255,255,255,0.04);
            --clr-a1: #6d28d9;
            --clr-a2: #a855f7;
            --clr-a3: #ec4899;
            --clr-a4: #0ea5e9;
            --clr-a5: #14b8a6;
            --nav-bg: rgba(7,5,15,0.65);
        }

        @media (prefers-color-scheme: light) {
            :root {
                --clr-bg: #f0ebff;
                --clr-surface: rgba(0,0,0,0.04);
                --clr-border: rgba(0,0,0,0.1);
                --clr-text: #160d30;
                --clr-muted: rgba(22,13,48,0.58);
                --clr-card: rgba(255,255,255,0.72);
                --nav-bg: rgba(240,235,255,0.78);
            }
        }

        /* ── Aurora keyframes ── */
        @keyframes drift-a {
            0%,100% { transform: translate(0,0) scale(1); }
            30%      { transform: translate(9%,-13%) scale(1.18); }
            65%      { transform: translate(-7%,9%) scale(0.88); }
        }
        @keyframes drift-b {
            0%,100% { transform: translate(0,0) scale(1); }
            25%      { transform: translate(-11%,7%) scale(1.22); }
            72%      { transform: translate(13%,-9%) scale(0.84); }
        }
        @keyframes drift-c {
            0%,100% { transform: translate(0,0) scale(1); }
            42%      { transform: translate(7%,11%) scale(1.12); }
            78%      { transform: translate(-9%,-7%) scale(1.06); }
        }
        @keyframes drift-d {
            0%,100% { transform: translate(0,0) scale(1); }
            50%      { transform: translate(-6%,-11%) scale(1.28); }
        }

        /* ── Float ── */
        @keyframes float {
            0%,100% { transform: translateY(0) rotate(0deg); }
            35%      { transform: translateY(-20px) rotate(1.2deg); }
            68%      { transform: translateY(-9px) rotate(-0.6deg); }
        }

        /* ── Shimmer ── */
        @keyframes shimmer {
            from { background-position: -220% center; }
            to   { background-position:  220% center; }
        }

        /* ── Entrance ── */
        @keyframes fade-up {
            from { opacity:0; transform: translateY(26px); }
            to   { opacity:1; transform: translateY(0); }
        }
        @keyframes nav-drop {
            from { opacity:0; transform: translateY(-18px); }
            to   { opacity:1; transform: translateY(0); }
        }

        /* ── Pulse ring ── */
        @keyframes pulse-ring {
            0%  { transform: scale(0.75); opacity: 0.7; }
            100%{ transform: scale(2.1);  opacity: 0; }
        }

        /* ── Gradient border shimmer ── */
        @keyframes border-spin {
            to { --border-angle: 360deg; }
        }

        /* ─────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        body {
            font-family: 'DM Sans', sans-serif;
            background: var(--clr-bg);
            color: var(--clr-text);
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* ── Aurora canvas ── */
        .aurora {
            position: fixed;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            overflow: hidden;
        }

        .blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(90px);
            mix-blend-mode: screen;
        }
        @media (prefers-color-scheme: light) {
            .blob { mix-blend-mode: multiply; }
        }

        .blob-1 {
            width: min(65vw,720px); height: min(65vw,720px);
            top: -18%; left: -12%;
            opacity: 0.3;
            background: radial-gradient(circle, var(--clr-a1), transparent 70%);
            animation: drift-a 20s ease-in-out infinite;
        }
        .blob-2 {
            width: min(58vw,660px); height: min(58vw,660px);
            top: 18%; right: -16%;
            opacity: 0.28;
            background: radial-gradient(circle, var(--clr-a2), transparent 70%);
            animation: drift-b 24s ease-in-out infinite;
        }
        .blob-3 {
            width: min(48vw,560px); height: min(48vw,560px);
            bottom: -12%; left: 24%;
            opacity: 0.26;
            background: radial-gradient(circle, var(--clr-a3), transparent 70%);
            animation: drift-c 28s ease-in-out infinite;
        }
        .blob-4 {
            width: min(38vw,430px); height: min(38vw,430px);
            top: 38%; left: 38%;
            opacity: 0.22;
            background: radial-gradient(circle, var(--clr-a4), transparent 70%);
            animation: drift-d 22s ease-in-out infinite;
        }
        .blob-5 {
            width: min(42vw,490px); height: min(42vw,490px);
            bottom: 18%; right: 4%;
            opacity: 0.2;
            background: radial-gradient(circle, var(--clr-a5), transparent 70%);
            animation: drift-a 26s ease-in-out infinite reverse;
        }

        /* Dot grid */
        .dot-grid {
            position: fixed;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
            background-size: 36px 36px;
        }
        @media (prefers-color-scheme: light) {
            .dot-grid { background-image: radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px); }
        }

        /* ── Layout wrapper ── */
        .wrap { position: relative; z-index: 1; }

        /* ─────────────────────────── NAV ── */
        .nav {
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 200;
            height: 66px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 2rem;
            background: var(--nav-bg);
            backdrop-filter: blur(22px) saturate(1.6);
            -webkit-backdrop-filter: blur(22px) saturate(1.6);
            border-bottom: 1px solid var(--clr-border);
            animation: nav-drop 0.55s cubic-bezier(.22,1,.36,1) both;
        }

        /* Logo */
        .nav-brand {
            display: flex;
            align-items: center;
            gap: 0.55rem;
            text-decoration: none;
            font-family: 'Playfair Display', serif;
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--clr-text);
            letter-spacing: -0.02em;
            flex-shrink: 0;
        }

        .brand-gem {
            width: 26px; height: 26px;
            border-radius: 7px;
            background: linear-gradient(135deg, #7c3aed, #ec4899);
            display: flex; align-items: center; justify-content: center;
            position: relative;
            flex-shrink: 0;
        }
        .brand-gem::after {
            content: '';
            position: absolute;
            inset: -4px;
            border-radius: 11px;
            background: linear-gradient(135deg, rgba(124,58,237,0.5), rgba(236,72,153,0.4));
            animation: pulse-ring 2.2s ease-out infinite;
        }
        .brand-gem svg { position: relative; z-index: 1; }

        /* Desktop links */
        .nav-links {
            display: none;
            list-style: none;
            align-items: center;
            gap: 0.1rem;
        }
        @media (min-width: 780px) { .nav-links { display: flex; } }

        .nav-links a {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--clr-muted);
            text-decoration: none;
            padding: 0.42rem 0.9rem;
            border-radius: 8px;
            letter-spacing: 0.01em;
            transition: color 0.18s, background 0.18s;
        }
        .nav-links a:hover {
            color: var(--clr-text);
            background: var(--clr-surface);
        }

        /* Auth area */
        .nav-auth {
            display: flex;
            align-items: center;
            gap: 0.55rem;
        }

        /* Hamburger */
        .ham {
            display: flex;
            flex-direction: column;
            gap: 5px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;
        }
        @media (min-width: 780px) { .ham { display: none; } }
        .ham-bar {
            display: block;
            width: 21px; height: 2px;
            background: var(--clr-text);
            border-radius: 2px;
            transition: transform 0.28s, opacity 0.28s;
        }
        .ham.active .ham-bar:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
        .ham.active .ham-bar:nth-child(2) { opacity: 0; }
        .ham.active .ham-bar:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }

        /* Mobile menu */
        .mob-menu {
            position: fixed;
            top: 66px; left: 0; right: 0;
            z-index: 199;
            background: var(--nav-bg);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border-bottom: 1px solid var(--clr-border);
            padding: 0.75rem 2rem 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 0;
            transform: translateY(-108%);
            transition: transform 0.32s cubic-bezier(.4,0,.2,1);
        }
        .mob-menu.open { transform: translateY(0); }

        .mob-menu a {
            font-size: 0.95rem;
            font-weight: 500;
            color: var(--clr-muted);
            text-decoration: none;
            padding: 0.72rem 0;
            border-bottom: 1px solid var(--clr-border);
            transition: color 0.18s;
        }
        .mob-menu a:last-child { border-bottom: none; }
        .mob-menu a:hover { color: var(--clr-text); }

        /* ─────────────────────────── BUTTONS ── */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.45rem;
            font-family: 'DM Sans', sans-serif;
            font-weight: 600;
            text-decoration: none;
            border: none;
            cursor: pointer;
            border-radius: 10px;
            position: relative;
            overflow: hidden;
            transition: transform 0.15s ease, box-shadow 0.2s ease;
            white-space: nowrap;
        }
        .btn:active { transform: scale(0.96) !important; }

        /* Shimmer sweep */
        .btn::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
                108deg,
                transparent 35%,
                rgba(255,255,255,0.28) 50%,
                transparent 65%
            );
            background-size: 220% 100%;
            opacity: 0;
            transition: opacity 0.15s;
        }
        .btn:hover::after {
            opacity: 1;
            animation: shimmer 0.55s ease forwards;
        }

        .btn-sm  { font-size: 0.8rem;    padding: 0.38rem 0.95rem; border-radius: 8px; }
        .btn-md  { font-size: 0.95rem;   padding: 0.65rem 1.4rem; }
        .btn-lg  { font-size: 1.0rem;    padding: 0.85rem 2rem; }

        /* Primary — violet→rose gradient */
        .btn-primary {
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 48%, #ec4899 100%);
            color: #fff;
        }
        .btn-primary:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 36px rgba(168,85,247,0.48);
        }

        /* Ghost */
        .btn-ghost {
            background: var(--clr-surface);
            color: var(--clr-muted);
            border: 1px solid var(--clr-border);
        }
        .btn-ghost:hover {
            color: var(--clr-text);
            transform: translateY(-1px);
            background: rgba(255,255,255,0.09);
        }
        @media (prefers-color-scheme: light) {
            .btn-ghost {
                background: rgba(255,255,255,0.85);
                color: #4a3080;
            }
            .btn-ghost:hover { background: #fff; }
        }

        /* Outline */
        .btn-outline {
            background: transparent;
            color: var(--clr-text);
            border: 1.5px solid var(--clr-border);
        }
        .btn-outline:hover {
            border-color: rgba(168,85,247,0.65);
            color: #c084fc;
            transform: translateY(-2px);
            box-shadow: 0 0 22px rgba(168,85,247,0.18);
        }

        /* ─────────────────────────── HERO ── */
        .hero {
            min-height: 100vh;
            padding: 114px 2rem 5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.13em;
            text-transform: uppercase;
            color: #b197fc;
            background: rgba(177,151,252,0.1);
            border: 1px solid rgba(177,151,252,0.22);
            padding: 0.38rem 1rem;
            border-radius: 100px;
            margin-bottom: 2rem;
            animation: fade-up 0.65s 0.1s ease both;
        }
        .eyebrow-dot {
            width: 6px; height: 6px;
            border-radius: 50%;
            background: #b197fc;
            position: relative;
        }
        .eyebrow-dot::after {
            content: '';
            position: absolute;
            inset: -3px;
            border-radius: 50%;
            background: #b197fc;
            opacity: 0.45;
            animation: pulse-ring 2s ease-out infinite;
        }

        h1.hero-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2.8rem, 8.5vw, 6.2rem);
            font-weight: 900;
            line-height: 1.04;
            letter-spacing: -0.035em;
            color: var(--clr-text);
            margin-bottom: 1.4rem;
            max-width: 780px;
            animation: fade-up 0.65s 0.2s ease both;
        }
        .grad-text {
            background: linear-gradient(130deg, #c084fc 0%, #f472b6 52%, #fb923c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero-sub {
            font-size: clamp(1rem, 2.4vw, 1.2rem);
            line-height: 1.72;
            color: var(--clr-muted);
            max-width: 510px;
            margin-bottom: 2.6rem;
            font-weight: 400;
            animation: fade-up 0.65s 0.3s ease both;
        }

        .hero-ctas {
            display: flex;
            align-items: center;
            gap: 0.9rem;
            flex-wrap: wrap;
            justify-content: center;
            animation: fade-up 0.65s 0.4s ease both;
        }

        /* ── Floating visual ── */
        .hero-visual {
            margin-top: 4.5rem;
            animation: fade-up 0.85s 0.52s ease both;
            position: relative;
            display: inline-block;
        }

        .visual-glow {
            position: absolute;
            inset: -40px;
            background: radial-gradient(ellipse, rgba(168,85,247,0.22), transparent 68%);
            border-radius: 50%;
            pointer-events: none;
        }

        .glass-card {
            background: var(--clr-card);
            border: 1px solid var(--clr-border);
            border-radius: 22px;
            padding: 2.2rem 2.5rem;
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            position: relative;
            overflow: hidden;
        }
        /* Inner gradient border ring */
        .glass-card::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 22px;
            padding: 1px;
            background: linear-gradient(135deg, rgba(168,85,247,0.45), rgba(236,72,153,0.25), transparent 60%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
        }

        .float-wrap { animation: float 7.5s ease-in-out infinite; }

        .laravel-svg {
            width: min(88vw, 390px);
            color: #F53003;
            display: block;
        }
        @media (prefers-color-scheme: dark) {
            .laravel-svg { color: #F61500; }
        }

        /* ─────────────────────────── FEATURES ── */
        .features {
            padding: 6rem 2rem 5rem;
            max-width: 1080px;
            margin: 0 auto;
        }

        .sec-label {
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #b197fc;
            text-align: center;
            margin-bottom: 0.7rem;
        }
        .sec-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.8rem, 4vw, 2.9rem);
            font-weight: 700;
            text-align: center;
            color: var(--clr-text);
            letter-spacing: -0.025em;
            margin-bottom: 0.9rem;
        }
        .sec-desc {
            text-align: center;
            color: var(--clr-muted);
            font-size: 1.05rem;
            max-width: 480px;
            margin: 0 auto 3.5rem;
            line-height: 1.72;
        }

        .cards {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.2rem;
        }
        @media (min-width: 600px) { .cards { grid-template-columns: repeat(2,1fr); } }
        @media (min-width: 900px) { .cards { grid-template-columns: repeat(3,1fr); } }

        .feat-card {
            background: var(--clr-card);
            border: 1px solid var(--clr-border);
            border-radius: 18px;
            padding: 1.8rem;
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            position: relative;
            overflow: hidden;
            transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
        }
        @media (prefers-color-scheme: light) {
            .feat-card { background: rgba(255,255,255,0.7); }
        }
        .feat-card::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 18px;
            background: linear-gradient(135deg, rgba(168,85,247,0.07), rgba(236,72,153,0.04));
            opacity: 0;
            transition: opacity 0.28s;
        }
        .feat-card:hover {
            transform: translateY(-7px);
            border-color: rgba(168,85,247,0.32);
            box-shadow: 0 22px 64px rgba(0,0,0,0.3), 0 0 0 1px rgba(168,85,247,0.2);
        }
        @media (prefers-color-scheme: light) {
            .feat-card:hover {
                box-shadow: 0 14px 50px rgba(124,58,237,0.14), 0 0 0 1px rgba(168,85,247,0.28);
            }
        }
        .feat-card:hover::after { opacity: 1; }

        .card-icon {
            width: 46px; height: 46px;
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.35rem;
            margin-bottom: 1.2rem;
            position: relative; z-index: 1;
        }
        .ico-v { background: rgba(124,58,237,0.14); border: 1px solid rgba(124,58,237,0.2); }
        .ico-p { background: rgba(236,72,153,0.11); border: 1px solid rgba(236,72,153,0.2); }
        .ico-t { background: rgba(20,184,166,0.11);  border: 1px solid rgba(20,184,166,0.2); }

        .card-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--clr-text);
            margin-bottom: 0.55rem;
            letter-spacing: -0.01em;
            position: relative; z-index: 1;
        }
        .card-body {
            font-size: 0.875rem;
            line-height: 1.68;
            color: var(--clr-muted);
            position: relative; z-index: 1;
        }

        /* ─────────────────────────── FOOTER ── */
        .footer {
            border-top: 1px solid var(--clr-border);
            padding: 2rem;
            text-align: center;
            font-size: 0.8125rem;
            color: var(--clr-muted);
        }
        .footer a { color: #b197fc; text-decoration: none; }
        .footer a:hover { text-decoration: underline; }

        /* ── Scroll reveal ── */
        .reveal {
            opacity: 0;
            transform: translateY(22px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.in { opacity: 1; transform: translateY(0); }
    </style>
</head>
<body>

    {{-- ── Aurora Background ── --}}
    <div class="aurora" aria-hidden="true">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
        <div class="blob blob-4"></div>
        <div class="blob blob-5"></div>
    </div>
    <div class="dot-grid" aria-hidden="true"></div>

    {{-- ── Navigation ── --}}
    <header>
        <nav class="nav" aria-label="Main navigation">
            <a href="/" class="nav-brand">
                <span class="brand-gem">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1L12 4.5V9.5L7 13L2 9.5V4.5L7 1Z" fill="rgba(255,255,255,0.9)"/>
                    </svg>
                </span>
                {{ config('app.name', 'Laravel') }}
            </a>

            <ul class="nav-links" role="list">
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>

            <div class="nav-auth">
                @if (Route::has('login'))
                    @auth
                        <a href="{{ url('/dashboard') }}" class="btn btn-sm btn-ghost">Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" class="btn btn-sm btn-ghost">Log in</a>
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="btn btn-sm btn-primary">Register</a>
                        @endif
                    @endauth
                @endif

                <button class="ham" id="ham" aria-label="Toggle menu" aria-expanded="false" aria-controls="mob-menu">
                    <span class="ham-bar"></span>
                    <span class="ham-bar"></span>
                    <span class="ham-bar"></span>
                </button>
            </div>
        </nav>

        {{-- Mobile menu --}}
        <div class="mob-menu" id="mob-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            @if (Route::has('login'))
                @auth
                    <a href="{{ url('/dashboard') }}">Dashboard</a>
                @else
                    <a href="{{ route('login') }}">Log in</a>
                    @if (Route::has('register'))
                        <a href="{{ route('register') }}">Register</a>
                    @endif
                @endauth
            @endif
        </div>
    </header>

    {{-- ── Page Content ── --}}
    <div class="wrap">

        {{-- Hero --}}
        <section class="hero" id="home">
            <span class="eyebrow">
                <span class="eyebrow-dot"></span>
                Laravel 12 · Crafted for Artisans
            </span>

            <h1 class="hero-title">
                Build Something<br>
                <span class="grad-text">Extraordinary</span>
            </h1>

            <p class="hero-sub">
                Laravel gives you the expressive power to craft beautiful applications with an elegant syntax and an ecosystem designed for modern developers.
            </p>

            <div class="hero-ctas">
                <a href="https://laravel.com/docs" target="_blank" rel="noopener" class="btn btn-lg btn-primary">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    Read the Docs
                </a>
                <a href="https://laracasts.com" target="_blank" rel="noopener" class="btn btn-lg btn-outline">
                    Watch Laracasts
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
                <a href="https://cloud.laravel.com" target="_blank" rel="noopener" class="btn btn-lg btn-ghost">
                    Deploy Now ↗
                </a>
            </div>

            {{-- Laravel logo visual with float animation --}}
            <div class="hero-visual">
                <div class="visual-glow" aria-hidden="true"></div>
                <div class="glass-card">
                    <div class="float-wrap">
                        <svg class="laravel-svg" viewBox="0 0 438 104" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Laravel">
                            <path d="M17.2036 -3H0V102.197H49.5189V86.7187H17.2036V-3Z" fill="currentColor" />
                            <path d="M110.256 41.6337C108.061 38.1275 104.945 35.3731 100.905 33.3681C96.8667 31.3647 92.8016 30.3618 88.7131 30.3618C83.4247 30.3618 78.5885 31.3389 74.201 33.2923C69.8111 35.2456 66.0474 37.928 62.9059 41.3333C59.7643 44.7401 57.3198 48.6726 55.5754 53.1293C53.8287 57.589 52.9572 62.274 52.9572 67.1813C52.9572 72.1925 53.8287 76.8995 55.5754 81.3069C57.3191 85.7173 59.7636 89.6241 62.9059 93.0293C66.0474 96.4361 69.8119 99.1155 74.201 101.069C78.5885 103.022 83.4247 103.999 88.7131 103.999C92.8016 103.999 96.8667 102.997 100.905 100.994C104.945 98.9911 108.061 96.2359 110.256 92.7282V102.195H126.563V32.1642H110.256V41.6337ZM108.76 75.7472C107.762 78.4531 106.366 80.8078 104.572 82.8112C102.776 84.8161 100.606 86.4183 98.0637 87.6206C95.5202 88.823 92.7004 89.4238 89.6103 89.4238C86.5178 89.4238 83.7252 88.823 81.2324 87.6206C78.7388 86.4183 76.5949 84.8161 74.7998 82.8112C73.004 80.8078 71.6319 78.4531 70.6856 75.7472C69.7356 73.0421 69.2644 70.1868 69.2644 67.1821C69.2644 64.1758 69.7356 61.3205 70.6856 58.6154C71.6319 55.9102 73.004 53.5571 74.7998 51.5522C76.5949 49.5495 78.738 47.9451 81.2324 46.7427C83.7252 45.5404 86.5178 44.9396 89.6103 44.9396C92.7012 44.9396 95.5202 45.5404 98.0637 46.7427C100.606 47.9451 102.776 49.5487 104.572 51.5522C106.367 53.5571 107.762 55.9102 108.76 58.6154C109.756 61.3205 110.256 64.1758 110.256 67.1821C110.256 70.1868 109.756 73.0421 108.76 75.7472Z" fill="currentColor" />
                            <path d="M242.805 41.6337C240.611 38.1275 237.494 35.3731 233.455 33.3681C229.416 31.3647 225.351 30.3618 221.262 30.3618C215.974 30.3618 211.138 31.3389 206.75 33.2923C202.36 35.2456 198.597 37.928 195.455 41.3333C192.314 44.7401 189.869 48.6726 188.125 53.1293C186.378 57.589 185.507 62.274 185.507 67.1813C185.507 72.1925 186.378 76.8995 188.125 81.3069C189.868 85.7173 192.313 89.6241 195.455 93.0293C198.597 96.4361 202.361 99.1155 206.75 101.069C211.138 103.022 215.974 103.999 221.262 103.999C225.351 103.999 229.416 102.997 233.455 100.994C237.494 98.9911 240.611 96.2359 242.805 92.7282V102.195H259.112V32.1642H242.805V41.6337ZM241.31 75.7472C240.312 78.4531 238.916 80.8078 237.122 82.8112C235.326 84.8161 233.156 86.4183 230.614 87.6206C228.07 88.823 225.251 89.4238 222.16 89.4238C219.068 89.4238 216.275 88.823 213.782 87.6206C211.289 86.4183 209.145 84.8161 207.35 82.8112C205.554 80.8078 204.182 78.4531 203.236 75.7472C202.286 73.0421 201.814 70.1868 201.814 67.1821C201.814 64.1758 202.286 61.3205 203.236 58.6154C204.182 55.9102 205.554 53.5571 207.35 51.5522C209.145 49.5495 211.288 47.9451 213.782 46.7427C216.275 45.5404 219.068 44.9396 222.16 44.9396C225.251 44.9396 228.07 45.5404 230.614 46.7427C233.156 47.9451 235.326 49.5487 237.122 51.5522C238.917 53.5571 240.312 55.9102 241.31 58.6154C242.306 61.3205 242.806 64.1758 242.806 67.1821C242.805 70.1868 242.305 73.0421 241.31 75.7472Z" fill="currentColor" />
                            <path d="M438 -3H421.694V102.197H438V-3Z" fill="currentColor" />
                            <path d="M139.43 102.197H155.735V48.2834H183.712V32.1665H139.43V102.197Z" fill="currentColor" />
                            <path d="M324.49 32.1665L303.995 85.794L283.498 32.1665H266.983L293.748 102.197H314.242L341.006 32.1665H324.49Z" fill="currentColor" />
                            <path d="M376.571 30.3656C356.603 30.3656 340.797 46.8497 340.797 67.1828C340.797 89.6597 356.094 104 378.661 104C391.29 104 399.354 99.1488 409.206 88.5848L398.189 80.0226C398.183 80.031 389.874 90.9895 377.468 90.9895C363.048 90.9895 356.977 79.3111 356.977 73.269H411.075C413.917 50.1328 398.775 30.3656 376.571 30.3656ZM357.02 61.0967C357.145 59.7487 359.023 43.3761 376.442 43.3761C393.861 43.3761 395.978 59.7464 396.099 61.0967H357.02Z" fill="currentColor" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>

        {{-- Features --}}
        <section class="features" id="features" aria-labelledby="feat-title">
            <p class="sec-label reveal">Why Laravel?</p>
            <h2 class="sec-title reveal" id="feat-title">Everything you need to build</h2>
            <p class="sec-desc reveal">A complete ecosystem with routing, caching, queues, testing, and more — all elegantly designed to work together out of the box.</p>

            <div class="cards">
                <article class="feat-card reveal">
                    <div class="card-icon ico-v" aria-hidden="true">⚡</div>
                    <h3 class="card-title">Blazing Fast</h3>
                    <p class="card-body">Octane-powered applications with FrankenPHP and Swoole deliver unprecedented throughput with minimal configuration overhead.</p>
                </article>

                <article class="feat-card reveal">
                    <div class="card-icon ico-p" aria-hidden="true">🎨</div>
                    <h3 class="card-title">Elegant Syntax</h3>
                    <p class="card-body">Expressive, beautiful code that reads like poetry. Laravel's API is thoughtfully crafted to bring joy to every keystroke.</p>
                </article>

                <article class="feat-card reveal">
                    <div class="card-icon ico-t" aria-hidden="true">🛡️</div>
                    <h3 class="card-title">Secure by Default</h3>
                    <p class="card-body">Built-in CSRF protection, password hashing, SQL injection prevention, and XSS filtering guard your application from day one.</p>
                </article>
            </div>
        </section>

        {{-- Footer --}}
        <footer class="footer" id="contact">
            <p>Built with <span style="color:#ec4899" aria-label="love">♥</span> using <strong style="color:var(--clr-text)">Laravel</strong> &middot; <a href="https://laravel.com" target="_blank" rel="noopener">laravel.com</a></p>
        </footer>
    </div>

    <script>
        // ── Hamburger toggle ──
        const ham = document.getElementById('ham');
        const mobMenu = document.getElementById('mob-menu');

        ham.addEventListener('click', () => {
            const open = ham.classList.toggle('active');
            mobMenu.classList.toggle('open', open);
            ham.setAttribute('aria-expanded', open);
        });

        // Close mobile menu on link click
        mobMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                ham.classList.remove('active');
                mobMenu.classList.remove('open');
                ham.setAttribute('aria-expanded', 'false');
            });
        });

        // ── Scroll reveal ──
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('in'), i * 90);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    </script>
</body>
</html>
