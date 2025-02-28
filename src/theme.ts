import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  fonts: {
    primary: '"Montserrat", sans-serif',
    secondary: '"Source Serif 4", serif',
    tertiary: '"Fraunces", serif',
    monospace: '"Fragment Mono", monospace'
  },
  colors: {
    primary: "#F5F5DC",    // cream (light beige)
    secondary: "#dcf5df",  // light green
    tertiary: "#dce9f5",    // light blue
    summary: "#000000d9",
  }
};

export default theme;

// It is horrible having to maintain this manually and this code needs a refactor
// Plus the file format is not consistent JPG vs PNG
// Terrible terrible
export function getRandomImage(): string {
  // List the image file names available in public/img.
  const images = [
    '/img/painting1.jpg',
    '/img/painting2.png',
    '/img/painting3.jpg',
    '/img/painting4.png',
    '/img/painting5.png',
    '/img/painting6.png',
    '/img/painting7.png',
    '/img/painting8.png',
  ];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}