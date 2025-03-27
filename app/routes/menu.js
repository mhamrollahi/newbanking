const express = require('express');
const router = express.Router();

router.post("/toggle-menu", (req, res) => {
  const { menu } = req.body; // کلاس منو که کلیک شده

  if (!req.session.menuState) {
    req.session.menuState = {}; // مقداردهی اولیه
  }

  Object.keys(req.session.menuState).forEach((key) => {
    req.session.menuState[key] = false;
  });

  // تغییر وضعیت منو (باز/بسته)
  req.session.menuState[menu] = true
  
  res.json({ success: true, menuState: req.session.menuState });
});

module.exports = router;