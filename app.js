const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;
const secretKey = "your-secret-key"; // Replace with a strong and secure secret key

app.use(express.json());

app.get("/status", (req, res, next) => {
  res.json({ message: "API is up and running" });
});

app.post("/client-data", (req, res) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Token not provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the Authorization header

  console.log(token)

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    console.log("Dados do Cliente:", req.body);
  res.json({ message: "Dados do cliente recebidos com sucesso" });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

  
});

app.post("/authorize", (req, res) => {
  const { name, age } = req.body;

  if (age > 18) {
    res.json({ message: "Autorizado" });
  } else {
    res.status(401).json({ message: "Não autorizado" });
  }
});

// New endpoint to generate JWT token
app.post("/generate-token", (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res
      .status(400)
      .json({ message: "Bad Request: Name and age are required" });
  }

  const payload = {
    name, 
    age
  }

  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  res.json({ token });
});

app.post("/verify-token", (req, res) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Token not provided" });
  }

  //console.log(authHeader, "Esse é o token sem split");

  const token = authHeader.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    res.json({ message: "Token is valid", decoded });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
