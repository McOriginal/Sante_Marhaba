const User = require('./../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Enregistrer un nouvel utilisateur
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement." });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifie si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Cet utilisateur n'existe pas invalides." });
    }

    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    // Générer le token JWT
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET ||
        'ZER45TYUIOPQSDbcdefghijklmnsopqrstuvwxyzFG4567H',
      {
        expiresIn: '1d', // expire dans '24h'
      }
    );

    // Retourner le token et les infos utilisateur
    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: payload,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
};
