import express from 'express';

const router = express.Router();

router.get('/subjects', async (req, res) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/subjects');

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to load subjects',
    });
  }
});

router.get('/units/:subject', async (req, res) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/units/${encodeURIComponent(req.params.subject)}`,
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to load units',
    });
  }
});

router.post('/generate-paper', async (req, res) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/generate-paper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Paper generation failed',
    });
  }
});

export default router;
