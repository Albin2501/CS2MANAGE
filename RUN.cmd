cd backend && call npm install && cd ..
cd frontend && call npm install && cd ..
start cmd.exe /k "cd backend && npm start"
start cmd.exe /k "cd frontend && ng serve"
start "" "http://localhost:4200"
