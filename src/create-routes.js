const fs = require('fs');
const path = require('path');

const routes = [
  'doctors',
  'specializations', 
  'cities',
  'create',
  'my-appointments',
  'cancel'
];

const baseDir = path.join(__dirname, 'app', 'api', 'appointments');

routes.forEach(route => {
  const dir = path.join(baseDir, route);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  }
  
  const routeFile = path.join(dir, 'route.ts');
  if (!fs.existsSync(routeFile)) {
    fs.writeFileSync(routeFile, '// Route file - add code here\n');
    console.log(`✅ Created: ${routeFile}`);
  }
});

console.log('\n✅ All route folders created!');