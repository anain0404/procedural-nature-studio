# Procedural Nature Studio

An interactive generative graphics playground built with **JavaScript, HTML Canvas, and CSS**.

I built this project to experiment with L-systems, recursion, branching geometry, and procedural modeling concepts I learned in my Computer Graphics course. It lets users change the rules behind a pattern and see how a few symbols grow into complex shapes.

## Live demo

**[Try Procedural Nature Studio](https://anain0404.github.io/procedural-nature-studio/)**

The link will work after GitHub Pages is enabled for the repository.

## Features

- Six procedural patterns: forest canopy, weeping willow, coral, fern, Koch snowflake, and dragon curve
- Editable L-system axioms and production rules
- Adjustable generations, turn angle, step length, and angle variation
- Reproducible variations with seeded randomness
- Four color palettes and optional depth-based gradients
- Pan, zoom, and reset controls
- Live segment, symbol, and generation counts
- PNG export
- Limits on grammar expansion and geometry to keep large patterns manageable
- Runs in the browser with no external dependencies or build step

## How it works

An **L-system** starts with an axiom and repeatedly replaces symbols using production rules. The resulting sequence is interpreted as turtle-graphics instructions.

| Symbol | Action |
| --- | --- |
| `F` or `G` | Draw forward |
| `f` | Move forward without drawing |
| `+` | Turn clockwise |
| `-` | Turn counterclockwise |
| `[` | Save the current position and direction |
| `]` | Restore the saved position and direction |
| `|` | Turn 180 degrees |
| Other characters | Available as variables in rewriting rules |

For example, this rule creates a branching structure:

```text
Axiom: F
Rule: F = F[+F]F[-F]F
```

Each generation replaces `F` with the rule's result. Branch markers save and restore the drawing state, allowing segments to grow in different directions. The seed controls the small random variations applied to turns.

The application draws 2D procedural geometry with the Canvas API. It is not a 3D modeling engine or a physically simulated plant-growth system.

## Tech stack

| Technology | Purpose |
| --- | --- |
| JavaScript | Grammar expansion, seeded randomness, turtle graphics, and interactions |
| HTML Canvas 2D | Procedural geometry rendering and PNG export |
| HTML | Application layout and controls |
| CSS | Responsive interface and visual styling |

## Getting started

Clone the repository:

```bash
git clone https://github.com/anain0404/procedural-nature-studio.git
cd procedural-nature-studio
```

Start a local server:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser. No packages or build tools are required.

## Controls

| Action | Control |
| --- | --- |
| Switch patterns | Starting pattern dropdown |
| Change the design | Edit the axiom, rules, and sliders |
| Generate a variation | New seed button |
| Move around the canvas | Click and drag |
| Zoom | Scroll or trackpad |
| Restore the default view | Double-click or Reset view |
| Save artwork | Export PNG |

## Project structure

```text
procedural-nature-studio/
├── index.html
├── nature.js
├── nature.css
├── .gitignore
└── README.md
```

## Future improvements

- Animated generation-by-generation growth
- Additional grammar syntax and weighted production rules
- More complex plant structures and leaf geometry
- Custom scene save/load
- Vector SVG export

## Author

**Anvesha Nain**

[Portfolio](https://anain0404.github.io/anvesha-portfolio/) | [GitHub](https://github.com/anain0404) | [LinkedIn](https://www.linkedin.com/in/anvesha-nain-a14033223/)
