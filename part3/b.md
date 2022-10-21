To allow for resource sharing between different domains (including localhost servers on different ports), cors needs to be installed and used.
```
npm install cors
```
```javascript
const cors = require('cors')
app.use(cors())
```

## Production build

Build a production build of the frontend by running `npm run build`. This command is created by create-react-app. The production build is created in the build folder. 

After building the frontend, the build folder has to be moved to the backend. Remember that a folder contained in the parent folder is accessed with ../subfolder, where .. brings you to the parent folder of the current folder. 
```bash
# Linux
cp -r build <backend directory>
# Windows
Xcopy /S /I /E build <backend directory>
```

Configure express to serve GET requests with static content from the build directory (by default it's `build`). Order of `app.use()` matters if there are conflicting addresses. In order to use a local build dir, it must be copied from the frontend to the backend, as above.
```javascript
const buildDir = 'build'
app.use(express.static(buildDir))
```

## Automate production

The following scripts in the **backend** can help automate this process. Replace the `<FRONT END>` and `<BACK END>` folders. This also assumes the frontend and backend are in the same parent folder, rewrite as necessary. 

```json
{
  "scripts": {
    // ...
    "build:ui": "rm -rf build && cd ../<FRONT END> && npm run build && cp -r build ../<BACK END>",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",    
    "logs:prod": "fly logs"
  }
}
```
| Script | Actions |
| --- | --- | Rebuild front end, move to backend removing previous |
| deploy:full | Rebuild and deploy |
| logs:prod | Show logs |

## Deploy to Fly.io

Fly.io is a free service that hosts webapps. After installing, authenticate with `fly auth login` (once). Navigate to root folder and init with `fly launch`. Open it in the browser with `fly open`. Deploy to production to internet with `fly deploy`. View server logs with `fly logs`. Test connection with `flyctl ping -o personal`.

Ensure port is set by the environment and not hardcoded.
```javascript
const PORT = process.env.PORT || 3001
app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`))
```

## Configure proxy

If `"proxy": "http://localhost:3001"` is added to the frontend package.json, react in development will use proxy when it is run on its own. 