/**
 * @license MIT
 * @copyright 2024 EMMİ
 */

"use strict";
const router = express.Router();


router.get('/search', async (req, res) => {
    const query = req.query.q;

    try {
        const results = await BlogPost.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // başlıkta ara
                { content: { $regex: query, $options: 'i' } } // içerikte ara
            ]
        });

        res.json(results);
    } catch (err) {
        res.status(500).send('Sunucu hatası');
    }
});

module.exports = router;
