
# Procedural Nature Studio 

An interactive generative graphics playground built with **JavaScript, HTML Canvas, and CSS**.

This is a personal project where I experimented with and expanded on concepts I learned in my Computer Graphics course, including L-systems, recursion, branching geometry, fractals, and procedural modeling.

Procedural Nature Studio lets users explore how simple mathematical rules can generate complex, nature-inspired patterns. Users can customize growth rules, adjust parameters, experiment with different patterns, and generate unique designs directly in their browser.

##  Live Demo

**[Try Procedural Nature Studio](https://anain0404.github.io/procedural-nature-studio/)**

Explore different procedural patterns, customize their growth rules, and generate your own designs.

##  Features

### Procedural Generation
- Six procedural patterns: Forest Canopy, Weeping Willow, Coral, Fern, Koch Snowflake, and Dragon Curve
- L-system-based procedural generation
- Editable axioms and production rules
- Recursive grammar expansion
- Turtle graphics for generating branching structures and fractal patterns
- Seeded randomness for reproducible variations

### Interactive Customization
- Adjust the number of generations
- Modify branch angles and angle variation
- Control step length and pattern complexity
- Experiment with four color palettes
- Enable depth-based color gradients
- Generate new variations using random seeds

### Canvas & Interface
- Interactive pan and zoom controls
- Double-click to reset the view
- Live segment, symbol, and generation counts
- Export generated designs as PNG images
- Responsive interface
- No external dependencies or build tools required

##  Tech Stack

| Technology | Purpose |
|------------|---------|
| JavaScript | L-system generation, recursive rules, seeded randomness, and interactive controls |
| HTML Canvas 2D | Rendering procedural geometry and exporting images |
| HTML5 | Application structure and user controls |
| CSS3 | Interface design and responsive styling |

## ⚙️ How It Works

Procedural Nature Studio uses **Lindenmayer systems (L-systems)** and turtle graphics to generate patterns from simple mathematical rules.

### 1. Axiom & Production Rules

An L-system begins with an initial string called an *axiom*. Production rules define how symbols are replaced during each generation.

For example:

```text
Axiom: F
Rule: F = F[+F]F[-F]F
```

Each generation replaces `F` with the production rule, gradually creating a more complex branching structure.

### 2. Recursive Grammar Expansion

The application applies the production rules repeatedly based on the selected number of generations.

Increasing the generation count produces more detailed patterns, while lower values create simpler structures.

### 3. Turtle Graphics Interpretation

After generating the symbol sequence, the application interprets it as drawing instructions.

| Symbol | Action |
|--------|--------|
| `F` or `G` | Draw forward |
| `f` | Move forward without drawing |
| `+` | Turn clockwise |
| `-` | Turn counterclockwise |
| `[` | Save current position and direction |
| `]` | Restore saved position and direction |
| `\|` | Turn 180 degrees |
| Other characters | Variables available for rewriting rules |

Branching patterns are created by saving and restoring the drawing state, allowing multiple segments to grow from the same point.

### 4. Randomization & Variation

Seeded randomness introduces controlled variations in branch angles.

Using the same seed and settings produces the same result, making it possible to reproduce a particular design.

### 5. Canvas Rendering

The generated geometry is drawn using the HTML Canvas 2D API.

Users can modify the parameters, regenerate patterns, navigate the canvas, and export the final design as a PNG image.

The application focuses on 2D procedural graphics rather than physically simulated plant growth or 3D modeling.

##  Getting Started

### Run Locally

**1. Clone the repository**

```bash
git clone https://github.com/anain0404/procedural-nature-studio.git
```

**2. Navigate to the project folder**

```bash
cd procedural-nature-studio
```

**3. Start a local server**

```bash
python3 -m http.server 8000
```

**4. Open the application**

Navigate to:

http://localhost:8000

No additional packages, dependencies, or build tools are required.

Alternatively, use the **[Live Demo](https://anain0404.github.io/procedural-nature-studio/)** to explore the application without installing anything.

##  Controls

| Action | Control |
|--------|---------|
| Change procedural pattern | Starting pattern dropdown |
| Adjust pattern complexity | Generations slider |
| Change branching direction | Turn angle slider |
| Introduce variations | Angle variation slider |
| Adjust segment size | Step length slider |
| Customize grammar | Edit axiom and production rules |
| Generate a new variation | New Seed button |
| Change appearance | Color palette controls |
| Pan around the canvas | Click and drag |
| Zoom in or out | Mouse wheel or trackpad |
| Reset view | Double-click or Reset View |
| Export design | Export PNG |

##  Project Structure

```text
procedural-nature-studio/
├── index.html
├── nature.js
├── nature.css
├── .gitignore
└── README.md
```

##  Future Improvements

As I continue experimenting with procedural graphics, I would like to explore:

- Animating generation-by-generation pattern growth
- Adding more complex plant structures and leaf geometry
- Implementing weighted production rules
- Supporting custom scene saving and loading
- Exporting designs as SVG files
- Exploring 3D procedural geometry

##  About This Project

I started Procedural Nature Studio to explore how the computer graphics concepts I was learning could be used to create interactive generative art.

I was especially interested in L-systems and how relatively simple rules could produce detailed branching structures and fractal patterns. I wanted to build something where I could experiment with these rules, change different parameters, and immediately see how they affected the result.

Through this project, I got to work more with recursive algorithms, procedural geometry, randomness, and interactive graphics programming.

## Author

**Anvesha Nain**

[Portfolio](https://anain0404.github.io/anvesha-portfolio/) | [GitHub](https://github.com/anain0404) | [LinkedIn](https://www.linkedin.com/in/anvesha-nain-a14033223/)
