<!doctype html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Desa Kepunduhan - Layanan Pengaduan Warga (Kec. Kramat, Kab. Tegal)</title>
    <meta name="description" content="Portal resmi pengaduan dan aspirasi warga Desa Kepunduhan, Kec. Kramat, Kab. Tegal 52181 untuk perbaikan fasilitas umum, infrastruktur, dan keterbukaan publik." />
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Google Fonts & Material Symbols -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,400;0,600;0,700;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/pengguna.tsx'])
</head>
<body class="bg-[#f7f9ff] text-[#121d26] antialiased selection:bg-[#baebd0] selection:text-[#3f6b57]">
    <div id="root"></div>

    <script id="server-data" type="application/json">
        {
            "initialReports": @json($initialReports),
            "stats": @json($stats),
            "contacts": @json($contacts)
        }
    </script>
</body>
</html>
