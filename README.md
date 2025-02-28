# Historicle v2 Client

A React-based application for displaying historical events and quizzing users on historical knowledge through an interactive interface.

## Overview

Historicle is a web application that presents historical facts and events in an engaging carousel format. It allows users to explore historical content and test their knowledge, with a final summary screen that provides feedback on their answers.

## Setup

1. **Clone the repository**
2. **Navigate to the client directory**
3. **Install dependencies**
4. **Start the development server**

## Project Structure

```
historicle-v2-client/
├── public/            # Public assets
│   ├── fonts/         # Custom fonts
│   ├── img/           # Images and daily JSON data
│   └── index.html     # Main HTML file
├── src/
│   ├── components/    # React components
│   ├── App.tsx        # Main application component
│   ├── daily.json     # Daily content configuration
│   ├── theme.ts       # Theme configuration
│   └── types.ts       # TypeScript type definitions
└── package.json       # Project dependencies and scripts
```

## Key Features

- Carousel-based navigation for historical content
- Dynamic background color changes based on application state
- Responsive design for various screen sizes
- Daily updated historical content

## Development

### Available Scripts

- `npm start` - Run the development server
- `npm test` - Run tests
- `npm run build` - Create production build
- `npm run eject` - Eject from Create React App

## Adding New Content

Historical content is stored in the `public/img/daily.json` file. To add new content, follow the format defined in the existing JSON structure.

## Deployment

Build the production-ready application with the build command. The compiled files will be in the `build/` directory, ready for deployment to any static hosting service.

## Technologies

- React
- TypeScript
- Styled Components
- Framer Motion
- Paintings as decorative elements

## License

MIT License
