const db = require('../config/db'); // ملف الاتصال بقاعدة البيانات

exports.findByCode = async (code) => {
    const [rows] = await db.query(
        "SELECT * FROM promo_codes WHERE code = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at > NOW())",
        [code]
    );
    return rows[0];
};