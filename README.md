# Graph Editor

## 1. Project Overview
- This project is a web-based graph editor designed to allow users to create, visualize, and analyze networks interactively. 
- Its goal is to provide an intuitive interface for graph manipulation, exploration, and analysis, making complex networks easier to understand and work with.
- The purpose of the project was to provide an intuitive tool for graph visualisation and manipulation. 
- Key Features:
    - Graph Management: Create, import (JSON), and export (JSON, GraphML, PNG) graphs.
    - Node & Edge Operations: Add, delete, and edit nodes and edges, including their attributes.
    - Editing Tools: Undo/redo actions and manual drag for repositioning nodes and clear the graph.
    - Layouts & Visualization: Switch between force-directed and hierarchical layouts; zoom, pan, and enable dark mode.
    - Styling & Filtering: Apply rule-based styling by attributes, filter properties, and search text.
    - Graph Analysis: Compute PageRank, Detect Communities, identify Connected Components, and calculate node Degrees.
    - Advanced Operations: Subgraph extraction, shortest-path finding, neighborhood expansion, find all children of a hierarchical graph, and subtract subgraphs.
    - Database Integration: Connect and interact with a Neo4j database. Auto-save is supported.

### - Updates After Final Demo:
- Following feedback from the final demo, the application was improved so that when a shortest path is found, all nodes and edges along the path are highlighted, and a notification shows the total cost, for example:
    ```
    Found path from "5" to "11" with total cost = 7
    ```
- If you do not see the notifications, please refresh the browser and try again. You will see several helpful and visually appealing notifications throughout the application.
    
## 2. Technical Stack
- Languages & Frameworks: TypeScript, Next.js
- Testing: Jest.js
- Libraries: Cytoscape.js, PrelineUI, Neo4j Graph Data Science
- Database: Neo4j

## 3. Prerequisites
- Before running the program, ensure the following:
    - Install dependencies:
    ```
    pnpm install

    ```
- Set up a Neo4j database:
    - Install Neo4j Desktop or use Neo4j Aura (cloud).
    - Create a database and change username, password in file .env in the project root with the credentials:
    ```
    NEO4J_USERNAME=neo4j
    NEO4J_PASSWORD=yourpassword
    ```
    - Make sure the Neo4j service is running before starting the app.

## 4. Getting Started
- Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
- Open http://localhost:3000
 in your browser to use the editor.
- To run unit tests:
```bash
npm test
# or
yarn test
# or
pnpm test
# or
bun test
```
