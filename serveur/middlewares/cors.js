const cors = require('cors');

app.use(cors({
    origin: "http://localhost:3000",  // Remplacez par l'URL de votre client React si différente
    credentials: true
}));
