const User = require('./../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
      return res.status(401).json({ message: 'Mot de passe incorrect .' });
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

// Update Password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'Ancien mot de passe incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: 'Erreur de changement veuillez réessayez.' });
  }
};

// Send verfiy code with Nodemailer
exports.sendVerifyCodePassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Générer un code aléatoire
    const code = Math.floor(1000 + Math.random() * 9000);
    const expires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Configuration transporteur
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Santé MARHABA" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Code de réinitialisation',
      text: `Votre code de réinitialisation est : ${code}. Il expire dans 10 seconde.`,
    });

    res
      .status(200)
      .json({ message: 'Code envoyé par email.', email, code, expires });
  } catch (err) {
    console.log('Erreur envoi email:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message:
          "Vous essayer de rénitialiser un utilisateur qui n'existe pas.",
      });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: 'Erreur de changement veuillez réessayez.' });
  }
};
