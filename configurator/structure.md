                ┌────────────────────────────┐
                │   CONFIGURATOR (ADMIN)     │
                │----------------------------│
                │ - Add Users                │
                │ - Upload Instructions      │
                │ - Edit / Delete Data       │
                │ - Upload Images            │
                └────────────┬───────────────┘
                             │ (HTTP API Calls)
                             ▼
                ┌────────────────────────────┐
                │    BACKEND SERVER          │
                │  (Node.js + Express)       │
                │----------------------------│
                │  API Endpoints:            │
                │  /users                    │
                │  /instructions             │
                │----------------------------│
                │  Stores Data In:           │
                │  - Database (MySQL/JSON)   │
                │  - Images Folder           │
                └────────────┬───────────────┘
                             │ (Fetch Data)
                             ▼
                ┌────────────────────────────┐
                │      VIEWER APP            │
                │     (Electron EXE)         │
                │----------------------------│
                │  - Show Instructions       │
                │  - Show Users              │
                │  - Auto Slide Steps        │
                │----------------------------│
                │  LOCAL CACHE:              │
                │  - db.json                 │
                │  - images/                 │
                └────────────┬───────────────┘
                             │
          ┌──────────────────┴──────────────────┐
          ▼                                     ▼
 ┌──────────────────────┐            ┌──────────────────────┐
 │   OFFLINE MODE       │            │   ONLINE SYNC        │
 │----------------------│            │----------------------│
 │ - Server OFF         │            │ - Server ON          │
 │ - Load from db.json  │            │ - Fetch latest data  │
 │ - Show old data      │            │ - Update cache       │
 └──────────────────────┘            └──────────────────────┘




 