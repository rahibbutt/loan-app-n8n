const express = require('express')
const bcrypt = require('bcrypt')
const db = require('../db')
const router = express.Router()
const jwt = require('jsonwebtoken')

// Helper: exclude password from user object before sending response
function sanitizeUser(user) {
    const { password, ...safeUser } = user
    return safeUser
}

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        // Check if email already exists
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                console.error('DB read error:', err.message)
                return res.status(500).json({ message: 'Database error' })
            }

            if (user) {
                return res.status(409).json({ message: 'User already exists' })
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10)

            // Insert user into database
            db.run(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword],
                function (err) {
                    if (err) {
                        console.error('DB insert error:', err.message)
                        return res.status(500).json({ message: 'Database error during registration' })
                    }

                    return res.status(201).json({
                        message: 'User registered successfully',
                        userId: this.lastID,
                    })
                }
            )
        })
    } catch (err) {
        console.error('Registration error:', err)
        return res.status(500).json({ message: 'Server error during registration' })
    }
})

router.post('/login', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            console.error('DB error:', err.message)
            return res.status(500).json({ message: 'Database error' })
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        )

        const safeUser = sanitizeUser(user)
        //console.log('User from DB:', user)
        //console.log('Sanitized user:', safeUser)

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: safeUser,
        })
    })
})

module.exports = router
