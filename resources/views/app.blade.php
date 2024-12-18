<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="light">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
    <style>
        @font-face {
            font-family: "Inter";
            font-style: normal;
            font-weight: 400;
            src: url('{{ asset('assets/fonts/inter/static/Inter_24pt-Regular.ttf') }}') format("truetype");
        }

        @font-face {
            font-family: "Inter ExtraBold";
            font-style: normal;
            font-weight: 400;
            src: url('{{ asset('assets/fonts/inter/static/Inter_24pt-ExtraBold.ttf') }}') format("truetype");
        }

        @font-face {
            font-family: "Poppins";
            font-style: normal;
            font-weight: 400;
            src: url('{{ asset('assets/fonts/poppins/Poppins-Regular.ttf') }}') format("truetype");
        }

        @font-face {
            font-family: "Poppins ExtraBold";
            font-style: normal;
            font-weight: 400;
            src: url('{{ asset('assets/fonts/poppins/Poppins-ExtraBold.ttf') }}') format("truetype");
        }

        body {
            font-family: "Poppins", sans-serif;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p,
        span,
        div {
            font-family: "Poppins", sans-serif !important;
        }

        h1 {
            font-family: "Poppins ExtraBold", serif !important;
        }
    </style>
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
