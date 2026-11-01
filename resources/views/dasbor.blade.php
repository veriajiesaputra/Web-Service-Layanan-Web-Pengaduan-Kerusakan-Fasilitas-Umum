<!doctype html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Desa Kepunduhan - Dasbor Operasional Desa (Kec. Kramat, Kab. Tegal)</title>
    <meta name="description" content="Sistem Dasbor Operasional dan Layanan Pengaduan Warga Terpadu Desa Kepunduhan, Kec. Kramat, Kab. Tegal 52181 untuk pengelolaan fasilitas umum dan tindak lanjut laporan." />
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Google Fonts & Material Symbols -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,400..700;1,400..700&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/dasbor.tsx'])
</head>
<body class="bg-slate-100 text-slate-800 antialiased min-h-screen selection:bg-emerald-200 selection:text-emerald-950">
    <div id="root" class="min-h-screen"></div>

    <script id="server-data" type="application/json">
        {
            "initialReports": @json($initialReports),
            "teams": @json($teams),
            "notes": @json($notes),
            "stats": @json($stats)
        }
    </script>
</body>
</html>
