#!/usr/bin/env node
const fs = require('fs');
const figlet = require('figlet');
const gradient = require('gradient-string');
const { createCanvas } = require('canvas');

// creating output directory if it does not exist
const outputDir = './output';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Greeting message
console.log('Welcome to ASCII Art and Gif Generator!');
console.log('-------------------------------');

// Prompt for user input
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('Enter your text: ', async (text) => {
  readline.close();

  const selectedStyle = await selectStyle();

  generateAsciiArt(text, selectedStyle);
});

// Style selection prompt for ASCII style fonts
function selectStyle() {
  return new Promise((resolve, reject) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const styles = ['Standard', 'Slant', 'Ghost', 'Banner'];

    console.log('Select an ASCII art style:');
    styles.forEach((style, index) => {
      console.log(`(${index + 1}) ${style}`);
    });

    readline.question('Enter the number of the style: ', (input) => {
      readline.close();

      const styleIndex = Number(input) - 1;

      if (styleIndex >= 0 && styleIndex < styles.length) {
        const selectedStyle = styles[styleIndex];
        resolve(selectedStyle);
      } else {
        console.log("💀 Invalid Selection. Read the instructions on how to use the tool at https://github.com/mukundsolanki/artify-ascii");
      }
    });
  });
}

// Generating ASCII art
function generateAsciiArt(text, style) {
  console.log('Generating ASCII art...');
  figlet.text(text, { font: style }, async (err, asciiArt) => {
    if (err) {
      console.log('Error generating ASCII art:', err);
      return;
    }

    // Display the colorful ASCII art on the terminal
    console.log('\n' + gradient.rainbow(asciiArt)); //callback

    // size of the canvas
    const artLines = asciiArt.split('\n');
    const artWidth = artLines.reduce((max, line) => Math.max(max, line.length), 0);
    const artHeight = artLines.length;
    const canvasWidth = artWidth * 10;
    const canvasHeight = artHeight * 20;

    // Creating the canvas
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // creating the gradient
    const gradientFill = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradientFill.addColorStop(0, '#ff0000');  // Starting color
    gradientFill.addColorStop(1, '#00ff00');  // Ending color

    // Generating the canvas
    ctx.font = '16px Monospace';
    ctx.fillStyle = gradientFill;
    ctx.fillText(asciiArt, 10, 30);

    // Saving the canvas as a image 
    const imageBuffer = canvas.toBuffer();
    const outputFilePath = `${outputDir}/ascii_art_${Date.now()}.png`;
    fs.writeFileSync(outputFilePath, imageBuffer);

    console.log('ASCII art generated and saved as an image:', outputFilePath);
  });
}
