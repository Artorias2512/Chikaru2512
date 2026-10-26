import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
    throw new Error("App element not found.");
}

const rainCount = 140;

app.innerHTML = `
    <div class="world">

        <div class="visitor-counter">
            <span class="visitor-label">VISITORS</span>
            <span class="visitor-separator">:</span>

            <div
                class="counterapi"
                ns="chikaru2512.com"
                action="view"
                key="visits">
            </div>
        </div>

        <div class="rain"></div>

        <main class="container">

            <div class="status">
                <img
                    class="status-icon"
                    src="/icons/zhongli.gif"
                    alt="">
            </div>

            <h1 class="mainname">
                Chikaru2512
            </h1>

            <p class="intro">
                Hello mấy con gà
            </p>

            <div class="music-player">

                <div class="music-header">

                    <div class="music-icon">
                        🎵
                    </div>

                    <div>

                        <div class="music-label">
                            FAVOURITE SONG
                        </div>

                        <div class="music-title">
                            her — JVKE
                        </div>

                    </div>

                </div>

                <iframe
                    src="https://open.spotify.com/embed/track/6G9YlbU3ByPJQvOFDRdwyM"
                    width="100%"
                    height="152"
                    frameborder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy">
                </iframe>

            </div>

            <div class="socials">

                <a
                    class="social-icon discord"
                    href="https://discord.gg/6rhrErDAvs"
                    aria-label="Discord">

                    <svg viewBox="0 0 24 24">
                        <path d="M19.54 5.12A16.88 16.88 0 0 0 15.4 3.85l-.5 1.02a15.4 15.4 0 0 0-5.8 0l-.5-1.02a16.88 16.88 0 0 0-4.14 1.27C1.84 8.93 1.13 12.64 1.49 16.3a16.84 16.84 0 0 0 5.08 2.57l1.23-1.67c-.68-.25-1.33-.57-1.94-.94l.48-.37c3.74 1.74 7.8 1.74 11.49 0l.48.37c-.61.37-1.26.69-1.94.94l1.23 1.67a16.84 16.84 0 0 0 5.08-2.57c.42-4.24-.72-7.91-3.64-11.18ZM8.62 14.3c-1.1 0-2-.99-2-2.21s.88-2.21 2-2.21 2 .99 2 2.21-.9 2.21-2 2.21Zm6.76 0c-1.1 0-2-.99-2-2.21s.88-2.21 2-2.21 2 .99 2 2.21-.9 2.21-2 2.21Z"/>
                    </svg>

                </a>

                <a
                    class="social-icon spotify"
                    href="https://open.spotify.com/user/31evxxgquyqkropmxqx36mubib4a?si=fe1fb5dda37c4b85"
                    aria-label="Spotify">

                    <svg viewBox="0 0 24 24">
                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.59 14.42a.74.74 0 0 1-1.02.25c-2.8-1.71-6.33-2.1-10.49-1.15a.74.74 0 1 1-.33-1.44c4.55-1.04 8.45-.56 11.59 1.36.35.22.46.68.25 1.03Zm1.37-3.05a.93.93 0 0 1-1.28.31c-3.2-1.97-8.08-2.54-11.86-1.39a.93.93 0 1 1-.54-1.78c4.33-1.31 9.72-.67 13.37 1.57.44.27.58.85.31 1.29Zm.12-3.18C14.24 8 8.05 7.78 4.47 8.87a1.11 1.11 0 1 1-.65-2.12c4.11-1.25 10.95-1 15.12 1.48a1.11 1.11 0 0 1-.86 1.96Z"/>
                    </svg>

                </a>

                <a
                    class="social-icon facebook"
                    href="https://www.facebook.com/pduy.2512?locale=vi_VN"
                    aria-label="Facebook">

                    <svg viewBox="0 0 24 24">
                        <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.08c0-.87.24-1.46 1.5-1.46h1.6V3.94c-.28-.04-1.25-.12-2.38-.12-2.36 0-3.98 1.44-3.98 4.08V10H7.55v3h2.69v8h3.26Z"/>
                    </svg>

                </a>

            </div>

            <div class="app">

                <div
                    class="app-icon"
                    id="app-icon">
                    ◆
                </div>

                <div class="app-info">

                    <div
                        class="app-title"
                        id="app-title">
                        Waiting...
                    </div>

                    <div
                        class="app-status"
                        id="app-status">
                        ACTIVE
                    </div>

                </div>

            </div>

        </main>

    </div>
`;

const rain =
    document.querySelector<HTMLDivElement>(".rain");

if (rain) {

    for (let i = 0; i < rainCount; i++) {

        const drop =
            document.createElement("span");

        drop.className =
            "rain-drop";

        drop.style.left =
            `${Math.random() * 100}%`;

        drop.style.animationDuration =
            `${0.5 + Math.random() * 0.6}s`;

        drop.style.animationDelay =
            `${Math.random() * -2}s`;

        drop.style.opacity =
            `${0.15 + Math.random() * 0.5}`;

        rain.appendChild(drop);
    }
}

async function updateActiveApplication() {

    try {

        const response =
            await fetch(
                "https://chikaru2512.vercel.app/api/status",
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {

            throw new Error(
                "Tracker offline"
            );
        }

        const data =
            await response.json();

        const appTitle =
            document.querySelector<HTMLDivElement>(
                "#app-title"
            );

        const appIcon =
            document.querySelector<HTMLDivElement>(
                "#app-icon"
            );

        const appStatus =
            document.querySelector<HTMLDivElement>(
                "#app-status"
            );

        if (
            !appTitle ||
            !appIcon ||
            !appStatus
        ) {

            return;
        }

        const appName =
            String(
                data.app || ""
            ).toLowerCase();

        /*
         * =========================
         * SPOTIFY
         * =========================
         */

        if (
            data.spotify === true &&
            data.title
        ) {

            appIcon.textContent =
                "♪";

            appTitle.textContent =
                data.title;

            appStatus.textContent =
                data.artist ||
                "Spotify";

            return;
        }

        /*
         * =========================
         * NORMAL APPLICATION
         * =========================
         */

        let displayName =
            data.app ||
            "Unknown";

        if (
            appName.includes("chrome")
        ) {

            displayName =
                "Google Chrome";

        } else if (
            appName.includes("discord")
        ) {

            displayName =
                "Discord";

        } else if (
            appName.includes("spotify")
        ) {

            displayName =
                "Spotify";

        } else if (
            appName.includes("minecraft")
        ) {

            displayName =
                "Minecraft";

        } else if (
            appName.includes("code")
        ) {

            displayName =
                "Visual Studio Code";
        }

        appIcon.textContent =
            "◆";

        appTitle.textContent =
            displayName;

        appStatus.textContent =
            "ACTIVE";

    } catch (error) {

        const appTitle =
            document.querySelector<HTMLDivElement>(
                "#app-title"
            );

        const appIcon =
            document.querySelector<HTMLDivElement>(
                "#app-icon"
            );

        const appStatus =
            document.querySelector<HTMLDivElement>(
                "#app-status"
            );

        if (
            !appTitle ||
            !appIcon ||
            !appStatus
        ) {

            return;
        }

        appIcon.textContent =
            "○";

        appTitle.textContent =
            "Tracker Offline";

        appStatus.textContent =
            "Start tracker.py to activate";
    }
}

updateActiveApplication();

setInterval(
    updateActiveApplication,
    5000
);