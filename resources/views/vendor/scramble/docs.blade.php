<!doctype html>
<html lang="id" data-theme="{{ $config->renderer()->get('theme', 'light') }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="color-scheme" content="{{ $config->renderer()->get('theme', 'light') }}">
    <title>{{ $config->get('ui.title') ?? 'Portal Desa Kepunduhan - API Docs' }}</title>

    <!-- Google Fonts Portal Desa Kepunduhan -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,400;0,600;0,700;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&display=swap" rel="stylesheet" />

    <script src="https://unpkg.com/@stoplight/elements@8.4.2/web-components.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements@8.4.2/styles.min.css">

    @include('scramble::dev-tools', ['renderer' => 'elements'])

    <script>
        const originalFetch = window.fetch;

        // intercept TryIt requests and add the XSRF-TOKEN header
        window.fetch = (url, options) => {
            const CSRF_TOKEN_COOKIE_KEY = "XSRF-TOKEN";
            const CSRF_TOKEN_HEADER_KEY = "X-XSRF-TOKEN";
            const getCookieValue = (key) => {
                const cookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith(key));
                return cookie?.split("=")[1];
            };

            const updateFetchHeaders = (headers, headerKey, headerValue) => {
                if (headers instanceof Headers) {
                    headers.set(headerKey, headerValue);
                } else if (Array.isArray(headers)) {
                    headers.push([headerKey, headerValue]);
                } else if (headers) {
                    headers[headerKey] = headerValue;
                }
            };
            const csrfToken = getCookieValue(CSRF_TOKEN_COOKIE_KEY);
            if (csrfToken) {
                const { headers = new Headers() } = options || {};
                updateFetchHeaders(headers, CSRF_TOKEN_HEADER_KEY, decodeURIComponent(csrfToken));
                return originalFetch(url, {
                    ...options,
                    headers,
                });
            }

            return originalFetch(url, options);
        };
    </script>

    <style>
        :root {
            /* Tema Resmi Portal Desa Kepunduhan */
            --color-primary: #106947 !important;
            --color-primary-dark: #005235 !important;
            --color-primary-light: #baebd0 !important;
            --color-primary-tint: #ecf4ff !important;
            --color-canvas: #f7f9ff !important;
            --color-canvas-pure: #ffffff !important;
            --color-canvas-tint: #ecf4ff !important;
            --color-sidebar: #ffffff !important;
            --color-text: #121d26 !important;
            --color-text-muted: #3f4942 !important;
            --color-border: #dee9f7 !important;
            --font-heading: 'Bricolage Grotesque', system-ui, sans-serif !important;
            --font-body: 'Atkinson Hyperlegible Next', system-ui, sans-serif !important;
        }

        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: 'Atkinson Hyperlegible Next', system-ui, sans-serif;
            background-color: var(--color-canvas);
            color: var(--color-text);
        }

        /* Top Brand Navigation Bar */
        .kepunduhan-nav-bar {
            height: 58px;
            background: linear-gradient(135deg, #106947 0%, #005235 100%);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
            position: relative;
            z-index: 100;
        }

        .kepunduhan-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: white;
        }

        .kepunduhan-badge-logo {
            width: 36px;
            height: 36px;
            background: #ffffff;
            border-radius: 9px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            color: #106947;
            font-size: 15px;
            font-family: 'Bricolage Grotesque', sans-serif;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        .kepunduhan-title {
            font-family: 'Bricolage Grotesque', sans-serif;
            font-weight: 700;
            font-size: 15px;
            line-height: 1.2;
            letter-spacing: -0.01em;
        }

        .kepunduhan-sub {
            font-size: 11px;
            opacity: 0.9;
            font-weight: 400;
            color: #baebd0;
        }

        .kepunduhan-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .kepunduhan-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 7px;
            font-size: 12.5px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.15s ease-in-out;
        }

        .kepunduhan-btn-glass {
            background: rgba(255, 255, 255, 0.15);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.25);
        }
        .kepunduhan-btn-glass:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
        }

        .kepunduhan-btn-accent {
            background: #baebd0;
            color: #004d30;
            font-weight: 700;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .kepunduhan-btn-accent:hover {
            background: #a3f3c8;
            transform: translateY(-1px);
        }

        /* Scramble Container Height Adjustment */
        .scramble-wrapper {
            height: calc(100vh - 58px);
            overflow: hidden;
        }

        /* Stoplight Elements customization */
        elements-api {
            display: block;
            height: 100%;
            --color-primary: #106947 !important;
            --color-canvas: #f7f9ff !important;
            --color-sidebar: #ffffff !important;
            --color-text: #121d26 !important;
        }
    </style>
</head>
<body>

<!-- Header Navigasi Resmi Portal Desa Kepunduhan -->
<header class="kepunduhan-nav-bar">
    <a href="/" class="kepunduhan-brand">
        <div class="kepunduhan-badge-logo">DK</div>
        <div>
            <div class="kepunduhan-title">Desa Kepunduhan &middot; REST API Docs</div>
            <div class="kepunduhan-sub">Jl. Beringin No. 1, Kec. Kramat, Kab. Tegal 52181 &middot; OpenAPI 3.1.0</div>
        </div>
    </a>
    <div class="kepunduhan-actions">
        <a href="/" class="kepunduhan-btn kepunduhan-btn-glass">
            &larr; Portal Warga
        </a>
        <a href="/admin" class="kepunduhan-btn kepunduhan-btn-glass">
            Dasbor Admin
        </a>
        <a href="/desakepunduhan_api.postman_collection.json" download class="kepunduhan-btn kepunduhan-btn-accent">
            Unduh Postman JSON
        </a>
    </div>
</header>

<div class="scramble-wrapper">
    <elements-api
        id="docs"
        @foreach($config->renderer()->all(except: ['theme']) as $key => $value)
            @continue(! $value)
            {{ $key }}="{{ $value === true ? 'true' : ($value === false ? 'false' : $value) }}"
        @endforeach
    />
</div>

<script>
    (async () => {
        const docs = document.getElementById('docs');
        docs.apiDescriptionDocument = @json($spec);
    })();

    // Injeksi warna tema Portal Desa Kepunduhan ke dalam Shadow DOM Stoplight Elements
    function injectPortalTheme() {
        const docs = document.getElementById('docs');
        if (!docs || !docs.shadowRoot) return;

        if (!docs.shadowRoot.getElementById('portal-kepunduhan-theme')) {
            const style = document.createElement('style');
            style.id = 'portal-kepunduhan-theme';
            style.textContent = `
                :host {
                    --color-primary: #106947 !important;
                    --color-primary-dark: #005235 !important;
                    --color-primary-light: #baebd0 !important;
                    --color-primary-tint: #ecf4ff !important;
                    --color-canvas: #f7f9ff !important;
                    --color-canvas-pure: #ffffff !important;
                    --color-canvas-tint: #ecf4ff !important;
                    --color-sidebar: #ffffff !important;
                    --color-text: #121d26 !important;
                    --color-text-muted: #3f4942 !important;
                    --color-border: #dee9f7 !important;
                    font-family: 'Atkinson Hyperlegible Next', system-ui, sans-serif !important;
                }
                /* Tombol Try It & Aksi */
                button[class*="bg-primary"], .sl-bg-primary {
                    background-color: #106947 !important;
                    color: #ffffff !important;
                    border-radius: 6px !important;
                }
                button[class*="bg-primary"]:hover {
                    background-color: #005235 !important;
                }
                /* Link & Teks Utama */
                [class*="text-primary"], a[class*="text-primary"], .sl-text-primary {
                    color: #106947 !important;
                }
                /* Border fokus & indikator */
                [class*="border-primary"], .sl-border-primary {
                    border-color: #106947 !important;
                }
                /* Sidebar Item Aktif */
                [aria-current="page"], .active {
                    background-color: #baebd0 !important;
                    color: #004d30 !important;
                    font-weight: 700 !important;
                    border-left: 3px solid #106947 !important;
                    border-radius: 4px !important;
                }
                /* Tag / Badge HTTP Methods */
                .sl-badge-post, [data-method="post"] {
                    background-color: #dcfce7 !important;
                    color: #106947 !important;
                    font-weight: 700 !important;
                }
                .sl-badge-get, [data-method="get"] {
                    background-color: #e0f2fe !important;
                    color: #0369a1 !important;
                    font-weight: 700 !important;
                }
                .sl-badge-patch, [data-method="patch"], .sl-badge-put, [data-method="put"] {
                    background-color: #fef3c7 !important;
                    color: #b45309 !important;
                    font-weight: 700 !important;
                }
                .sl-badge-delete, [data-method="delete"] {
                    background-color: #fee2e2 !important;
                    color: #b91c1c !important;
                    font-weight: 700 !important;
                }
                /* Typography Heading */
                h1, h2, h3, h4, .sl-heading {
                    font-family: 'Bricolage Grotesque', system-ui, sans-serif !important;
                    color: #121d26 !important;
                }
            `;
            docs.shadowRoot.appendChild(style);
        }
    }

    // Interval observer untuk memastikan Shadow Root terstyling sempurna
    const themeWatcher = setInterval(() => {
        const docs = document.getElementById('docs');
        if (docs && docs.shadowRoot) {
            injectPortalTheme();
        }
    }, 150);

    // Hentikan observer setelah 8 detik
    setTimeout(() => clearInterval(themeWatcher), 8000);
</script>

</body>
</html>
