# Kevin Wei's Homepage

This is the personal academic homepage for Kevin Wei, built with [Next.js 15](https://nextjs.org) and [TypeScript](https://www.typescriptlang.org/).

**Website:** [https://Kevinweisl.github.io/kevin-homepage](https://Kevinweisl.github.io/kevin-homepage)

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (version 20 or later is recommended).

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd kevin-homepage
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server after building:

```bash
npm start
```

## Project Structure

-   **`src/app`**: Next.js App Router pages and layouts.
-   **`src/components`**: Reusable React components.
-   **`src/data`**: Structured data for publications and experience. Modify files here to update content.
-   **`public`**: Static assets.

## content Updates

Content is managed via structured data files in `src/data`:
-   **Publications**: Edit `src/data/publications.ts`
-   **Experience**: Edit `src/data/experience.ts`

For more detailed development guidelines, please refer to `CLAUDE.md`.
