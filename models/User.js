const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {

    static async createNewUser({ email, password, first_name, last_name }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (email, password, first_name, last_name, bio) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, first_name, last_name, '']
        );

        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);
        return rows[0];
    }

    static generateToken(id) {
        return jwt.sign({ id: id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
    }

    static async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    static async getUserData(id) {
        const [rows] = await pool.query('SELECT email, first_name, last_name, profile_picture, bio, phone FROM users WHERE user_id = ?', [id]);
        return rows[0];
    }

    static async getAllUsers() {
        const [users] = await pool.query('SELECT user_id, first_name, last_name FROM users');
        return users;
    }

    static async updateUser({ email, first_name, last_name, phone, bio, profileImage }, id) {
        await pool.query(
            'UPDATE users SET email=?, first_name=?, last_name=?, bio=?, phone=?, profile_picture=? WHERE user_id=?',
            [email, first_name, last_name, bio, phone, profileImage, id]
        );
    }
}

module.exports = User;