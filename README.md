To access endpoints:
- Create "config.js" in scripts folder
- Add:

        export const CONFIG = {
            API_URL: "http://localhost:3000/data"
        }

- Server: https://github.com/clurect/small-node-server/tree/main
- To run server:
-   npm install
-   npm start


To run as a temporary extension on Firefox:
  - Go to about:debugging
  - Select "This Firefox"
  - Select "Load Temporary Add-on"
  - Select any file in project directory
