# Personal Website – Angular Architecture

> Obsidian-kompatible Architekturdokumentation mit Wikilinks zur Vernetzung.

---

## Inhaltsverzeichnis

- [[#Projektübersicht]]
- [[#Ordnerstruktur]]
- [[#Routing]]
- [[#Komponenten]]
- [[#Services]]
- [[#Datenmodelle]]
- [[#Assets & Styles]]
- [[#Konfiguration]]
- [[#Build & Deployment]]
- [[#Abhängigkeiten]]
- [[#Architekturmuster]]

---

## Projektübersicht

Eine **Angular 17 Single-Page-Application** als persönliche Portfolio-Website. Alle Komponenten sind *standalone* (kein NgModule). Das Routing nutzt Hash-based Navigation (`#/`).

**Tech-Stack**: Angular 17 · TypeScript · Bootstrap 5 · Tailwind CSS · RxJS — **rein Frontend**, alle Daten liegen lokal in `src/assets/json/`.

---

## Ordnerstruktur

```
personal-website-angular-source-code/
├── src/
│   ├── app/                    ← Angular-Anwendung (Komponenten, Services, Routing)
│   │   ├── home/               ← Home-Seite (Unterkomponenten)
│   │   │   ├── navbar/         ← [[#NavbarComponent]]
│   │   │   ├── start/          ← [[#StartComponent]]
│   │   │   ├── timeline/       ← [[#TimelineComponent]]
│   │   │   ├── project-overview/ ← [[#ProjectOverviewComponent]]
│   │   │   ├── aboutme/        ← [[#AboutmeComponent]]
│   │   │   └── home.component  ← [[#HomeComponent]]
│   │   ├── projects/           ← Projektdetail-Seite
│   │   │   ├── header/         ← [[#HeaderComponent]]
│   │   │   └── projects.component ← [[#ProjectsComponent]]
│   │   ├── footer/             ← [[#FooterComponent]]
│   │   ├── app.component       ← [[#AppComponent]] (Root)
│   │   ├── app.routes.ts       ← [[#Routing]]
│   │   ├── app.config.ts       ← [[#Konfiguration]]
│   │   ├── project.service.ts  ← [[#ProjectService]]
│   │   ├── aboutme.service.ts  ← [[#AboutmeService]]
│   │   └── scroll.service.ts   ← [[#ScrollService]]
│   ├── assets/
│   │   ├── img/                ← Projektbilder & Fotos
│   │   ├── json/               ← Statische Datendateien ([[#Datenmodelle]])
│   │   │   ├── projects.json   ← Alle Portfolio-Projekte (lokal)
│   │   │   └── aboutme.json    ← About-Me-Inhalte
│   │   └── animations/         ← Video-Assets
│   ├── styles.css              ← Globale Styles + Custom Animations
│   ├── index.html              ← HTML-Einstiegspunkt
│   └── main.ts                 ← Bootstrap-Einstiegspunkt
├── angular.json                ← Angular CLI Konfiguration
├── tailwind.config.js          ← Tailwind-Konfiguration
├── tsconfig.json               ← TypeScript-Konfiguration
└── package.json                ← NPM Abhängigkeiten & Scripts
```

---

## Routing

**Datei**: [src/app/app.routes.ts](src/app/app.routes.ts)

| Route | Ziel | Beschreibung |
|---|---|---|
| `/` | Redirect → `/home` | Startseite |
| `/home` | [[#HomeComponent]] | Portfolio-Hauptseite |
| `/home/project/:name` | [[#ProjectsComponent]] | Projektdetailseite (`:name` = Projektschlüssel) |

**Besonderheiten**:
- `withHashLocation()` → URLs haben `#/`-Prefix
- `withComponentInputBinding()` → Routenparameter direkt als `@Input()` bindbar

---

## Komponenten

### Komponentenbaum

```
[[#AppComponent]] (Root)
└── RouterOutlet
    ├── [[#HomeComponent]]  (Route: /home)
    │   ├── [[#NavbarComponent]]
    │   ├── [[#StartComponent]]
    │   ├── [[#TimelineComponent]]
    │   ├── [[#ProjectOverviewComponent]]
    │   ├── [[#AboutmeComponent]]
    │   └── [[#FooterComponent]]
    └── [[#ProjectsComponent]]  (Route: /home/project/:name)
        └── [[#HeaderComponent]]
```

---

### AppComponent

**Datei**: [src/app/app.component.ts](src/app/app.component.ts)
**Selector**: `app-root`

- Root-Komponente der Anwendung
- Enthält `<router-outlet>` für die Navigation
- Polling-Logik: prüft alle 1000 ms via [[#ProjectService]], ob Daten geladen sind (`isLoading`-Flag)
- **Imports**: `RouterOutlet`, `CommonModule`

---

### HomeComponent

**Datei**: [src/app/home/home.component.ts](src/app/home/home.component.ts)
**Selector**: `app-home`

- Aggregiert alle Abschnitte der Portfolio-Hauptseite
- Lauscht auf [[#ScrollService]] für Scroll-Ziele
- `scrollToTarget(target)`: Smooth-Scroll zu Sektionen (`home` / `footer` / custom ID)
- **Lifecycle**: `AfterViewInit`
- **Child Components**: [[#NavbarComponent]], [[#StartComponent]], [[#TimelineComponent]], [[#ProjectOverviewComponent]], [[#AboutmeComponent]], [[#FooterComponent]]

---

### NavbarComponent

**Datei**: [src/app/home/navbar/navbar.component.ts](src/app/home/navbar/navbar.component.ts)
**Selector**: `app-navbar`

- Navigationsleiste mit Scroll-Tracking
- `menuOpen`: mobiles Hamburger-Menü
- `scrollProgress` (0–100): Fortschrittsbalken oben in der Navbar
- `activeSection`: erkennt aktiven Abschnitt (footer / projects / timeline / home)
- `@HostListener('window:scroll')`: reagiert auf Scrollen
- Sendet Scroll-Ziele via [[#ScrollService]]

---

### StartComponent

**Datei**: [src/app/home/start/start.component.ts](src/app/home/start/start.component.ts)
**Selector**: `app-start`

- Hero-Sektion mit Typewriter-Effekt
- `typeLoop()`: Tippt "Olivier Chodura" → hält 6 s → löscht 2 s → wiederholt
- Manuelle Change Detection (`cdr.detach()`) für Performance
- **Lifecycle**: `AfterViewInit`, `OnDestroy` (Cleanup des Interval-Timers)
- Social-Media-Links: Instagram, GitHub

---

### TimelineComponent

**Datei**: [src/app/home/timeline/timeline.component.ts](src/app/home/timeline/timeline.component.ts)
**Selector**: `app-timeline`

- Visualisiert den Lernweg als Timeline (2021–2026)
- 7 hardcodierte Einträge (Tags, Beschreibungen, Jahre)
- `checkScroll()`: per `@HostListener('window:scroll')` werden Einträge beim Scrollen eingeblendet
- `revealedItems[]`: trackt, welche Einträge sichtbar sind

**Timeline-Einträge**:

| Jahr | Thema |
|---|---|
| 2021 | Beginn mit Python |
| 2022 | Erste echte Projekte (Food-App, OOP) |
| 2023 | Discord Bot (Architect) |
| 2023 | Portfolio-Entwicklung (Web) |
| 2024 | Full Stack & Server Management |
| 2025 | Cloud & DevOps |
| 2026 | ML & Server Management |

---

### ProjectOverviewComponent

**Datei**: [src/app/home/project-overview/project-overview.component.ts](src/app/home/project-overview/project-overview.component.ts)
**Selector**: `app-project-overview`

- Zeigt alle Portfolio-Projekte als Karten-Grid
- Ruft Daten alle 100 ms via [[#ProjectService]] ab (`requestData()`)
- `IntersectionObserver` für Reveal-Animation beim Scrollen
- Kaskadierendes Stagger: `200ms + i×120ms` Verzögerung pro Karte
- Verlinkung zu [[#ProjectsComponent]] via `/home/project/:name`
- **Lifecycle**: `OnInit`, `AfterViewInit`, `OnDestroy`

---

### ProjectsComponent

**Datei**: [src/app/projects/projects.component.ts](src/app/projects/projects.component.ts)
**Selector**: `app-projects`

- Detailseite für ein einzelnes Projekt
- `@Input() name: string` – empfängt Projektname aus Routenparameter
- Polling alle 200 ms auf [[#ProjectService]] bis Daten verfügbar
- **Sections**: Hauptinfo · Technologien · Team · Highlights · Galerie · Versionshistorie
- **Child Components**: [[#HeaderComponent]]
- **Lifecycle**: `OnInit`, `AfterViewInit`

---

### HeaderComponent

**Datei**: [src/app/projects/header/header.component.ts](src/app/projects/header/header.component.ts)
**Selector**: `app-header`

- Header der Projektdetailseite
- `title`: Name des aktuellen Projekts
- `navigateToHome()`: Navigiert zurück und setzt Scroll-Ziel via [[#ScrollService]]
- **Lifecycle**: `OnInit`

---

### AboutmeComponent

**Datei**: [src/app/home/aboutme/aboutme.component.ts](src/app/home/aboutme/aboutme.component.ts)
**Selector**: `app-aboutme`

- Über-mich-Abschnitt mit Tab-Navigation
- Daten aus [[#AboutmeService]] (3 Tabs: Journey / Experience / Skills)
- `changeText(text)`: wechselt den aktiven Tab
- `IntersectionObserver` für Einblend-Animation
- Staggered Animations: Verzögerungen 150 / 250 / 350 / 450 / 550 ms
- **Lifecycle**: `AfterViewInit`, `OnDestroy`

---

### FooterComponent

**Datei**: [src/app/footer/footer.component.ts](src/app/footer/footer.component.ts)
**Selector**: `app-footer`

- Kontaktbereich & Social Links
- Zeigt `lastTimeUpdated`-Datum aus [[#ProjectService]]
- Links: E-Mail · Instagram · GitHub
- Copyright-Hinweis

---

## Services

### ProjectService

**Datei**: [src/app/project.service.ts](src/app/project.service.ts)
**Scope**: `providedIn: 'root'`

- Zentrale Datenverwaltung für Projektdaten
- Lädt Projekte direkt aus [src/assets/json/projects.json](src/assets/json/projects.json) via `HttpClient`
- Kein Backend, kein Polling — Daten sind nach dem ersten Request vorhanden

| Methode | Beschreibung |
|---|---|
| `loadProjects()` (privat) | Lädt `projects.json` einmalig beim Start |
| `getProjectViews()` | Gibt formatierte Projektkarten zurück |
| `specificProjectData(name)` | Gibt vollständige Projektdaten nach Name zurück |
| `getProjectName()` | Gibt aktuellen Projekttitel zurück |
| `getScrollContent()` / `setScrollContent()` | Scroll-Ziel lesen/setzen |
| `getLastTimeUpdated()` | Gibt `"08. September 2024"` zurück |
| `checkIfDataIsAvailable()` | Boolean-Check ob Daten geladen |

---

### AboutmeService

**Datei**: [src/app/aboutme.service.ts](src/app/aboutme.service.ts)
**Scope**: `providedIn: 'root'`

- Lädt statische Daten aus [src/assets/json/aboutme.json](src/assets/json/aboutme.json)
- `getAboutMe()`: gibt Array von `aboutMe`-Objekten zurück
- **Datenstruktur**: `{ title, description, subTitle, subDescription }`
- 3 Einträge: My Journey · My Experience · Skills I have Learned

---

### ScrollService

**Datei**: [src/app/scroll.service.ts](src/app/scroll.service.ts)
**Scope**: `providedIn: 'root'`

- Kommunikationskanal zwischen [[#NavbarComponent]] und [[#HomeComponent]]
- `BehaviorSubject<string>` + `currentMessage$` Observable
- `changeMessage(message)`: setzt neues Scroll-Ziel
- Verwendung: Navbar sendet → HomeComponent scrollt

---

## Datenmodelle

### Projektdaten

**Datei**: [src/assets/json/project-template.json](src/assets/json/project-template.json)

```
Projekt
├── view
│   ├── project-title
│   ├── project-description
│   ├── project-img
│   ├── subtitle
│   └── project-link (optional)
├── main-information
│   ├── project-name
│   ├── creation-date
│   ├── our-team (optional)
│   ├── project-website (optional)
│   ├── code-repository (optional)
│   ├── bot-invite (optional)
│   ├── total-command-functions
│   └── version-updates
├── technologies-tools
│   ├── technologies: string[]
│   └── tools: string[]
├── highlights
│   ├── challenges-solutions: { challenge, solution }[]
│   └── achievements-milestones
│       ├── achievements: string[]
│       └── milestones: string[]
├── our-team (optional)
│   ├── team-name
│   ├── team-members: { name, role, link? }[]
│   └── discord-server
├── pictures: string[] (optional)
└── version-updates
    └── versions: { version-date, version-topic, version-description }[]
```

**5 Projekte im Portfolio**:

| Projekt | Datum | Typ | Technologien |
|---|---|---|---|
| ArchiTect Discord Bot | Juni 2023 | Team | Python, SQL, Discord API |
| My Portfolio | Dez. 2023 | Solo | Angular, TypeScript, HTML, CSS |
| Python Banking System | Dez. 2023 | Solo | Python, SQL |
| Pay2drink | Jan. 2024 | Team (Praktikum) | Angular, TypeScript |
| Game Team | Apr. 2024 | Team | Angular, TypeScript, Tailwind |

---

### About-Me-Daten

**Datei**: [src/assets/json/aboutme.json](src/assets/json/aboutme.json)

```typescript
{
  title: string,
  description: string,
  subTitle: string,
  subDescription: string
}
```

---

### Timeline-Eintrag

```typescript
{
  year: string,
  title: string,
  description: string,
  tags: string[]
}
```

---

## Assets & Styles

### Verzeichnisstruktur

```
src/assets/
├── img/
│   ├── architect-discord-bot/   ← Projektbilder + Teamfotos
│   ├── banking-system/          ← Projektbilder
│   ├── game-team/               ← Projektbilder + Teamfotos
│   ├── my-portfolio/            ← Portfolio-Screenshot
│   ├── savesphere/              ← Projektbild + Teamfotos
│   ├── img-of-me/               ← Persönliche Fotos (1.jpg, 2.jpeg)
│   └── background-img/          ← Hero-Hintergrundbilder
├── json/
│   ├── aboutme.json             ← [[#AboutmeService]]-Daten
│   └── project-template.json   ← [[#ProjectService]]-Daten
└── animations/
    └── Code typing.mp4          ← Animationsvideo
```

### Globale Styles ([src/styles.css](src/styles.css))

- Tailwind CSS (base, components, utilities)
- Smooth Scroll
- System Font Stack
- **Custom Animations**: `fadeInUp`, `fadeInDown`, `fadeIn`, `scaleIn`, `slideInLeft`, `slideInRight`, `float`, `pulse-soft`, `gradient-shift`
- Scrollbar-Styling (lila Akzentfarbe)
- Text-Selektions-Styling

---

## Konfiguration

### App Config ([src/app/app.config.ts](src/app/app.config.ts))

```typescript
provideRouter(routes,
  withComponentInputBinding(),  // @Input() aus Routenparametern
  withHashLocation()            // Hash-basiertes Routing
),
provideHttpClient()
```

### angular.json

- **Output**: `dist/website`
- **Assets**: `src/favicon.ico`, `src/assets`
- **Styles**: Bootstrap CSS + `src/styles.css`
- **Budgets**: 1 MB Initial, 400 KB Component Styles

### tsconfig.json

- Target: ES2022
- Strict Mode aktiv (`strictNullChecks`, strict templates)
- Experimental Decorators aktiv
- JSON-Module-Import aktiviert

---

## Build & Deployment

| Befehl | Aktion |
|---|---|
| `npm start` | Lokaler Dev-Server (`localhost:4200`) |
| `npm run build` | Production Build → `dist/website/` |
| `npm run watch` | Watch-Modus Build |
| `npm test` | Karma Unit Tests |

**Styling-Pipeline**:
1. Tailwind CSS (Directives)
2. Bootstrap 5 (Framework)
3. Component-Scoped CSS
4. Globales `styles.css`

---

## Abhängigkeiten

### Core

| Paket | Version | Zweck |
|---|---|---|
| `@angular/core` | 17.1.0 | Framework |
| `@angular/router` | 17.1.0 | Routing |
| `@angular/forms` | 17.1.0 | Formulare |
| `rxjs` | ~7.8.0 | Reaktive Streams |
| `zone.js` | ~0.14.3 | Angular Zone |

### UI & Styling

| Paket | Version | Zweck |
|---|---|---|
| `bootstrap` | ^5.3.2 | CSS Framework |
| `@ng-bootstrap/ng-bootstrap` | ^16.0.0 | Angular Bootstrap |
| `tailwindcss` | ^3.4.3 | Utility CSS |
| `@popperjs/core` | ^2.11.8 | Popper Positionierung |

---

## Architekturmuster

### Datenfluss

```
src/assets/json/projects.json
    ↓ (HttpClient.get)
ProjectService (Transformation in View-Modell)
    ↓
Components (lesen via getProjectViews / specificProjectData)
```

### Inter-Component-Kommunikation

```
NavbarComponent
    → ScrollService.changeMessage(target)
        → HomeComponent (subscribt currentMessage$)
            → scrollToTarget(target)
```

### Scroll & Animation

| Technik | Verwendet in |
|---|---|
| `@HostListener('window:scroll')` | [[#NavbarComponent]], [[#TimelineComponent]] |
| `IntersectionObserver` | [[#ProjectOverviewComponent]], [[#AboutmeComponent]] |
| CSS Keyframes | Global (`styles.css`) |
| Typewriter-Loop | [[#StartComponent]] |
| Staggered Delays | [[#ProjectOverviewComponent]] (`i×120ms`), [[#AboutmeComponent]] |

### Performance

- `cdr.detach()` in [[#StartComponent]] (manuelle Change Detection)
- Standalone Components (kein NgModule-Overhead)
- Statisches JSON statt Backend-Aufruf — schneller Erststart, keine Netzwerkabhängigkeit
- `IntersectionObserver` statt Scroll-Events für Animationen

---

*Generiert: 2026-04-18 | Angular 17.1.0 | Obsidian-kompatibel*
